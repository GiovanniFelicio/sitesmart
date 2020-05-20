const knex = require('../../database');

module.exports = {
    index(req, res, next){
        var errors = req.cookies['errors'];
        var success = req.cookies['success'];
        res.clearCookie("errors", { httpOnly: true });
        res.clearCookie("success", { httpOnly: true });
        return res.render('auth/register',{
            layout: '',
            css: ['bootstrap/bootstrap.css',
                'all.min.css',
                'myLogin.css'],
            js: ['jquery/jquery.min.js', 
                'bootstrap/bootstrap.js'],
            errors: errors,
            success: success
        });
    },
    async create(req, res, next){
        var errors = [];
        if( !req.body.name || typeof req.body.name  == undefined || req.body.name  == null){
            errors.push({
                text: 'Invalid Name'
            })
        }
        if(!req.body.email || typeof req.body.email  == undefined || req.body.email  == null){
            errors.push({
                text: 'Invalid E-mail'
            })
        }
        if(!req.body.cpf || typeof req.body.cpf  == undefined || req.body.cpf  == null){
            errors.push({
                text: 'Invalid CPF'
            })
        }
        if(!req.body.password || typeof req.body.password  == undefined || req.body.password  == null){
            errors.push({
                text: 'Invalid Password'
            })
        }
        if(errors.length > 0){
            res.cookie('errors', errors, {httpOnly:true});
            res.redirect('/register');
        }
        else{
            const {name, email,cpf, password} = req.body;
            console.log(name);
            try{
                await knex('users').insert({
                    name: name,
                    email: email,
                    cpf: cpf,
                    password: password
                });
            }
            catch(error){
                next(error);
            }
            res.cookie('success', 'Successfully Created', {httpOnly:true});
            res.redirect('/login');
        }
        
    }
}