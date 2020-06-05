const knex = require('../database');
module.exports = {
    async totalQuestions(idQuests, idsub, idQnr){
        try {
            var quest = await knex.select('id','id_sbr_groups', 'id_sbr_groups_sub', 'question')
                                    .from('sbr_groups_sub_qn')
                                    .where('id_sbr_groups_sub', idsub)
                                    .whereIn('id', idQuests);
            var totalSub = 0;
            var maxSub = 0;
            for (let j = 0; j < quest.length; j++) {
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
                quest[j].percentage = Math.round(proportion(quest[j].maxValue, quest[j].currentValue), 2);
                maxSub += quest[j].maxValue;
                totalSub += quest[j].currentValue;
            }
            return quest;
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