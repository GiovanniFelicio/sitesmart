const knex = require('../database');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const Moment = require('moment');

module.exports = {
    async index(req, res, next){
        try {
            var id = cryptr.decrypt(req.params.id);
            var subgroups = await knex('sbr_groups_sub').where('id_sbr_groups', id);
        } catch (error) {
            req.flash('error_msg', 'Internal Error');
            res.redirect('/groups');
        }
        subgroups.forEach(e => {
            e.id = cryptr.encrypt(e.id);
            e.created_at = Moment(e.created_at).format('DD-MM-Y  H:m:ss');
        });
        return res.render('subgroups/subgroups',{
            layout: 'default',
            style: ['styles/style.css'],
            css: ['dataTables.bootstrap4.min.css'],
            jquery: ['jquery.min.js'],
            src: ['plugins/highcharts-6.0.7/code/highcharts.js',
                'plugins/highcharts-6.0.7/code/highcharts-more.js'],
            js: ['bootstrap.js',
                'popper.min.js',
                'jquery.datatable.min.js',
                'dataTables.bootstrap4.min.js'],
            vendors: ['scripts/script.js'],
            subgroups: subgroups,
            reference: req.params.id
        });
    },
    async create(req, res, next){
        var errors = [];
        var error_msg = '';
        if( !req.body.name || typeof req.body.name  == undefined || req.body.name  == null){
            errors.push('Invalid Name');
        }
        if( !req.body.reference || typeof req.body.reference  == undefined || req.body.reference  == null){
            errors.push('Invalid Data');
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
                await knex('sbr_groups_sub').insert({
                    id_sbr_groups: cryptr.decrypt(req.body.reference),
                    name: req.body.name
                });
            }
            catch(error){
                next(error);
            }
            req.flash('success_msg', 'Added SubGroup');
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