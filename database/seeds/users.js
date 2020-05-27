
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('sbr_users').del()
    .then(function () {
      // Inserts seed entries
      return knex('sbr_users').insert([
        {name: 'Giovanni', username: 'giovannifc', email: 'giovanni@smartbr.com', password: 09112013, role: 5},
      ]);
    });
};
