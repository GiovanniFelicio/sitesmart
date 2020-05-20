const LocalStrategy = require('passport-local').Strategy;
const knex = require('../database');

module.exports= (passport)=>{
    passport.use(new LocalStrategy({usernameField: 'cpf', passwordField: 'password'}, (cpf, password, done)=>{
        knex('users').where('cpf', cpf).first()
            .then((user)=>{
                if(!user){
                    return done(null, false, {message: 'This account does not exist'});
                }
                if (!password == user.password) {
                    return done(null, false, {message: 'Incorrect Password'});
                } else {
                    return done(null, user);
                }
            })
            .catch((err) => { 
                return done(err); 
            });
    }));

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        knex('users').where({id}).first()
        .then((user) => { 
            done(null, user); 
        })
        .catch((err) => { 
            done(err, null); 
        });
    });
}
