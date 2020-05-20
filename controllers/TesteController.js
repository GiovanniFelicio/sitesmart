const knex = require('../database');


module.exports = {
    async index(req,res,next){
        var posts = await knex.select().table('posts');
        return res.render('index', {posts: posts});
    },
    formCreate(req, res, next){
        return res.render('layouts/default',{
            layout: '',
            css: ['all.min.css',
                'ionicons.min.css',
                'tempusdominus-bootstrap-4.min.css',
                'bootstrap/bootstrap.css', 
                'bootstrap/icheck-bootstrap.css', 
                'adminlte.css',
                'OverlayScrollbars.min.css',
                'daterangepicker.css',
                'summernote-bs4.css', 
                'googleapis.css',
                'my.css'],
            jquery: ['jquery/jquery.min.js', 'jquery/jquery-ui.min.js'],
            js: ['bootstrap/bootstrap.bundle.js',
                'Chart.min.js',
                'sparkline.js', 
                'moment.min.js', 
                'daterangepicker.js',
                'tempusdominus-bootstrap-4.min.js',
                'summernote-bs4.js',
                'adminlte.js',
                'dashboard.js',
                'demo.js', 
                'popper.min.js']
        });
    },
    async create(req,res,next){
        try {
            var {titulo, conteudo} = req.body;
            await knex('posts').insert({
                title: titulo, 
                content:conteudo
            });
            return res.redirect('/posts');
        } catch (error) {
            next(error);
        }
    }
}