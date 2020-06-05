const knex = require('../database');
module.exports = {
    async checkQuestionnarie(id){
        var qnr = await knex('sbr_groups_sub_qn_qnr')
                        .where('id_sbr_qnr', id)
                        .where('deleted_at', null)
                        .pluck('id_sbr_groups_sub_qn');
        var statusQnr = await knex('sbr_qnr').where('id', id).whereNot('status', 3);                        
        if (statusQnr.length <= 0) {
            return false;
        } else if (qnr.length > 0) {
          try {
            var questions = await knex("sbr_groups_sub_qn")
              .whereIn("id", qnr)
              .where("deleted_at", null);
            if (questions.length > 0) {
              return false;
            }
          } catch (error) {
            return true;
          }
        } 
        return true;
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
            var subgroups = await knex.select("id", "id_sbr_groups", "name")
                                        .from("sbr_groups_sub")
                                        .whereIn("id", idsSub);
            for (let i = 0; i < subgroups.length; i++) {
                quest = await knex.select('id', 'id_sbr_groups', 'id_sbr_groups_sub', 'question')
                                    .from('sbr_groups_sub_qn')
                                    .whereIn('id', qnr);
                subgroups[i].questions = [];
                for (let j = 0; j < quest.length; j++) {
                    if(quest[j].id_sbr_groups_sub == subgroups[i].id){
                        quest[j].models = await knex.select('aux.id', 'm.model')
                                                        .from('sbr_groups_sub_qn_models as m')
                                                        .join('sbr_groups_sub_qn_models_aux as aux')
                                                        .where('aux.deleted_at', null)
                                                        .whereRaw(`aux.id_sbr_groups_sub_qn = ${quest[j].id}`)
                                                        .whereRaw('m.id = aux.id_sbr_groups_sub_qn_models');
                        
                        answer = await knex('sbr_groups_sub_qn_answers')
                                        .where('id_sbr_qnr', id)
                                        .where('id_sbr_groups_sub_qn', quest[j].id)
                                        .first();
                        (answer != undefined) ? quest[j].answer = answer.id_sbr_groups_sub_qn_models_aux : quest[j].answer = null;
                        subgroups[i].questions[j] = quest[j];
                    }
                }
                subgroups[i].questions = this.filter_array(subgroups[i].questions);
            }
            return subgroups;    
        }
        catch (error) {
            console.log(error)
            return null;
        }
    },
    async totalQuestions(id, idQnr){
        try {
            var totalSub = await this.totalSubgroups(id, idQnr);
            let idsGroups = [];
            for (let i = 0; i < totalSub.length; i++) {
                aux = await knex.select('id_sbr_groups').from('sbr_groups_sub').where('id', totalSub[i].id).first();
                idsGroups[i] = aux.id_sbr_groups;
            }
            var groups = await knex.select('id', 'name').from('sbr_groups').whereIn('id', idsGroups);
            let totalGroups = 0;
            for (let i = 0; i < groups.length; i++) {
                groups[i].subgroups = [];
                var maxGroups = 0;
                var totalGroup = 0;
                for (let j = 0; j < totalSub.length; j++) {
                    if(totalSub[j].id_sbr_groups == groups[i].id){
                        groups[i].subgroups[j] = totalSub[j];
                        maxGroups += totalSub[j].maxValue;
                        totalGroup += totalSub[j].currentValue;
                    }
                }
                groups[i].subgroups = this.filter_array(groups[i].subgroups);
                groups[i].maxValue = maxGroups;
                groups[i].currentValue = totalGroup;
                groups[i].percentage = this.round(this.proportion(maxGroups, totalGroup), 2);
            }
            return groups;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
    filter_array(test_array) {
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
    },
    async totalSubgroups(id, idQnr){
        try {
            let idsSub = [];
            for (let i = 0; i < id.length; i++) {
                aux = await knex.select('id_sbr_groups_sub').from('sbr_groups_sub_qn').where('id', id[i]).first();
                idsSub[i] = aux.id_sbr_groups_sub;
            }
            var subgroups = await knex.select('id', 'id_sbr_groups','name').from('sbr_groups_sub').whereIn('id', idsSub);
            for (let i = 0; i < subgroups.length; i++) {
                let quest = await knex.select('id','id_sbr_groups', 'id_sbr_groups_sub', 'question')
                                        .from('sbr_groups_sub_qn')
                                        .whereIn('id', id);
                subgroups[i].questions = [];
                var totalSub = 0;
                var maxSub = 0;
                for (let j = 0; j < quest.length; j++) {
                    if(quest[j].id_sbr_groups_sub == subgroups[i].id){
                        valueMax = await knex('sbr_groups_sub_qn_models_aux')
                                            .max('value as value')
                                            .where('id_sbr_groups_sub_qn', quest[j].id).first();                        
                        quest[j].maxValue = valueMax.value;
                        model = await knex('sbr_groups_sub_qn_answers')
                                        .where('id_sbr_qnr', idQnr)
                                        .where('id_sbr_groups_sub_qn', quest[j].id).first();
                        try{
                            answer = await knex('sbr_groups_sub_qn_models_aux')
                                            .where('id_sbr_groups_sub_qn', quest[j].id)
                                            .where('id', model.id_sbr_groups_sub_qn_models_aux).first();
                        }
                        catch(err){
                            answer = 0;
                        }                    
                        quest[j].currentValue = answer.value; 
                        quest[j].percentage = Math.round(this.proportion(quest[j].maxValue, quest[j].currentValue), 2);
                        subgroups[i].questions[j] = quest[j];
                        maxSub += quest[j].maxValue;
                        totalSub += quest[j].currentValue;
                    }
                }
                subgroups[i].questions = this.filter_array(subgroups[i].questions);
                subgroups[i].maxValue = maxSub;
                subgroups[i].currentValue = totalSub;
                subgroups[i].percentage = this.round(this.proportion(maxSub, totalSub), 2);
            }
            return subgroups;
        } catch (error) {
            console.log(error)
        }
    },
    proportion(vMax, value){
        try {
            aux = ((value/vMax)*100) || 0;
            return aux;
        } catch (error) {
            return 0;
        }
    },
    round(num, places){
        if (!("" + num).includes("e")) {
            return +(Math.round(num + "e+" + places)  + "e-" + places);
        } else {
            let arr = ("" + num).split("e");
            let sig = ""
            if (+arr[1] + places > 0) {
                sig = "+";
            }
    
            return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + places)) + "e-" + places);
        }
    }
}
