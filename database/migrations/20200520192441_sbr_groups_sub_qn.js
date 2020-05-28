exports.up = function(knex) {
    return knex.schema.createTable('sbr_groups_sub_qn', (table)=>{
        table.increments('id', 11);
        table.integer('id_sbr_groups', 11).unsigned().notNullable();
        table.integer('id_sbr_groups_sub', 11).unsigned().notNullable();
        table.text('question').notNullable();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
        table.engine('innodb');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('sbr_groups_sub_qn');
};
