exports.up = function(knex) {
    return knex.schema.createTable('sbr_groups_sub_qn_answers', (table)=>{
        table.increments('id', 11);
        table.integer('id_sbr_groups_sub_qn', 11).unsigned().notNullable();
        table.integer('id_sbr_qnr', 11).unsigned().notNullable();
        table.integer('id_sbr_groups_sub_qn_models').notNullable();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
        table.foreign('id_sbr_groups_sub_qn').references('sbr_groups_sub_qn.id').onDelete('CASCADE');
        table.foreign('id_sbr_qnr').references('sbr_qnr.id').onDelete('CASCADE');
        table.engine('innodb');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('sbr_groups_sub_qn_answers');
};
