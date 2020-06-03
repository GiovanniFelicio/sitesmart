const knex = require('../database');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const Moment = require('moment');
module.exports = {
    async index(req, res, next){
        var groups = await knex('sbr_groups');
        groups.forEach(e => {
            e.id = cryptr.encrypt(e.id);
            e.created_at = Moment(e.created_at).format('DD-MM-Y  HH:mm:ss');
        });
        return res.render('groups/groups',{
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
            groups: groups
        });
    },
    async create(req, res, next){
        var errors = [];
        var error_msg = '';
        
        if( !req.body.name || typeof req.body.name  == undefined || req.body.name  == null){
            errors.push('Nome Inválido');
        }
        var group = await knex('sbr_groups').where('name', req.body.name);
        if(group.length > 0){
            req.flash('error_msg', 'Este grupo já existe');
            res.redirect('/groups');
        }
        if(errors.length > 0){
            errors.forEach(e => {
                error_msg +=e+', ';
            });
            req.flash('error_msg', error_msg);
            res.redirect('/groups');
        }
        else{
            try{
                await knex('sbr_groups').insert({
                    name: req.body.name
                });
            }
            catch(error){
                next(error);
            }
            req.flash('success_msg', 'Grupo adicionado com sucesso');
            res.redirect('/groups');
        }
    },
    async delete(req,res,next){
        var idEncrypt = req.params.id;
        var date = new Date();
        var currentDate = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
        try{
            var idDecrypt = cryptr.decrypt(idEncrypt);
            var subGroupUp = await knex('sbr_groups')
                                        .whereRaw('sbr_groups.id = '+idDecrypt)
                                        .update({
                                            'sbr_groups.deleted_at': currentDate
                                        });
                                        
            if(subGroupUp){
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
    async details(req,res,next){
        try {
            let idqnr = req.params.idqnr;
            let idgroup = req.params.idgroup;
            //res.send(totalQn);
            return res.render('groups/details',{
                layout: 'detailsLayout',
                style: ['styles/style.css'],
                css: ['bootstrap.min.css'],
                jquery: ['jquery.min.js'],
                src: ['plugins/highcharts-6.0.7/code/highcharts.js',
                    'plugins/highcharts-6.0.7/code/highcharts-more.js'],
                js: ['bootstrap.js',
                    'popper.min.js'],
                vendors: ['scripts/script.js'],
                idqnr: idqnr,
                idgroup: idgroup
            });
        }
        catch (error){
            //console.log(error);
            req.flash('error', 'Questionário Inválido');
            res.redirect('/questionnaries');
        }
    }
}