
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('sbr_groups_sub_qn_models').del()
    .then(function () {
      // Inserts seed entries
      return knex('sbr_groups_sub_qn_models').insert([
        {type: '2', model: 'Sim, em sistema integrado', value: '5', agroup: '1'},
        {type: '2', model: 'Sim, independente', value: '3', agroup: '1'},
        {type: '2', model: 'Sim, manual', value: '1', agroup: '1'},
        {type: '2', model: 'Não', value: '0', agroup: '1'},
        {type: '2', model: 'Nao se aplica', value: '0', agroup: '1'}
      ]);
    });
};
