const knex = require('../database');
const Moment = require('moment');
const BeansSub = require('../beans/SubgroupsBean');

module.exports = {
    async index(req, res, next){
        try {
            var id = req.params.id;
            var nameGroup = await knex('sbr_groups').where('id', id).pluck('name');
            var subgroups = await knex('sbr_groups_sub').where('id_sbr_groups', id);
            subgroups.forEach(async e => {
                questions = await knex('sbr_groups_sub_qn').where('id_sbr_groups_sub', e.id);
                e.qtde = questions.length;
                e.created_at = Moment(e.created_at).format('DD-MM-Y  HH:mm:ss');
            });
            
            return res.render('subgroups/subgroups',{
                layout: 'default',
                subgroups: subgroups,
                reference: req.params.id,
                name: nameGroup
            });
        } catch (error) {
            req.flash('error_msg', 'Error Interno ');
            res.redirect('/groups');
        }
    },
    async create(req, res, next){
        var errors = [];
        var error_msg = '';
        try {
            if( !req.body.name || typeof req.body.name  == undefined || req.body.name  == null){
                errors.push('Nome Inválido');
            }
            if( !req.body.reference || typeof req.body.reference  == undefined || req.body.reference  == null){
                errors.push('Referência Inválida');
            }
            if(errors.length > 0){
                errors.forEach(e => {
                    error_msg += e + ', ';
                });
                req.flash('error_msg', error_msg);
                res.redirect(req.header('Referer') || '/');
            }
            else{
                try{
                    await knex('sbr_groups_sub').insert({
                        id_sbr_groups: req.body.reference,
                        name: req.body.name
                    });
                }
                catch(error){
                    next(error);
                }
                req.flash('success_msg', 'SubGrupo adicionado com sucesso !!');
                res.redirect(req.header('Referer') || '/');
            }
        } catch (error) {
            req.flash('error_msg', 'Erro interno do servidor !!');
            res.redirect('/groups');
        }
    },
    async delete(req,res,next){
        var idEncrypt = req.params.id;
        try{
            var idDecrypt = idEncrypt;
            var date = new Date();
            var currentDate = date.getFullYear()+'-'+date.getMonth()+'-'+date.getDate()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
            try{
                var subGroupUp = await knex('sbr_groups_sub')
                                            .whereRaw('sbr_groups_sub.id = '+idDecrypt)
                                            .update({
                                                'sbr_groups_sub.deleted_at': currentDate,
                                            });
                if(subGroupUp){
                    return res.send('1');
                }
                else{
                    return res.send('0');
                }
            }
            catch(error){
               return res.send('0')
            }
        }
        catch(e){
            return res.send('0');
        }
    },
    async details(req,res,next){
        try {
            let idqnr = req.params.idqnr;
            let idsub = req.params.idsub;
            return res.render('subgroups/details',{
                layout: 'detailsLayout',
                idqnr: idqnr,
                idsub: idsub
            });
        }
        catch (error){
            console.log(error);
            req.flash('error', 'Questionário Inválido');
            res.redirect('/questionnaries');
        }
    },
    async getdetails(req,res,next){
        try {
            var idqnr = req.params.idqnr;
            var idsub = req.params.idsub;
            let qnr = await knex('sbr_groups_sub_qn_qnr').where('id_sbr_qnr', idqnr).pluck('id_sbr_groups_sub_qn');
            var subgroups = await BeansSub.totalQuestions(qnr, idsub, idqnr);
            return res.send(subgroups);
        } catch (error) {
            console.log(error);
            return null
        }
    }
}