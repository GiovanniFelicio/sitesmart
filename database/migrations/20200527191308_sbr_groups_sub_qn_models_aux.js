exports.up = function(knex) {
    return knex.schema.createTable('sbr_groups_sub_qn_models_aux', (table)=>{
        table.increments('id');
        table.integer('id_sbr_groups_sub_qn', 11).notNullable();
        table.integer('id_sbr_groups_sub_models_aux', 11).notNullable();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
        table.engine('innodb');
        
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('sbr_groups_sub_qn_models_aux');
};
