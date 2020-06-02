const knex = require('../database');
module.exports = {
    async checkQuestionnarie(id){
        var qnr = await knex('sbr_groups_sub_qn_qnr')
                        .where('id_sbr_qnr', id)
                        .where('deleted_at', null)
                        .pluck('id_sbr_groups_sub_qn');
        if(qnr.length > 0){
            try{
                var questions = await knex('sbr_groups_sub_qn').whereIn('id', qnr).where('deleted_at', null);
                if(questions.length > 0){return false;}
                else{return true;}
            }
            catch(error){
                return true;
            }
        }
        else{true}
    },
    async findUser(id){
        try{
            var user = await knex('sbr_users').where('id', id).first();
            if(user){
                return user.name;
            }
            else{
                return null;
            }
        }
        catch(error){
            return null;
        }
    },
    async findQuestionnaries(name, id){
        try{
            var qnr = await knex('sbr_qnr').where('name', name).where('id_sbr_users', id);
            if(qnr.length > 0){
                return false;
            }
            else{
                return true;
            }
        }
        catch(error){
            return false;
        }
    },
    async findSubGroup(id){
        var subgroups = await knex('sbr_groups_sub').where('id_sbr_groups', id).where('deleted_at', null);
        var quest;
        var aux = [];
        for (let i = 0; i < subgroups.length; i++) {
            quest = await knex('sbr_groups_sub_qn').where('id_sbr_groups_sub', subgroups[i].id).where('deleted_at', null);
            if(quest.length > 0){
                subgroups[i].questions = quest;
                aux[i] = subgroups[i];
            }
        }
        return aux;
    },
    async progressQuestionnarie(id){
        try {
            qnrQn = await knex('sbr_groups_sub_qn_qnr').where('id_sbr_qnr', id).pluck('id_sbr_groups_sub_qn');
            answered = await knex('sbr_groups_sub_qn_answers').where('id_sbr_qnr', id).pluck('id_sbr_groups_sub_qn');
            return parseFloat(answered.length/qnrQn.length)*100;
        } catch (error) {
            return null;
        }
    },
    async qtdeQuestions(id){
        try {
            qtde = await knex('sbr_groups_sub_qn_qnr').where('id_sbr_qnr', id).pluck('id_sbr_groups_sub_qn');
            return qtde.length;
        } catch (error) {
            return null;
        }
    },
    async getQuestions(qnr, id){
        try {
            var idsSub = [];
            for (let i = 0; i < qnr.length; i++) {
                aux = await knex.select('id_sbr_groups_sub').from('sbr_groups_sub_qn').where('id', qnr[i]).first();
                idsSub[i] = aux.id_sbr_groups_sub;
            }
            var subgroups = await knex('sbr_groups_sub').whereIn('id', idsSub);
            for (let i = 0; i < subgroups.length; i++) {
                quest = await knex('sbr_groups_sub_qn').whereIn('id', qnr);
                subgroups[i].questions = [];
                for (let j = 0; j < quest.length; j++) {
                    if(quest[j].id_sbr_groups_sub == subgroups[i].id){
                        quest[j].models = await knex.select('m.id', 'm.model')
                                                    .from('sbr_groups_sub_qn_models as m')
                                                    .join('sbr_groups_sub_qn_models_aux as aux')
                                                    .whereRaw(`aux.id_sbr_groups_sub_qn = ${quest[j].id}`)
                                                    .whereRaw('m.id = aux.id_sbr_groups_sub_qn_models');
                        
                        answer = await knex('sbr_groups_sub_qn_answers')
                                        .where('id_sbr_qnr', id)
                                        .where('id_sbr_groups_sub_qn', quest[j].id)
                                        .first();
                        (answer != undefined) ? quest[j].answer = answer.id_sbr_groups_sub_qn_models : quest[j].answer = null;
                        subgroups[i].questions[j] = quest[j];
                    }
                }
                subgroups[i].questions = filter_array(subgroups[i].questions);
            }
            return subgroups;    
        }
        catch (error) {
            console.log(error)
            return null;
        }
    },
    proportion(vMax, value){
        try {
            aux = ((value/vMax)*100);
            return aux;
        } catch (error) {
            return 0;
        }
    }
}
function filter_array(test_array) {
    var index = -1,
        arr_length = test_array ? test_array.length : 0,
        resIndex = -1,
        result = [];

    while (++index < arr_length) {
        var value = test_array[index];

        if (value) {
            result[++resIndex] = value;
        }
    }

    return result;
}