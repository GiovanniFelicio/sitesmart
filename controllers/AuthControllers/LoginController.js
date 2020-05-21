const passport = require('passport');
require('../../config/auth')(passport);
const knex = require('../../database');

module.exports = {
    index(req, res, next){
        var errors = req.cookies['errors'];
        var success = req.cookies['success'];
        res.clearCookie("errors", { httpOnly: true });
        res.clearCookie("success", { httpOnly: true });
        return res.render('auth/login',{
            layout: '',
            css: ['bootstrap.css',
                'all.min.css',
                'myLogin.css'],
            js: ['jquery.min.js', 
                'bootstrap.js'],
            errors: errors,
            success: success
        });
    },
    success(req,res,next){
        passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        })(req,res,next);
    }
}
function handleResponse(res, code, statusMsg) {
    res.status(code).json({status: statusMsg});
}