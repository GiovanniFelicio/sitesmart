const knex = require('../database');
module.exports = {
    async totalQuestions(idQuests, idsub, idQnr){
        try {
            var quest = await knex.select('id','id_sbr_groups', 'id_sbr_groups_sub', 'question')
                                    .from('sbr_groups_sub_qn')
                                    .where('id_sbr_groups_sub', idsub)
                                    .whereIn('id', idQuests);
            var questAux = [];
            for (let j = 0; j < quest.length; j++) {
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
                    notApplicable = await knex('sbr_groups_sub_qn_models_aux')
                                            .where('id_sbr_groups_sub_qn', quest[j].id)
                                            .where('value', answer.value).first().pluck('id_sbr_groups_sub_qn_models');                        
                }
                catch(err){
                    answer = 0;
                    notApplicable = 10;
                }
                if(notApplicable != 10){
                    quest[j].maxValue = valueMax.value;
                    quest[j].currentValue = answer.value; 
                    quest[j].percentage = Math.round(this.proportion(quest[j].maxValue, quest[j].currentValue), 2);
                    questAux[j] = quest[j];
                }
            }
            questAux = this.filter_array(questAux);
            return questAux;
        } catch (error) {
            console.log(error)
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
    removeDups(array) {
        let unique = {};
        array.forEach(function(i) {
          if(!unique[i]) {
            unique[i] = true;
          }
        });
        return Object.keys(unique);
    },
    async findQuestion(question){
        try{
            var findQuestion = await knex('sbr_groups_sub_qn').where('question', question);
            if(findQuestion > 0){
                return true;
            }
            else{
                return false;
            }
        }
        catch(error){
            return true;
        }
    },
    compare(arr1,arr2){
      
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
       
    },
    async checkIfUseModel(id) {
        try {
            var checkIfUseModel = await knex('sbr_groups_sub_qn_answers')
                                        .where('id_sbr_groups_sub_qn_models_aux', id)
                                        .pluck('id')
                                        .first();
            return checkIfUseModel;
        } catch (error) {
            console.log(error)
            return null;
        }
        
    }
}
