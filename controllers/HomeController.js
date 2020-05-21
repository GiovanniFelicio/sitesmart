const knex = require('../database');

module.exports = {
    index(req, res, next){
        return res.render('home/home',{
            layout: 'default',
            style: ['styles/style.css'],
            jquery: ['jquery.min.js'],
            src: ['plugins/highcharts-6.0.7/code/highcharts.js',
                'plugins/highcharts-6.0.7/code/highcharts-more.js'],
            vendors: ['scripts/script.js']
        });
    },
}