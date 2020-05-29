const knex = require('../database');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const Moment = require('moment');

module.exports = {
    async index(req, res, next){
        var qnrs = await knex('sbr_qnr');
        for (let i = 0; i < qnrs.length; i++) {
            qnrs[i].reference = cryptr.encrypt(qnrs[i].id);
            qnrs[i].id_sbr_users = await findUser(qnrs[i].id_sbr_users);
            qnrs[i].created_at = Moment(qnrs[i].created_at).format('DD-MM-Y');
            qnrs[i].progress = await progressQuestionnarie(qnrs[i].id);
            qnrs[i].qtde = await qtdeQuestions(qnrs[i].id);
        }
        return res.render('questionnaries/questionnaries',{
            layout: 'default',
            style: ['styles/style.css'],
            css: ['dataTables.bootstrap4.min.css',
                    'responsive.dataTables.min.css'],
            jquery: ['jquery.min.js'],
            src: ['plugins/highcharts-6.0.7/code/highcharts.js',
                'plugins/highcharts-6.0.7/code/highcharts-more.js'],
            js: ['jquery.datatable.min.js',
                'dataTables.bootstrap4.min.js',
                'dataTables.responsive.min.js'],
            vendors: ['scripts/script.js'],
            questionnaries: qnrs
        });
    },
    async add(req, res, next){
        try {
            var groups = await knex('sbr_groups').where('deleted_at', null);
            var subgroup
            for (let i = 0; i < groups.length; i++) {
                subgroup = await findSubGroup(groups[i].id);
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
            req.flash('error', 'Erro interno no servidor');
            res.redirect('/questionnaries');
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
                                questions = await knex('sbr_groups_sub_qn').where('id_sbr_groups_sub', sub.id)
                                questions.forEach(async quest => {
                                    insertQnQnr = await knex('sbr_groups_sub_qn_qnr').insert({
                                        id_sbr_groups_sub_qn: quest.id,
                                        id_sbr_qnr: insertQnr
                                    });
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
        try {
            var id = cryptr.decrypt(req.params.id);
            var qnr = await knex('sbr_groups_sub_qn_qnr').where('id_sbr_qnr', id).pluck('id_sbr_groups_sub_qn');
            var checkQnr = await checkQuestionnarie(id);
            if(checkQnr){
                await knex('sbr_qnr').where('id', id).update('status', 3);
                req.flash('error', 'Questionnário finalizado');
                res.redirect('/questionnaries');
            }
            else{
                var subgroups = await getQuestions(qnr, id);
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
                    groups: subgroups,
                    reference: id
                });
            }
        } catch (error) {
            req.flash('error', 'Questionário Inválido');
            res.redirect('/questionnaries');
        }
        
    },
    async review(req,res,next){
        try {
            var id = cryptr.decrypt(req.params.id);
            var qnr = await knex('sbr_groups_sub_qn_qnr').where('id_sbr_qnr', id).pluck('id_sbr_groups_sub_qn');
            var checkQnr = await checkQuestionnarie(id);
            if(checkQnr){
                await knex('sbr_qnr').where('id', id).update({
                    status: 3
                })
            }
            var subgroups = await getQuestions(qnr ,id);
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
                groups: subgroups,
                reference: id
            });
        }
        catch (error){
            req.flash('error', 'Questionário Inválido');
            res.redirect('/questionnaries');
        }
    },
    async details(req, res, next){
        try {
            var id = cryptr.decrypt(req.params.id);
            var qnr = await knex('sbr_groups_sub_qn_qnr').where('id_sbr_qnr', id).pluck('id_sbr_groups_sub_qn');
            var idsSub = [];
            for (let i = 0; i < qnr.length; i++) {
                aux = await knex.select('id_sbr_groups_sub').from('sbr_groups_sub_qn').where('id', qnr[i]).first();
                idsSub[i] = aux.id_sbr_groups_sub;
            }
            var subgroups = await knex.select('id', 'name').from('sbr_groups_sub').whereIn('id', idsSub);
            for (let i = 0; i < subgroups.length; i++) {
                quest = await knex.select('id', 'id_sbr_groups_sub', 'question').from('sbr_groups_sub_qn').whereIn('id', qnr);
                subgroups[i].questions = [];
                var soma = 0;
                var qtde = 0;
                for (let j = 0; j < quest.length; j++) {
                    if(quest[j].id_sbr_groups_sub == subgroups[i].id){
                        model = await knex('sbr_groups_sub_qn_answers')
                                        .where('id_sbr_qnr', id)
                                        .where('id_sbr_groups_sub_qn', quest[j].id).first();
                        answer = await knex('sbr_groups_sub_qn_models_aux')
                                        .where('id_sbr_groups_sub_qn', quest[j].id)
                                        .where('id_sbr_groups_sub_qn_models', model.id_sbr_groups_sub_qn_models).first();
                        expectedAux = await knex('sbr_groups_sub_qn_models_aux')
                                                .max('value as value')
                                                .where('id_sbr_groups_sub_qn', quest[j].id).first();
                        quest[j].score = proportion(expectedAux.value, answer.value);
                        soma += parseFloat(quest[j].score);
                        qtde++;
                        subgroups[i].questions[j] = quest[j];
                    }
                }
                subgroups[i].score = (soma/qtde);
            }
            res.send(subgroups)
            /*return res.render('questionnaries/review',{
                layout: 'default',
                style: ['styles/style.css'],
                css: ['bootstrap.min.css'],
                jquery: ['jquery.min.js'],
                src: ['plugins/highcharts-6.0.7/code/highcharts.js',
                    'plugins/highcharts-6.0.7/code/highcharts-more.js'],
                js: ['bootstrap.js',
                    'popper.min.js'],
                vendors: ['scripts/script.js'],
                groups: subgroups,
                reference: id
            });*/
        }
        catch (error){
            req.flash('error', 'Questionário Inválido');
            res.redirect('/questionnaries');
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
    }
}
async function checkQuestionnarie(id){
    var qnr = await knex('sbr_groups_sub_qn_qnr')
                    .where('id_sbr_qnr', id)
                    .where('deleted_at', null)
                    .pluck('id_sbr_groups_sub_qn');
    if(qnr.length > 0){
        try{
            var questions = await knex('sbr_groups_sub_qn').whereIn('id', qnr).where('deleted_at', null);
            if(questions.length > 0){return false;}
            else{return true;}
        }
        catch(error){
            return true;
        }
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
        return null;
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
    var subgroups = await knex('sbr_groups_sub').where('id_sbr_groups', id).where('deleted_at', null);
    var quest;
    var aux = [];
    for (let i = 0; i < subgroups.length; i++) {
        quest = await knex('sbr_groups_sub_qn').where('id_sbr_groups_sub', subgroups[i].id).where('deleted_at', null);
        if(quest.length > 0){
            subgroups[i].questions = quest;
            aux[i] = subgroups[i];
        }
    }
    return aux;
}
async function progressQuestionnarie(id){
    try {
        qnrQn = await knex('sbr_groups_sub_qn_qnr').where('id_sbr_qnr', id).pluck('id_sbr_groups_sub_qn');
        answered = await knex('sbr_groups_sub_qn_answers').where('id_sbr_qnr', id).pluck('id_sbr_groups_sub_qn');
        return parseFloat(answered.length/qnrQn.length)*100;
    } catch (error) {
        return null;
    }
}
async function qtdeQuestions(id){
    try {
        qtde = await knex('sbr_groups_sub_qn_qnr').where('id_sbr_qnr', id).pluck('id_sbr_groups_sub_qn');
        return qtde.length;
    } catch (error) {
        return null;
    }
}
async function getQuestions(qnr, id){
    try {
        var idsSub = [];
        for (let i = 0; i < qnr.length; i++) {
            aux = await knex.select('id_sbr_groups_sub').from('sbr_groups_sub_qn').where('id', qnr[i]).first();
            idsSub[i] = aux.id_sbr_groups_sub;
        }
        var subgroups = await knex('sbr_groups_sub').whereIn('id', idsSub);
        for (let i = 0; i < subgroups.length; i++) {
            quest = await knex('sbr_groups_sub_qn').whereIn('id', qnr);
            subgroups[i].questions = [];
            for (let j = 0; j < quest.length; j++) {
                if(quest[j].id_sbr_groups_sub == subgroups[i].id){
                    quest[j].models = await knex.select('m.id', 'm.model')
                                                .from('sbr_groups_sub_qn_models as m')
                                                .join('sbr_groups_sub_qn_models_aux as aux')
                                                .whereRaw(`aux.id_sbr_groups_sub_qn = ${quest[j].id}`)
                                                .whereRaw('m.id = aux.id_sbr_groups_sub_qn_models');
                    
                    answer = await knex('sbr_groups_sub_qn_answers')
                                    .where('id_sbr_qnr', id)
                                    .where('id_sbr_groups_sub_qn', quest[j].id)
                                    .first();
                    (answer != undefined) ? quest[j].answer = answer.id_sbr_groups_sub_qn_models : quest[j].answer = null;
                    subgroups[i].questions[j] = quest[j];
                }
            }
        }
        return subgroups;    
    }
    catch (error) {
        return null;
    }
}
function proportion(vMax, value){
    try {
        aux = ((value*10/vMax));
        return aux;
    } catch (error) {
        return 0;
    }
}