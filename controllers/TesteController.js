const knex = require('../database');


module.exports = {
    async index(req,res,next){
        //var posts = await knex.select().table('posts');
        //return res.render('index', {posts: posts});
        console.log(await findId(1));
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

async function findId(id){
    var teste = await knex('sbr_users').where('id', id);
    return teste;
}