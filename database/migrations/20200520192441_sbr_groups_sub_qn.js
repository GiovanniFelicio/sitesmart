exports.up = function(knex) {
    return knex.schema.createTable('sbr_groups_sub_qn', (table)=>{
        table.increments('id');
        table.integer('id_sbr_groups_sub').notNullable();
        table.string('question').notNullable();
        table.string('type').notNullable();
        table.string('model').notNullable();
        table.string('value').nullable();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('sbr_groups_sub_qn');
};
