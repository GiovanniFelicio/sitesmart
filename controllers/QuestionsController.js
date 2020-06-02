const knex = require('../database');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const Moment = require('moment');
const NodeTable = require('nodetable');

module.exports = {
    async index(req, res, next){
        try {
            var id = cryptr.decrypt(req.params.id);
            var questions = await knex('sbr_groups_sub_qn').where('id_sbr_groups_sub', id);
            var subgroups = await knex.raw(`select gp.name as gp_name, sub.name as sub_name 
                                        from sbr_groups_sub sub, sbr_groups gp 
                                        where sub.id = ${id}
                                        and gp.id = sub.id_sbr_groups; `);
            
            var  {gp_name, sub_name} = subgroups[0][0];
            questions.forEach(e => {
                e.number = e.id;
                e.id = cryptr.encrypt(e.id);
                e.created_at = Moment(e.created_at).format('DD-MM-Y  H:m:ss');
            });
            var models = await knex('sbr_groups_sub_qn_models');
            return res.render('questions/questions',{
                layout: 'default',
                style: ['styles/style.css'],
                css: ['dataTables.bootstrap4.min.css',
                        'responsive.dataTables.min.css'],
                jquery: ['jquery.min.js'],
                src: ['plugins/highcharts-6.0.7/code/highcharts.js',
                    'plugins/highcharts-6.0.7/code/highcharts-more.js'],
                js: ['bootstrap.js',
                    'popper.min.js',
                    'jquery.datatable.min.js',
                    'dataTables.bootstrap4.min.js',
                    'dataTables.responsive.min.js',
                    'select2.min.js'],
                vendors: ['scripts/script.js'],
                questions: questions,
                reference: req.params.id,
                models: models,
                gp_name: gp_name,
                sub_name: sub_name
            });
        } catch (error) {
            console.log(error);
            req.flash('error_msg', 'Error interno');
            res.redirect(req.header('Referer') || '/');
        }
    },
    async create(req, res, next){
        var errors = [];
        var error_msg = '';
        try {
            if( !req.body.question || typeof req.body.question  == undefined || req.body.question  == null){
                errors.push('Questão Inválida');
            }
            try{
                if(await findQuestion(req.body.question) == true){
                    req.flash('error_msg', 'Esta questão já existe');
                    res.redirect(req.header('Referer') || '/');
                }
            }
            catch(error){
                req.flash('error_msg', 'Error interno');
                res.redirect(req.header('Referer') || '/');
            }
            if( !req.body.reference || typeof req.body.reference  == undefined || req.body.reference  == null){
                errors.push('Erro de referência');
            }
            if( !req.body.modelsCheck || typeof req.body.modelsCheck  == undefined || req.body.modelsCheck  == null || req.body.modelsCheck.length <= 0){
                errors.push('Modelos inválidos');
            }
            if( !req.body.value || typeof req.body.value == undefined || req.body.value == null || req.body.value.length <= 0){
                errors.push('Valores inválidos');
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
                    var {question, reference, modelsCheck, value} = req.body;
                    if(modelsCheck.length != value.length){
                        throw "Quantidade de models diferente da quantia de valor";
                    }
                    var idSub = cryptr.decrypt(reference);
                    var subgroup = await knex('sbr_groups_sub').where('id', idSub).first();
                    var insertQuest = await knex('sbr_groups_sub_qn').insert({
                        id_sbr_groups: subgroup.id_sbr_groups,
                        id_sbr_groups_sub: idSub,
                        question: question
                    });
                    modelsCheck.forEach(async (id, i) => {
                        await knex('sbr_groups_sub_qn_models_aux').insert({
                            id_sbr_groups_sub_qn: insertQuest,
                            id_sbr_groups_sub_qn_models: id,
                            value: value[i] || 0
                        });
                    });
                    req.flash('success_msg', 'Questão adicionada');
                    return res.redirect(req.header('Referer') || '/');
                }
                catch(error){
                    req.flash('error_msg', 'Erro ao adicionar questão');
                    return res.redirect(req.header('Referer') || '/');
                }
            }
        } 
        catch (error) {
            req.flash('error_msg', error);
            return res.redirect(req.header('Referer') || '/');
        }
    },
    async save(req,res,next){
        try {
            if( !req.body.idQuestion || typeof req.body.idQuestion  == undefined || req.body.idQuestion  == null){
                return res.send('0');
            }
            else if( !req.body.answer || typeof req.body.answer  == undefined || req.body.answer  == null){
                return res.send('0');
            }
            else if( !req.body.qnr || typeof req.body.qnr  == undefined || req.body.qnr  == null){
                return res.send('0');
            }
            else{
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
                        return res.send('1');
                    }
                    else{
                        return res.send('0');
                    }
                }
                catch(e){
                    return res.send('0');
                }  
            }
        } catch (error) {
            return res.send('0');
        }
        
    },
    async delete(req,res,next){
        var idEncrypt = req.params.id;
        var date = new Date();
        var currentDate = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
        try{
            var idDecrypt = cryptr.decrypt(idEncrypt);
            var questionUp = await knex('sbr_groups_sub_qn')
                                        .where('id',idDecrypt)
                                        .update({
                                            'sbr_groups_sub_qn.deleted_at': currentDate
                                        });
                                        
            if(questionUp){
                return res.send('1');
            }
            else{
                return res.send('0');
            }
        }
        catch(e){
            return res.send('0');
        }
    },
    async getmodel(req,res,next){
        var id = req.params.id;
        try{
            var models = await knex.select('m.id', 'm.model', 'aux.value')
                                    .from('sbr_groups_sub_qn_models as m')
                                    .join('sbr_groups_sub_qn_models_aux as aux')
                                    .whereRaw(`aux.id_sbr_groups_sub_qn = ${id}`)
                                    .whereRaw('m.id = aux.id_sbr_groups_sub_qn_models');                      
            if(models){
                return res.send(models);
            }
            else{
                return res.send('0');
            }
        }
        catch(e){
            console.log(e)
            return res.send('0');
        }
    },
    async updateModel(req,res,next){
        var errors = [];
        var error_msg = '';
        try{
            if( !req.body.reference || typeof req.body.reference == undefined || req.body.reference == null){
                errors.push('Referência inválida');
            }
            else if( !req.body.value|| typeof req.body.value == undefined || req.body.value == null || req.body.value.length <= 0){
                errors.push('Valores inválidos');
            }
            else if( !req.body.model|| typeof req.body.model == undefined || req.body.model == null || req.body.value.length <= 0){
                errors.push('Modelos inválidos');
            }
            else if(req.body.value.length != req.body.model.length){
                errors.push('Valores e modelos incompatíveis');
            }
            if(errors.length > 0){
                errors.forEach(e => {
                    error_msg += e + ', ';
                });
                req.flash('error_msg', error_msg);
                res.redirect(req.header('Referer') || '/groups');
            }
            else{
                try {
                    var {value, model, reference} = req.body;
                    model.forEach(async (m, i) => {
                        await knex('sbr_groups_sub_qn_models_aux')
                                .where('id_sbr_groups_sub_qn', req.body.reference)
                                .where('id_sbr_groups_sub_qn_models', m)
                                .update({
                                    value: value[i]
                                });
                    });
                    req.flash('success_msg', 'Atualizado com sucesso !!');
                    return res.redirect(req.header('Referer') || '/groups');
                } catch (error) {
                    req.flash('error_msg', 'Error durante a atualização !!');
                    res.redirect(req.header('Referer') || '/groups');
                }
                
            }
        }
        catch(e){
            console.log(e)
            return res.send('0');
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