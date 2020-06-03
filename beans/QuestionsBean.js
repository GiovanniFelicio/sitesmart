const knex = require('../database');
module.exports = {
    async totalSubgroups(idQuests, idgroup, idQnr){
        try {
            let idsSub = [];
            for (let i = 0; i < idQuests.length; i++) {
                aux = await knex.select('id_sbr_groups_sub').from('sbr_groups_sub_qn').where('id', idQuests[i]).first();
                idsSub[i] = aux.id_sbr_groups_sub;
            }
            var subgroups = await knex.select('id', 'id_sbr_groups','name')
                                        .from('sbr_groups_sub')
                                        .where('id_sbr_groups', idgroup)
                                        .whereIn('id', idsSub);
            for (let i = 0; i < subgroups.length; i++) {
                let quest = await knex.select('id','id_sbr_groups', 'id_sbr_groups_sub', 'question')
                                        .from('sbr_groups_sub_qn')
                                        .whereIn('id', idQuests);
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
                                            .where('id_sbr_groups_sub_qn_models', model.id_sbr_groups_sub_qn_models).first();
                        }
                        catch(err){
                            answer = 0;
                        }                    
                        quest[j].currentValue = answer.value; 
                        quest[j].percentage = Math.round(proportion(quest[j].maxValue, quest[j].currentValue), 2);
                        subgroups[i].questions[j] = quest[j];
                        maxSub += quest[j].maxValue;
                        totalSub += quest[j].currentValue;
                    }
                }
                subgroups[i].questions = filter_array(subgroups[i].questions);
                subgroups[i].maxValue = maxSub;
                subgroups[i].currentValue = totalSub;
                subgroups[i].percentage = round(proportion(maxSub, totalSub), 2);
            }
            return subgroups;
        } catch (error) {
            console.log(error)
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
function proportion(vMax, value){
    try {
        aux = ((value/vMax)*100) || 0;
        return aux;
    } catch (error) {
        return 0;
    }
}
const round = (num, places) => {
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