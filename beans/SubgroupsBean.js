const knex = require('../database');
const BeansQuestions = require('../beans/QuestionsBean');
module.exports = {
    async totalSubgroups(idQuests, idgroup, idQnr) {
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
                var valueMax = 0;
                var currentValue = 0;
                quest = await BeansQuestions.totalQuestions(idQuests, subgroups[i].id, idQnr);
                for (let j = 0; j < quest.length; j++) {
                    currentValue += quest[j].currentValue; 
                    valueMax += quest[j].maxValue;
                }
                var percentage = Math.round(proportion(valueMax, currentValue), 2);
                subgroups[i].maxValue = valueMax;
                subgroups[i].currentValue = currentValue;
                subgroups[i].percentage = percentage;
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