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
    async getGroups(qnr, idqnr){
        try {
            var idsSub = new Set(await knex('sbr_groups_sub_qn').whereIn('id', qnr).pluck('id_sbr_groups_sub'));
            var idsGroup = new Set(await knex('sbr_groups_sub').whereIn('id', [...idsSub]).pluck('id_sbr_groups'));
            var groups = await knex.select("id", "name").from("sbr_groups").whereIn("id", [...idsGroup]);
            for (let i = 0; i < groups.length; i++) {
                var subgroups = await knex.select("id", "id_sbr_groups", "name").from("sbr_groups_sub").whereIn("id", [...idsSub]);
                groups[i].subgroups = [];
                for (let j = 0; j < subgroups.length; j++) {
                    if(subgroups[j].id_sbr_groups == groups[i].id){
                        groups[i].subgroups[j] = await this.getSubGroups(subgroups[j], qnr, idqnr);
                    }
                }
                groups[i].subgroups = this.filter_array(groups[i].subgroups);
            }
            return groups;    
        }
        catch (error) {
            console.log(error)
            return null;
        }
    },
    async getSubGroups(subgroup, qnr, idqnr){
        try {
            quest = await knex.select('id', 'id_sbr_groups', 'id_sbr_groups_sub', 'question').from('sbr_groups_sub_qn').whereIn('id', qnr);
            subgroup.questions = [];
            var answered = [];
            var notAnswered = [];
            for (let i = 0; i < quest.length; i++) {
                if(quest[i].id_sbr_groups_sub == subgroup.id){
                    quest[i].models = await knex.select('aux.id', 'm.model')
                                                    .from('sbr_groups_sub_qn_models as m')
                                                    .join('sbr_groups_sub_qn_models_aux as aux')
                                                    .where('aux.deleted_at', null)
                                                    .whereRaw(`aux.id_sbr_groups_sub_qn = ${quest[i].id}`)
                                                    .whereRaw('m.id = aux.id_sbr_groups_sub_qn_models');   
                    answer = await knex('sbr_groups_sub_qn_answers')
                                    .where('id_sbr_qnr', idqnr)
                                    .where('id_sbr_groups_sub_qn', quest[i].id)
                                    .first();
                    (answer != undefined) ? quest[i].answer = answer.id_sbr_groups_sub_qn_models_aux : quest[i].answer = null;
                    subgroup.questions[i] = quest[i];
                    (quest[i].answer != null)?answered.push(1):notAnswered.push(0);
                }
            }
            subgroup.questions = this.filter_array(subgroup.questions);
            if(subgroup.questions.length == answered.length){
                subgroup.status = 2;
            }
            else if(subgroup.questions.length == notAnswered.length){
                subgroup.status = 0;
            }
            else if(subgroup.questions.length == (parseInt(notAnswered.length) + parseInt(answered.length))){
                subgroup.status = 1;
            }
            return subgroup
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
            var groupsAux = [];
            for (let i = 0; i < groups.length; i++) {
                var maxGroups = 0;
                var currentValue = 0;
                for (let j = 0; j < totalSub.length; j++) {
                    if (totalSub[j].id_sbr_groups == groups[i].id) {
                        if (totalSub[j].maxValue != 0 &&
                            typeof totalSub[j].maxValue != undefined &&
                            totalSub[j].maxValue != null &&
                            totalSub[j].currentValue != 0 &&
                            typeof totalSub[j].currentValue != undefined &&
                            totalSub[j].currentValue != null) {
                            maxGroups += totalSub[j].maxValue;
                            currentValue += totalSub[j].currentValue;  
                        }
                        
                    }
                }
                if (typeof currentValue != undefined){
                    groups[i].maxValue = maxGroups;
                    groups[i].currentValue = currentValue;
                    groups[i].percentage = this.round(this.proportion(maxGroups, currentValue), 2);
                    groupsAux[i] = groups[i];
                } 
            }
            return this.filter_array(groupsAux);
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
                var totalSub = 0;
                var maxSub = 0;
                for (let j = 0; j < quest.length; j++) {
                    if(quest[j].id_sbr_groups_sub == subgroups[i].id){
                        valueMax = await knex('sbr_groups_sub_qn_models_aux')
                                            .max('value as value')
                                            .where('id_sbr_groups_sub_qn', quest[j].id).first();
                        
                        model = await knex('sbr_groups_sub_qn_answers')
                                        .where('id_sbr_qnr', idQnr)
                                        .where('id_sbr_groups_sub_qn', quest[j].id).first();
                        try{
                            answer = await knex('sbr_groups_sub_qn_models_aux')
                                            .where('id_sbr_groups_sub_qn', quest[j].id)
                                            .where('id', model.id_sbr_groups_sub_qn_models_aux).first();
                            notApplicable = await knex("sbr_groups_sub_qn_models_aux")
                                                    .where("id_sbr_groups_sub_qn", quest[j].id)
                                                    .where("value", answer.value).first().pluck('id_sbr_groups_sub_qn_models');
                        }
                        catch(err){
                            answer = 0;
                            notApplicable = 10;
                        }
                        if (notApplicable != 10) {
                            maxSub += valueMax.value;
                            totalSub += answer.value;
                        }
                    }
                }
                if(typeof totalSub != undefined){
                    subgroups[i].maxValue = maxSub;
                    subgroups[i].currentValue = totalSub;
                    subgroups[i].percentage = this.round(this.proportion(maxSub, totalSub), 2);
                }
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
    },
    async checkIfAnswered(idqnr){
        try {
            var quests1 = await knex('sbr_groups_sub_qn_qnr').where('id_sbr_qnr', idqnr).pluck('id_sbr_groups_sub_qn');
            var quests2 = await knex('sbr_groups_sub_qn_answers').where('id_sbr_qnr', idqnr).pluck('id_sbr_groups_sub_qn');
            if(quests1.length == quests2.length){
                return true;
            }
            else{
                return false;
            }
        } catch (error) {
            return false;
        }
    }
}
