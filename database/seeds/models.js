
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('sbr_groups_sub_qn_models').del()
    .then(function () {
      // Inserts seed entries
      return knex('sbr_groups_sub_qn_models').insert([
        {model: 'Sim, em sistema integrado', value: '5'},
        {model: 'Sim, independente', value: '3'},
        {model: 'Sim, manual', value: '1'},
        {model: 'Não', value: '0'},
        {model: 'Nao se aplica', value: '0'}
      ]);
    });
};
