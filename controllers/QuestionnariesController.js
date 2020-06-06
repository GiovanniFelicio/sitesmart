const knex = require('../database');
const Moment = require('moment');
const BeansQnr = require('../beans/QuestionnariesBean');

module.exports = {
    async index(req, res, next){
        var qnrs = await knex('sbr_qnr');
        for (let i = 0; i < qnrs.length; i++) {
            qnrs[i].reference = qnrs[i].id;
            qnrs[i].id_sbr_users = await BeansQnr.findUser(qnrs[i].id_sbr_users);
            qnrs[i].created_at = Moment(qnrs[i].created_at).format('DD-MM-Y');
            qnrs[i].progress = await BeansQnr.progressQuestionnarie(qnrs[i].id);
            qnrs[i].qtde = await BeansQnr.qtdeQuestions(qnrs[i].id);
        }
        return res.render('questionnaries/questionnaries',{
            layout: 'default',
            questionnaries: qnrs
        });
    },
    async add(req, res, next){
        try {
            var groups = await knex('sbr_groups').where('deleted_at', null);
            var subgroup
            for (let i = 0; i < groups.length; i++) {
                subgroup = await BeansQnr.findSubGroup(groups[i].id);
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
            if(await BeansQnr.findQuestionnaries(req.body.name, 1) == false){
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
                    if(await BeansQnr.findQuestionnaries(req.body.name, 1)){
                        var insertQnr = await knex('sbr_qnr').insert({
                            name: req.body.name,
                            id_sbr_users: 1
                        });
                        try {
                            subgroups.forEach(async sub => {
                                questions = await knex('sbr_groups_sub_qn').where('id_sbr_groups_sub', sub.id).where('deleted_at', null)
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
            console.log(error)
            req.flash('error', 'Erro interno no servidor');
            res.redirect('/questionnaries');
        }
    },
    async reply(req, res, next){
        try {
            var id = req.params.id;
            var qnr = await knex('sbr_groups_sub_qn_qnr').where('id_sbr_qnr', id).pluck('id_sbr_groups_sub_qn');
            var checkQnr = await BeansQnr.checkQuestionnarie(id);
            if(checkQnr){
                await knex('sbr_qnr').where('id', id).update('status', 3);
                req.flash('error', 'Questionnário finalizado');
                res.redirect('/questionnaries');
            }
            else{
                var groups = await BeansQnr.getGroups(qnr, id);
                // res.send(groups);
                return res.render('questionnaries/reply',{
                    layout: 'default',
                    groups: groups,
                    reference: id
                });
            }
        } catch (error) {
            console.log(error)
            req.flash('error', 'Questionário Inválido');
            res.redirect('/questionnaries');
        }
    },
    async review(req,res,next){
        try {
            var id = req.params.id;
            var qnr = await knex('sbr_groups_sub_qn_qnr').where('id_sbr_qnr', id).pluck('id_sbr_groups_sub_qn');
            var checkQnr = await BeansQnr.checkQuestionnarie(id);
            if(checkQnr){
                await knex('sbr_qnr').where('id', id).update({
                    status: 3
                })
            }
            var groups = await BeansQnr.getGroups(qnr ,id);
            return res.render('questionnaries/review',{
                layout: 'default',
                groups: groups,
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
            try {
                let id = req.params.id;
                let qnr = await knex('sbr_groups_sub_qn_qnr').where('id_sbr_qnr', id).pluck('id_sbr_groups_sub_qn');
                let qnrDetails = await knex('sbr_qnr').where('id', id).first();
                var result = await BeansQnr.totalQuestions(qnr, id);
                let soma = 0;
                result.forEach(r => {
                    soma = soma + parseFloat(r.percentage);
                });
                var percentage = BeansQnr.round((soma/result.length), 2);
                return res.render('questionnaries/details',{
                    layout: 'default',
                    groups: result,
                    reference: req.params.id,
                    qnr: qnrDetails,
                    percentage: percentage
                });
            } catch (error) {
                console.log(error)
                req.flash('error', 'Questionário Inválido');
                res.redirect('/questionnaries');
            }
        }
        catch (error){
            console.log(error);
            req.flash('error', 'Questionário Inválido');
            res.redirect('/questionnaries');
        }
    },
    async saveQuestionnaries(req,res,next){
        if( !req.body.qnr || typeof req.body.qnr == undefined || req.body.qnr  == null){
            return res.send('0');
        }
        try{
            updatedQnr = await knex('sbr_qnr').where('id', req.body.qnr).update({
                status: 3
            });
            if(updatedQnr){
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
    async getScores(req, res, next){
        try {
            let id = req.params.id;
            let qnr = await knex('sbr_groups_sub_qn_qnr').where('id_sbr_qnr', id).pluck('id_sbr_groups_sub_qn');
            let idsSub = [];
            for (let i = 0; i < qnr.length; i++) {
                aux = await knex.select('id_sbr_groups_sub').from('sbr_groups_sub_qn').where('id', qnr[i]).first();
                idsSub[i] = aux.id_sbr_groups_sub;
            }
            var subgroups = await knex.select('id').from('sbr_groups_sub').whereIn('id', idsSub);
            let somaScoreSub = 0;
            for (let i = 0; i < subgroups.length; i++) {
                quest = await knex.select('id', 'id_sbr_groups_sub').from('sbr_groups_sub_qn').whereIn('id', qnr);
                subgroups[i].questions = [];
                let somaScoreQuest = 0;
                let qtdeQn = 0;
                for (let j = 0; j < quest.length; j++) {
                    if(quest[j].id_sbr_groups_sub == subgroups[i].id){
                        model = await knex('sbr_groups_sub_qn_answers')
                                        .where('id_sbr_qnr', id)
                                        .where('id_sbr_groups_sub_qn', quest[j].id).first();
                        try{
                            answer = await knex('sbr_groups_sub_qn_models_aux')
                                            .where('id_sbr_groups_sub_qn', quest[j].id)
                                            .where('id', model.id_sbr_groups_sub_qn_models_aux).first();
                        }
                        catch(err){
                            answer = 0;
                        }
                        expectedAux = await knex('sbr_groups_sub_qn_models_aux')
                                                .max('value as value')
                                                .where('id_sbr_groups_sub_qn', quest[j].id).first();
                        quest[j].score = BeansQnr.proportion(expectedAux.value, answer.value) || 0;
                        somaScoreQuest += parseFloat(quest[j].score);
                        qtdeQn++;
                        subgroups[i].questions[j] = quest[j];
                    }
                }
                subgroups[i].score = (somaScoreQuest/qtdeQn);
                somaScoreSub += parseFloat(subgroups[i].score);
            }
            var {scoreQnr} = (somaScoreSub/subgroups.length);
            return res.send(scoreQnr);
        }
        catch (error){
            return res.send('0');
        }
    },
    async results(req,res,next){
        try {
            let id = req.params.id;
            let qnr = await knex('sbr_groups_sub_qn_qnr').where('id_sbr_qnr', id).pluck('id_sbr_groups_sub_qn');
            var result = await BeansQnr.totalQuestions(qnr,id);
            return res.send(result)
        } catch (error) {
            console.log(error)
            return null;
        }
        
    }
}