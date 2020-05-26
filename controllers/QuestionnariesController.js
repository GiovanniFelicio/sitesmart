const knex = require('../database');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const Moment = require('moment');

module.exports = {
    async index(req, res, next){
        var questionnaries = await knex('sbr_qnr');
        questionnaries.forEach(async e => {
            e.id = cryptr.encrypt(e.id);
            e.id_sbr_users = await findUser(e.id_sbr_users);
            e.created_at = Moment(e.created_at).format('DD-MM-Y  H:m:ss');
        });
        return res.render('questionnaries/questionnaries',{
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
                'dataTables.responsive.min.js'],
            vendors: ['scripts/script.js'],
            questionnaries: questionnaries
        });
    },
    async add(req, res, next){
        try {
            var groups = await knex('sbr_groups').where('deleted_at', null);
            for (let i = 0; i < groups.length; i++) {
                var subgroup = await findSubGroup(groups[i].id);
                if(subgroup != ''){
                    groups[i].subgroups = subgroup;
                }
            }
            var dados = [];
            groups.forEach(gp => {
                try {
                    if(gp.subgroups.length > 0){
                        dados.push(gp);
                    }
                } 
                catch (error) {
                }
            });
            return res.render('questionnaries/add',{
                layout: 'default',
                style: ['styles/style.css'],
                css: ['dataTables.bootstrap4.min.css', 'responsive.dataTables.min.css'],
                jquery: ['jquery.min.js'],
                src: ['plugins/highcharts-6.0.7/code/highcharts.js',
                    'plugins/highcharts-6.0.7/code/highcharts-more.js'],
                js: ['bootstrap.js',
                    'popper.min.js',
                    'jquery.datatable.min.js',
                    'dataTables.bootstrap4.min.js',
                    'dataTables.responsive.min.js'],
                vendors: ['scripts/script.js'],
                groups: dados
            });
        } catch (error) {
            console.log(error);
            // req.flash('error', 'Erro interno no servidor');
            // res.redirect('/questionnaries');
        }
        
    },
    async create(req, res, next){
        var errors = [];
        var error_msg = '';
        try {
            if( !req.body.name || typeof req.body.name == undefined || req.body.name  == null){
                errors.push('Nome Inválido');
            }
            if(await findQuestionnaries(req.body.name, 1) == false){
                req.flash('error_msg', 'Este questionário já existe');
                return res.redirect('/questionnaries');
            }
            if(!req.body.subgroupCheck || req.body.subgroupCheck  == null || req.body.subgroupCheck.length <= 0){
                req.flash('error_msg', 'Error');
                return res.redirect('/questionnaries');
            }
            req.body.subgroupCheck.forEach(async sub => {
                var check = await knex('sbr_groups_sub_qn').where('id_sbr_groups_sub', sub);
                var sub = await knex('sbr_groups_sub').where('id', sub).first();
                if(check.length <= 0){
                    req.flash('error_msg', 'O SubGrupo: '+sub.name+' está vazio !!');
                    return res.redirect('/questionnaries');
                }
            });
            var subgroups = await knex.select('id').from('sbr_groups_sub').whereIn('id', req.body.subgroupCheck).where('deleted_at', null);
            if(errors.length > 0){
                errors.forEach(e => {
                    error_msg += e + ', ';
                });
                req.flash('error_msg', error_msg);
                return res.redirect('/questionnaries');
            }
            else{
                try{
                    if(await findQuestionnaries(req.body.name, 1)){
                        var insertQnr = await knex('sbr_qnr').insert({
                            name: req.body.name,
                            id_sbr_users: 1
                        });
                        try {
                            subgroups.forEach(async sub => {
                                insertQnrQn = await knex('sbr_groups_sub_qn_qnr').insert({
                                    id_sbr_groups_sub: sub.id,
                                    id_sbr_qnr: insertQnr
                                });
                            });
                            req.flash('success_msg', 'Questionário adicionado com sucesso');
                            return res.redirect('/questionnaries');
                        } catch (error) {
                            req.flash('error_msg', 'Erro ao criar questionário');
                            return res.redirect('/questionnaries');
                        }
                    }
                    else{
                        req.flash('error', 'Erro ao criar questionário');
                        return res.redirect('/questionnaries');
                    }
                }
                catch(error){
                    next(error);
                }
            }
        } 
        catch (error) {
            req.flash('error', 'Erro interno no servidor');
            res.redirect('/questionnaries');
        }
    },
    async reply(req, res, next){
        var id = cryptr.decrypt(req.params.id);
        var qnr = await knex('sbr_groups_sub_qn_qnr').where('id_sbr_qnr', id);
        var checkQnr = await checkQuestionnarie(id);
        if(checkQnr){
            await knex('sbr_qnr').where('id', id).update({
                status: 3
            })
            req.flash('error', 'Questionário Inválido');
            res.redirect('/questionnaries');
        }
        else{
            var questions = [];
            var group = [];
            for (let i = 0; i < qnr.length; i++) {
                subgroup = await knex.select('id', 'id_sbr_groups', 'name').from('sbr_groups_sub').where('id', qnr[i].id_sbr_groups_sub);
                try{
                    group = await knex('sbr_groups').where('id', subgroup[0].id_sbr_groups).first();
                    group.questions = await knex('sbr_groups_sub_qn').where('id_sbr_groups', group.id).where('deleted_at', null);
                    group.questions.forEach(async q => {
                        q.model = await knex.select('id', 'model', 'value', 'agroup')
                                    .from('sbr_groups_sub_qn_models')
                                    .where('agroup', q.model);
                        answer = await knex('sbr_groups_sub_qn_answers')
                                    .where('id_sbr_qnr', qnr[i].id_sbr_qnr)
                                    .where('id_sbr_groups_sub_qn', q.id)
                                    .first();
                        (answer != undefined) ? q.answer = answer.id_sbr_groups_sub_qn_models : q.answer = null;
                    });
                    //res.send(group);
                    //group.subgroups = subgroup;
                    /*group.subgroups.forEach(async sub => {
                        sub.questions = await knex.select('id', 'id_sbr_groups_sub', 'question', 'type', 'model')
                                                                    .from('sbr_groups_sub_qn')
                                                                    .where('id_sbr_groups_sub', sub.id)
                                                                    .where('deleted_at', null);
                        sub.questions.forEach(async q => {
                            q.model = await knex.select('id', 'model', 'value', 'agroup')
                                                .from('sbr_groups_sub_qn_models')
                                                .where('agroup', q.model);
                            answer = await knex('sbr_groups_sub_qn_answers')
                                            .where('id_sbr_qnr', qnr[i].id_sbr_qnr)
                                            .where('id_sbr_groups_sub_qn', q.id)
                                            .first();

                            (answer != undefined) ? q.answer = answer.id_sbr_groups_sub_qn_models : q.answer = null;
                        });
                    });*/
                    questions.push(group);
                }
                catch(error){
                }
            }
            return res.render('questionnaries/reply',{
                layout: 'default',
                style: ['styles/style.css'],
                css: ['bootstrap.min.css'],
                jquery: ['jquery.min.js'],
                src: ['plugins/highcharts-6.0.7/code/highcharts.js',
                    'plugins/highcharts-6.0.7/code/highcharts-more.js'],
                js: ['bootstrap.js',
                    'popper.min.js'],
                vendors: ['scripts/script.js'],
                groups: questions,
                reference: id
            });
        }
        
    },
    async review(req,res,next){
        var id = cryptr.decrypt(req.params.id);
        var qnr = await knex('sbr_groups_sub_qn_qnr').where('id_sbr_qnr', id);
        var checkQnr = await checkQuestionnarie(id);
        if(checkQnr){
            await knex('sbr_qnr').where('id', id).update({
                status: 3
            })
            req.flash('error', 'Questionário Inválido');
            res.redirect('/questionnaries');
        }
        else{
            var questions = [];
            var group = [];
            for (let i = 0; i < qnr.length; i++) {
                subgroup = await knex.select('id', 'id_sbr_groups', 'name').from('sbr_groups_sub').where('id', qnr[i].id_sbr_groups_sub);
                try{
                    group = await knex('sbr_groups').where('id', subgroup[0].id_sbr_groups).first();
                    group.subgroups = subgroup;
                    group.subgroups.forEach(async sub => {
                        sub.questions = await knex.select('id', 'id_sbr_groups_sub', 'question', 'type', 'model')
                                                                    .from('sbr_groups_sub_qn')
                                                                    .where('id_sbr_groups_sub', sub.id)
                                                                    .where('deleted_at', null);
                        sub.questions.forEach(async q => {
                            q.model = await knex.select('id', 'model', 'value', 'agroup')
                                                .from('sbr_groups_sub_qn_models')
                                                .where('agroup', q.model);
                            answer = await knex('sbr_groups_sub_qn_answers')
                                            .where('id_sbr_qnr', qnr[i].id_sbr_qnr)
                                            .where('id_sbr_groups_sub_qn', q.id)
                                            .first();

                            (answer != undefined) ? q.answer = answer.id_sbr_groups_sub_qn_models : q.answer = null;
                        });
                    });
                    questions.push(group);
                }
                catch(error){
                }
            }
            return res.render('questionnaries/review',{
                layout: 'default',
                style: ['styles/style.css'],
                css: ['bootstrap.min.css'],
                jquery: ['jquery.min.js'],
                src: ['plugins/highcharts-6.0.7/code/highcharts.js',
                    'plugins/highcharts-6.0.7/code/highcharts-more.js'],
                js: ['bootstrap.js',
                    'popper.min.js'],
                vendors: ['scripts/script.js'],
                groups: questions,
                reference: id
            });
        }
        
    },
    async saveQuestionnaries(req,res,next){
        if( !req.body.qnr || typeof req.body.qnr == undefined || req.body.qnr  == null){
            res.send('0');
        }
        try{
            updatedQnr = await knex('sbr_qnr').where('id', req.body.qnr).update({
                status: 3
            });
            if(updatedQnr){
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
async function checkQuestionnarie(id){
    var qnr = await knex('sbr_groups_sub_qn_qnr')
                    .where('id_sbr_qnr', id)
                    .where('deleted_at', null)
                    .pluck('id_sbr_groups_sub');
    if(qnr.length > 0){
        var subgroup = await knex('sbr_groups_sub')
                            .whereIn('id', qnr)
                            .whereNot('deleted_at', null).pluck('id_sbr_groups');
        var group = await knex('sbr_groups_sub')
                            .whereIn('id', subgroup)
                            .whereNot('deleted_at', null);
        if(subgroup.length > 0 || group.length > 0){return true;}
        else{return false;}
    }
    else{true}
}
async function findUser(id){
    try{
        var user = await knex('sbr_users').where('id', id).first();
        if(user){
            return user.name;
        }
        else{
            return null;
        }
    }
    catch(error){
        return mull;
    }
}
async function findQuestionnaries(name, id){
    try{
        var qnr = await knex('sbr_qnr').where('name', name).where('id_sbr_users', id);
        if(qnr.length > 0){
            return false;
        }
        else{
            return true;
        }
    }
    catch(error){
        return false;
    }
}
async function findSubGroup(id){
    var subgroups = await knex('sbr_groups_sub').where('id_sbr_groups', id);
    var auxSubgroups = [];
    for (let i = 0; i < subgroups.length; i++) {
        var quest = await knex('sbr_groups_sub_qn').where('id_sbr_groups_sub', subgroups[i].id);
        if(quest.length > 0){
            subgroups[i].questions = quest;
        }
        else{
            subgroups.splice(i);
        }
    }
    return subgroups;
}
