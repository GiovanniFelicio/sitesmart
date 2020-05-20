const knex = require('../database');

module.exports = {
    async index(req, res){
        const results = await knex('users').where('deleted_at', null);
        return res.json(results);
    },
    async update(req,res,next){
        try {
            const {username} = req.body;
            const {id} = req.params;
            await knex('users').update({username}).where({id});
            return res.send();
        } catch (error) {
            next(error);
        }
    },
    async delete(req, res, next){
        try {
            const {id} = req.params;
            await knex('users').where('id',id).update('deleted_at', new Date());
            return res.send();
        } catch (error) {
            next(error);
        }
    }
}

