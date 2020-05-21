exports.up = function(knex) {
    return knex.schema.createTable('sbr_groups_sub_qn_qnr', (table)=>{
        table.increments('id');
        table.integer('id_sbr_groups_sub_qn').notNullable();
        table.integer('id_sbr_qnr').notNullable();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('sbr_groups_sub_qn_qnr');
};
