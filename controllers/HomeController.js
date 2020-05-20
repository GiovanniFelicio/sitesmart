const knex = require('../database');

module.exports = {
    index(req, res, next){
        return res.render('layouts/home',{
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
}