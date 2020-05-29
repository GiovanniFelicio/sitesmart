
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('sbr_groups_sub_qn_models').del()
    .then(function () {
      // Inserts seed entries
      return knex('sbr_groups_sub_qn_models').insert([
        {model: 'Sim, em sistema integrado'},
        {model: 'Sim, independente'},
        {model: 'Sim, manual'},
        {model: 'Não'},
        {model: 'Nao se aplica'}
      ]);
    });
};
