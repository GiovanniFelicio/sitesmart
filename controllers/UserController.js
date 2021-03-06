const knex = require('../database');
const Moment = require('moment');

module.exports = {
    async index(req, res, next){
        try {
            var users = await knex('sbr_users');
        } catch (error) {
            req.flash('error_msg', 'Internal Error');
            res.redirect(req.header('Referer') || '/');
        }
        users.forEach(e => {
            e.created_at = Moment(e.created_at).format('DD-MM-Y  HH:mm:ss');
        });
        return res.render('users/users',{
            layout: 'default',
            users:users
        });
    },
    async create(req, res, next){
        var errors = [];
        var error_msg = '';
        try {
            if( !req.body.name || typeof req.body.name  == undefined || req.body.name  == null){
                errors.push('Nome Inválido');
            }
            if( !req.body.username || typeof req.body.username  == undefined || req.body.username  == null){
                errors.push('Username Inválido');
            }
            if( !req.body.email || typeof req.body.email  == undefined || req.body.email  == null){
                errors.push('E-mail inválido');
            }
            var findUser = await knex('sbr_users').where('username', req.body.username).orWhere('email', req.body.email);
            if(findUser.length > 0){
                req.flash('error_msg', 'Este usuário ou e-mail já existe!!');
                res.redirect('/users');
            }
            if( !req.body.password || typeof req.body.password  == undefined || req.body.password  == null){
                errors.push('Senha inválida');
            }
            if(errors.length > 0){
                errors.forEach(e => {
                    error_msg += e + ', ';
                });
                req.flash('error_msg', error_msg);
                res.redirect('/users');
            }
            else{
                var {name, username, email, password} = req.body;
                try{
                    var insert = await knex('sbr_users').insert({
                        name: name,
                        username: username,
                        email: email,
                        password: password,
                        role: 0
                    });
                    if(insert){
                        req.flash('success_msg', 'Usuário adicionado com sucesso');
                        res.redirect('/users');
                    }
                    else{
                        req.flash('error_msg', 'Error ao adicionar usuário');
                        res.redirect('/users');
                    }
                }
                catch(error){
                    next(error);
                }
            }
        } catch (error) {
            req.flash('error_msg', 'Error interno do servidor');
            res.redirect('/users');
        }
    },
    async delete(req,res,next){
        var id = req.params.id;
        var date = new Date();
        var currentDate = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
        try{
            const course = await knex('courses')
                .where({id: id})
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
function compare(arr1,arr2){
  
    if(!arr1  || !arr2) return
   
     let result;
   
   arr1.forEach((e1,i)=>arr2.forEach(e2=>{
     
          if(e1.length > 1 && e2.length){
             result = compare(e1,e2);
          }else if(e1 !== e2 ){
             result = false
          }else{
             result = true
          }
     })
   )
   
   return result
   
 }