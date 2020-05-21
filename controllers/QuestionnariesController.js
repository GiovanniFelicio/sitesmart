const knex = require('../database');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const Moment = require('moment');

module.exports = {
    async index(req, res, next){
        return res.render('questionnaries/questionnaries',{
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
            vendors: ['scripts/script.js']
        });
    },
    async add(req, res, next){
        return res.render('questionnaries/add',{
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
            vendors: ['scripts/script.js']
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
        if(type == 2){
            if( !req.body.model || typeof req.body.model  == undefined || req.body.model  == null){
                errors.push('Invalid Model');
            }
            else if(req.body.model == 0){
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
                try {
                    var model = req.body.anotherModel.join('#');
                    var value = req.body.value.join('#');
                } catch (error) {
                    req.flash('error_msg', 'Error in values');
                    res.redirect(req.header('Referer') || '/');
                }
                if (req.body.checkToSave && typeof req.body.checkToSave  != undefined && req.body.checkToSave  != null) {
                    if(await findModel(type, model) == false){
                        await insertModel(type, model, value);
                    }
                    var check = 1;
                }
                else{
                    var check = 0;
                }
            }
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
                await knex('sbr_groups_sub_qn').insert({
                    id_sbr_groups_sub: cryptr.decrypt(reference),
                    question: question,
                    type: type,
                    model: model || null,
                    value: value || null
                });
            }
            catch(error){
                next(error);
            }
            req.flash('success_msg', 'Added Question');
            res.redirect(req.header('Referer') || '/');
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
        var model = await knex('sbr_groups_sub_qn_models').where('type', type).where('model', model);
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
    var model = await knex('sbr_groups_sub_qn_models').insert({
        type: type,
        model: model,
        value, value
    });
}