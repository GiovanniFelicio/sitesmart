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
        var groups = await knex('sbr_groups');
        for(let i = 0; i<groups.length; i++){
            groups[i].subgroups = await findSubGroup(groups[i].id);
        }
        return res.render('questionnaries/add',{
            layout: 'default',
            style: ['styles/style.css'],
            css: ['dataTables.bootstrap4.min.css', 'bootstrap.min.css'],
            jquery: ['jquery.min.js'],
            src: ['plugins/highcharts-6.0.7/code/highcharts.js',
                'plugins/highcharts-6.0.7/code/highcharts-more.js'],
            js: ['bootstrap.js',
                'popper.min.js',
                'jquery.datatable.min.js',
                'dataTables.bootstrap4.min.js',
                'select2.min.js'],
            vendors: ['scripts/script.js'],
            groups: groups
        });
    },
    async create(req, res, next){
        var errors = [];
        var error_msg = '';
        res.send(req.body);
        /*if( !req.body.name || typeof req.body.name  == undefined || req.body.name  == null){
            errors.push('Invalid Name');
        }
        if(req.body.groupCheck || typeof req.body.groupCheck  != undefined || req.body.groupCheck  != null){
            var groups = await knex('sbr_groups').whereIn('id', req.body.groupCheck);
            var subgroupsId = [];
            for(let i = 0; i < groups.length; i++){
                subgroupsId.push(await findSubGroupId(groups[i].id));
            }
            res.send(subgroupsId);
        }
        //res.send(subgroupsId);
        if(req.body.subgroupCheck || typeof req.body.subgroupCheck  != undefined || req.body.subgroupCheck  != null){
            var subgroups = await knex('sbr_groups_sub').whereIn('id', req.body.subgroupCheck).whereNotIn('id', subgroupsId);
            //res.send(subgroups);
            var subgroups = [];
            for(let i = 0; i < groups.length; i++){
                subgroups[i] = await findSubGroup(groups[i].id);
            }
            //res.send(subgroups);
        }
        /*
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
        }*/
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
async function findSubGroup(id){
    var subgroups = await knex('sbr_groups_sub').where('id_sbr_groups', id);
    for (let i = 0; i < subgroups.length; i++) {
        subgroups[i].questions = await knex('sbr_groups_sub_qn').where('id_sbr_groups_sub', subgroups[i].id);;
    }
    return subgroups;
}
async function findSubGroupId(id){
    return await knex.select('id').from('sbr_groups_sub').where('id_sbr_groups', id);
}