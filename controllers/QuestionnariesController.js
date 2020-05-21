const knex = require('../database');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
const Moment = require('moment');

module.exports = {
    async index(req, res, next){
        var courses = await knex('courses').where('deleted_at', null);
        courses.forEach(e => {
            e.id = cryptr.encrypt(e.id);
            e.created_at = Moment(e.created_at).format('DD-MM-Y  H:m:ss');
            e.broadcast_on = Moment(e.broadcast_on).format('DD-MM-Y  HH:mm:ss');
        });
        return res.render('courses/courses',{
            layout: 'home',
            css: ['all.min.css',
                'ionicons.min.css',
                'tempusdominus-bootstrap-4.min.css',
                'bootstrap/bootstrap.css',
                'adminlte.css',
                'my.css',
                'datatable/dataTables.bootstrap4.min.css'],
            jquery: ['jquery/jquery.min.js',
                    'bootstrap/bootstrap.js',
                    'datatable/jquery.datatable.min.js',
                    'datatable/dataTables.bootstrap4.min.js'],
            js: ['bootstrap/bootstrap.bundle.js',
                'adminlte.js',
                'popper.min.js',
                'jquery/jquery.maskMoney.js'],
            courses: courses
        });
    },
    async create(req, res, next){
        var errors = [];
        var error_msg = '';
        if( !req.body.courseName || typeof req.body.courseName  == undefined || req.body.courseName  == null){
            errors.push('Invalid Course Name');
        }
        if(!req.body.price || typeof req.body.price  == undefined || req.body.price  == null){
            errors.push( 'Invalid Price');
        }
        if(!req.body.broadcast_on || typeof req.body.broadcast_on  == undefined || req.body.broadcast_on  == null){
            errors.push( 'Invalid Broadcast On');
        }
        if(!req.body.speaker || typeof req.body.speaker  == undefined || req.body.speaker  == null){
            errors.push('Invalid Password');
        }
        if(errors.length > 0){
            errors.forEach(e => {
                error_msg +=e+', ';
            });
            req.flash('error_msg', error_msg);
            res.redirect('/courses');
        }
        else{
            try{
                await knex('courses').insert({
                    name: req.body.courseName,
                    price: req.body.price,
                    broadcast_on: req.body.broadcast_on,
                    speaker: req.body.speaker
                });
            }
            catch(error){
                next(error);
            }
            req.flash('success_msg', 'Added Course');
            res.redirect('/courses');
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