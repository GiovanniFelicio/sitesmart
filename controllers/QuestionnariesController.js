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
        if(await findQuestionnaries(req.body.name, 1) == false){
            req.flash('error_msg', 'The Questionnaries already exist');
            res.redirect(req.header('Referer') || '/');
        }
        var subgroupsId = [];
        if(req.body.groupCheck || typeof req.body.groupCheck  != undefined || req.body.groupCheck  != null){
            var groups = await knex('sbr_groups').whereIn('id', req.body.groupCheck);
            for(let i = 0; i < groups.length; i++){
                subgroupsId.push(await findSubGroupId(groups[i].id));
            }
        }
        var subgroups = [];
        if(req.body.subgroupCheck || typeof req.body.subgroupCheck  != undefined || req.body.subgroupCheck  != null){   
            if(subgroupsId.length > 0){
                for (let i = 0; i < subgroupsId.length; i++) {
                    subgroups.push(await knex('sbr_groups_sub').whereNotIn('id', req.body.subgroupCheck).pluck('id'));
                }
            }
        }
        var groupCheck;
        var subgroupCheck;
        try {
            if(req.body.groupCheck.length > 0){
                groupCheck = req.body.groupCheck.join(',');
            }
            if(subgroups.length > 0 ){
                subgroupCheck = subgroups.join(',');
            }
        } catch (error) {
            //
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
                        id_sbr_users: 1
                    });
                    var insertQnrQn = await knex('sbr_groups_sub_qn_qnr').insert({
                        id_sbr_groups: groupCheck || null,
                        id_sbr_groups_sub: subgroupCheck || null,
                        id_sbr_qnr: insertQnr
                    });
                    req.flash('success_msg', 'Added Questionnarie');
                    res.redirect('/questionnaries');
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
        
        var questions = await getQuestions(id);
        res.send(questions);
        // try {
        // } catch (error) {
        //     req.flash('error_msg', 'Internal Error');
        //     res.redirect('/groups');
        // }
        /*return res.render('questionnaries/reply',{
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
        });*/
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
async function getQuestions(groups){
    var all = await knex.raw(`SELECT gp.id as id_group, gp.name as name_group,
                                    sub.id as id_sub, sub.name as name_sub,
                                    q.id as id_question, q.question as question_name
                                FROM sbr_groups_sub_qn q, sbr_groups_sub sub, sbr_groups gp
                                WHERE q.id_sbr_groups_sub = sub.id
                                AND gp.id = sub.id_sbr_groups
                                AND gp.id in(${groups});`);
    //var allSplitGroup = all.id_sbr_groups.split(',');
    //const subgroups = await knex.select('id', 'name').from('sbr_groups_sub').whereIn('id_sbr_groups', allSplitGroup).where('deleted_at', null);
    return all;
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
async function findSubGroupId(id){
    return await knex('sbr_groups_sub').where('id_sbr_groups', id).pluck('id');
}