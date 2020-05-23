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
            questionnaries: questionnaries
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
        if( !req.body.name || typeof req.body.name == undefined || req.body.name  == null){
            errors.push('Invalid Name');
        }
        if(await findQuestionnaries(req.body.name, req.user.id) == false){
            req.flash('error_msg', 'The Questionnaries already exist');
            res.redirect(req.header('Referer') || '/');
        }
        var subgroupsF = [];
        if(req.body.groupCheck || typeof req.body.groupCheck  != undefined || req.body.groupCheck  != null){
            if(req.body.subgroupCheck.length > 0){
                subgroups = await knex.select('id')
                                        .from('sbr_groups_sub')
                                        .whereNotIn('id_sbr_groups', req.body.groupCheck)
                                        .whereIn('id', req.body.subgroupCheck);
                
                for (let i = 0; i < subgroups.length; i++) {
                    subgroupsF.push(subgroups[i].id);
                }
            }
        }
        var groupsAndSubgroups = [];
        var size;
        if(req.body.groupCheck.length > subgroups.length){
            size = req.body.groupCheck.length;
        }
        else{
            size = subgroups.length;
        }
        for (let i = 0; i < size; i++) {
            groupsAndSubgroups.push({'group': req.body.groupCheck[i], 'subgroup': subgroupsF[i]});
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
                if(await findQuestionnaries(req.body.name, 1)){
                    var insertQnr = await knex('sbr_qnr').insert({
                        name: req.body.name,
                        id_sbr_users: req.user.id
                    });
                    for (let i = 0; i < groupsAndSubgroups.length; i++) {
                        insertQnrQn = await knex('sbr_groups_sub_qn_qnr').insert({
                            id_sbr_groups: groupsAndSubgroups[i].group,
                            id_sbr_groups_sub: groupsAndSubgroups[i].subgroup,
                            id_sbr_qnr: insertQnr
                        });
                    }

                    if(insertQnrQn){
                        req.flash('success_msg', 'Added Questionnarie');
                        res.redirect('/questionnaries');
                    }
                }
                else{
                    req.flash('error', 'Error when adding');
                    res.redirect(req.header('Referer') || '/');
                }
            }
            catch(error){
                next(error);
            }
        }
    },
    async reply(req,res,next){
        var id = cryptr.decrypt(req.params.id);
        var qnr = await knex('sbr_groups_sub_qn_qnr').where('id_sbr_qnr', id);
        var questions = [];
        var group = [];
        for (let i = 0; i < qnr.length; i++) {
            if(typeof qnr[i].id_sbr_groups != undefined || qnr[i].id_sbr_groups != null|| qnr[i].id_sbr_groups != ''){
                group = await knex.select('id', 'name').from('sbr_groups').where('id', qnr[i].id_sbr_groups).first();
                group.subgroups = await knex.select('id', 'id_sbr_groups', 'name').from('sbr_groups_sub').where('id_sbr_groups', qnr[i].id_sbr_groups);
                group.subgroups.forEach(async sub => {
                    sub.questions = await knex.select('id', 'id_sbr_groups_sub', 'question', 'type', 'model')
                                                                .from('sbr_groups_sub_qn')
                                                                .where('id_sbr_groups_sub', sub.id)
                                                                .where('deleted_at', null);
                    
                    sub.questions.forEach(async q => {
                        q.model = await knex.select('id', 'model', 'value', 'agroup').from('sbr_groups_sub_qn_models').where('agroup', q.model);
                        answer = await knex('sbr_groups_sub_qn_answers')
                                            .where('id_sbr_qnr', qnr[i].id_sbr_qnr)
                                            .where('id_sbr_groups_sub_qn', q.id)
                                            .first();
                        (answer != undefined) ? q.answer = answer.id_sbr_groups_sub_qn_models : q.answer = null;
                    });
                });
                questions.push(group);
            }
            if(typeof qnr[i].id_sbr_groups_sub != undefined || qnr[i].id_sbr_groups_sub != null|| qnr[i].id_sbr_groups_sub != ''){
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
                            q.model = await knex.select('id', 'model', 'value', 'agroup').from('sbr_groups_sub_qn_models').where('agroup', q.model);
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
        }
       //res.send(questions);
        return res.render('questionnaries/reply',{
            layout: 'default',
            style: ['styles/style.css'],
            css: ['dataTables.bootstrap4.min.css', 'bootstrap.min.css'],
            jquery: ['jquery.min.js'],
            src: ['plugins/highcharts-6.0.7/code/highcharts.js',
                'plugins/highcharts-6.0.7/code/highcharts-more.js'],
            js: ['bootstrap.js',
                'popper.min.js',
                'jquery.datatable.min.js',
                'dataTables.bootstrap4.min.js'],
            vendors: ['scripts/script.js'],
            groups: questions,
            reference: id
        });
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
async function getQuestions(id){
    var qnr = knex('sbr_groups_sub_qn_qnr').where('id_sbr_qnr', id);
    var questions = [];
    for (let i = 0; i < qnr.length; i++) {
        var group = await knex('sbr_groups').where('id', qnr[i].id_sbr_groups).first();
        var subgroups = await knex('sbr_groups_sub').where('id_sbr_groups', qnr[i].id_sbr_groups);
        questions.push({'group': group,
                        'subgroups': subgroups})
        
    }
    /*var all = await knex.raw(`SELECT gp.id as id_group, gp.name as name_group,
                                    sub.id as id_sub, sub.name as name_sub,
                                    q.id as id_question, q.question as question_name
                                FROM sbr_groups_sub_qn q, sbr_groups_sub sub, sbr_groups gp
                                WHERE q.id_sbr_groups_sub = sub.id
                                AND gp.id = sub.id_sbr_groups
                                AND gp.id in(${groups});`);
    //var allSplitGroup = all.id_sbr_groups.split(',');*/
    //const subgroups = await knex.select('id', 'name').from('sbr_groups_sub').whereIn('id_sbr_groups', allSplitGroup).where('deleted_at', null);
    return qnr;
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
    for (let i = 0; i < subgroups.length; i++) {
        subgroups[i].questions = await knex('sbr_groups_sub_qn').where('id_sbr_groups_sub', subgroups[i].id);;
    }
    return subgroups;
}