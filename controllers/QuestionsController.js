const knex = require('../database');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const Moment = require('moment');

module.exports = {
    async index(req, res, next){
        try {
            var id = cryptr.decrypt(req.params.id);
            var questions = await knex('sbr_groups_sub_qn').where('id_sbr_groups_sub', id);
        } catch (error) {
            req.flash('error_msg', 'Internal Error');
            res.redirect(req.header('Referer') || '/');
        }
        questions.forEach(e => {
            e.number = e.id;
            e.id = cryptr.encrypt(e.id);
            e.created_at = Moment(e.created_at).format('DD-MM-Y  H:m:ss');
        });
        var models = [];
        var modelsAgroup = await knex.select('agroup').from('sbr_groups_sub_qn_models').groupBy('agroup');
        for (let i = 0; i < modelsAgroup.length; i++) {
            models.push({'agroup': modelsAgroup[i].agroup, 'model': await findModels(modelsAgroup[i].agroup)});
        }

        return res.render('questions/questions',{
            layout: 'default',
            style: ['styles/style.css'],
            css: ['dataTables.bootstrap4.min.css'],
            jquery: ['jquery.min.js'],
            src: ['plugins/highcharts-6.0.7/code/highcharts.js',
                'plugins/highcharts-6.0.7/code/highcharts-more.js'],
            js: ['bootstrap.js',
                'popper.min.js',
                'jquery.datatable.min.js',
                'dataTables.bootstrap4.min.js',
                'select2.min.js'],
            vendors: ['scripts/script.js'],
            questions: questions,
            reference: req.params.id,
            models: models
        });
    },
    async create(req, res, next){
        var errors = [];
        var error_msg = '';
        if( !req.body.question || typeof req.body.question  == undefined || req.body.question  == null){
            errors.push('Invalid Question');
        }
        try{
            if(await findQuestion(req.body.question) == true){
                req.flash('error_msg', 'This question already exists');
                res.redirect(req.header('Referer') || '/');
            }
        }
        catch(error){
            req.flash('error_msg', 'Internal Error');
            res.redirect(req.header('Referer') || '/');
        }
        if( !req.body.reference || typeof req.body.reference  == undefined || req.body.reference  == null){
            errors.push('Invalid Data');
        }
        if( !req.body.type || typeof req.body.type  == undefined || req.body.type  == null){
            errors.push('Invalid Type');
        }

        var {reference, question, type} = req.body;
        //res.send({reference, question, type});
        if(type == 2){
            if( !req.body.model || typeof req.body.model  == undefined || req.body.model  == null){
                errors.push('Invalid Model');
                console.log('ola');
            }
            /*else if(req.body.model == 0){
                if( !req.body.anotherModel || typeof req.body.anotherModel  == undefined || req.body.anotherModel  == null){
                    errors.push('Invalid Another Model');
                }
                if( !req.body.value || typeof req.body.value  == undefined || req.body.value  == null){
                    errors.push('Invalid Value');
                }
                if(req.body.anotherModel.length != req.body.value.length){
                    req.flash('error_msg', 'Model quantities and Values ​​are different');
                    res.redirect(req.header('Referer') || '/');
                }
                
                /*if (req.body.checkToSave && typeof req.body.checkToSave  != undefined && req.body.checkToSave  != null) {
                    if(await findModel(type, model) == false){
                        res.send(model);
                        var teste = await insertModel(type, req.body.anotherModel, req.body.value);
                        console.log(teste);
                    }
                    var check = 1;
                }
                else{
                    var check = 0;
                }
            }*/
            else{
                var model = req.body.model;
            }
        }
        
        if(errors.length > 0){
            errors.forEach(e => {
                error_msg += e + ', ';
            });
            req.flash('error_msg', error_msg);
            res.redirect(req.header('Referer') || '/');
        }
        else{
            try{
                var insert = await knex('sbr_groups_sub_qn').insert({
                    id_sbr_groups_sub: cryptr.decrypt(reference),
                    question: question,
                    type: type,
                    model: model || null
                });
                if(insert){
                    req.flash('success_msg', 'Added Question');
                    res.redirect(req.header('Referer') || '/');
                }
                else{
                    req.flash('error_msg', 'Error when adding question');
                    res.redirect(req.header('Referer') || '/');
                }
            }
            catch(error){
                next(error);
            }
            
        }
    },
    async save(req,res,next){
        if( !req.body.idQuestion || typeof req.body.idQuestion  == undefined || req.body.idQuestion  == null){
            res.send('0');
        }
        if( !req.body.answer || typeof req.body.answer  == undefined || req.body.answer  == null){
            res.send('0');
        }
        if( !req.body.qnr || typeof req.body.qnr  == undefined || req.body.qnr  == null){
            res.send('0');
        }
        var {idQuestion, answer, qnr} = req.body;
        var savedQuests;
        try{
            savedQuests = await knex('sbr_groups_sub_qn_answers').where('id_sbr_groups_sub_qn', idQuestion).where('id_sbr_qnr', qnr);
            getQnr = await knex('sbr_groups_sub_qn_answers').where('id_sbr_qnr', qnr);
            if(getQnr.length <= 0){
                updatedQnr = await knex('sbr_qnr').where('id', req.body.qnr).update({
                    status: 2
                });
            }
            if(savedQuests.length > 0){
                saveQuest = await knex('sbr_groups_sub_qn_answers').where('id_sbr_groups_sub_qn', idQuestion).where('id_sbr_qnr', qnr).update({
                    id_sbr_groups_sub_qn_models: answer
                });
            }
            else{
                saveQuest = await knex('sbr_groups_sub_qn_answers').insert({
                    id_sbr_groups_sub_qn: idQuestion,
                    id_sbr_qnr: qnr,
                    id_sbr_groups_sub_qn_models: answer
                });
            }
            
            if(saveQuest){
                res.send('1');
            }
            else{
                res.send('0');
            }
        }
        catch(e){
            res.send('0');
        }
    },
    async delete(req,res,next){
        var idEncrypt = req.params.id;
        var date = new Date();
        var currentDate = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
        try{
            var idDecrypt = cryptr.decrypt(idEncrypt);
            const course = await knex('courses')
                .where({id: idDecrypt})
                .update({
                    deleted_at: currentDate
                });
            req.flash('success_msg', 'Deleted Course');
            res.redirect('/courses');
        }
        catch(e){
            req.flash('error_msg', 'Error when deleting the Course');
            res.redirect('/courses');
        }
    }
}
function removeDups(array) {
    let unique = {};
    array.forEach(function(i) {
      if(!unique[i]) {
        unique[i] = true;
      }
    });
    return Object.keys(unique);
  }
async function findModels(agroup){
    var model = await knex('sbr_groups_sub_qn_models').where('agroup', agroup).pluck('model');
    return model.join(' - ');
}
async function findQuestion(question){
    try{
        var findQuestion = await knex('sbr_groups_sub_qn').where('question', question);
        if(findQuestion > 0){
            return true;
        }
        else{
            return false;
        }
    }
    catch(error){
        return true;
    }
}
async function findModel(type, model){
    try{
        model.forEach(async e => {
            var model = await knex('sbr_groups_sub_qn_models').where('type', type).where('model', model);
        });
        if(model > 0){
            return true;
        }
        else{
            return false;
        }
    }
    catch(error){
        return true;
    }
}
async function insertModel(type, model, value){
    final.forEach(async e => {
        var model = await knex('sbr_groups_sub_qn_models').insert({
            type: type,
            model: model,
            value, value
        });
    });
}
function compare(arr1,arr2){
  
    if(!arr1  || !arr2) return
   
     let result;
   
   arr1.forEach((e1,i)=>arr2.forEach(e2=>{
     
          if(e1.length > 1 && e2.length){
             result = compare(e1,e2);
          }else if(e1 !== e2 ){
             result = false
          }else{
             result = true
          }
     })
   )
   
   return result
   
 }