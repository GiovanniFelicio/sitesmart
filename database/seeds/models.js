
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('sbr_groups_sub_qn_models').del()
    .then(function () {
      // Inserts seed entries
      return knex('sbr_groups_sub_qn_models').insert([
        {model: 'Sim, em sistema integrado'},
        {model: 'Sim, eletrônico manual'},
        {model: 'Sim, de forma eficaz'},
        {model: 'Sim, razoavelmente'},
        {model: 'Sim, independente'},
        {model: 'Sim, em papel'},
        {model: 'Sim, manual'},
        {model: 'Sim'},
        {model: 'Não'},
        {model: 'Não se aplica'},
        {model: 'Não, mas preciso'},
      ]);
    });
};
