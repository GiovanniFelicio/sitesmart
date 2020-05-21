exports.up = function(knex) {
    return knex.schema.createTable('sbr_groups_sub_qn_qnr', (table)=>{
        table.increments('id');
        table.string('id_sbr_groups', 255).nullable();
        table.string('id_sbr_groups_sub', 255).nullable();
        table.integer('id_sbr_qnr').notNullable();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('sbr_groups_sub_qn_qnr');
};
