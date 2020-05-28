exports.up = function(knex) {
    return knex.schema.createTable('sbr_groups_sub_qn_models', (table)=>{
        table.increments('id');
        table.string('model').notNullable();
        table.string('value').notNullable();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
        table.engine('innodb');
        
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('sbr_groups_sub_qn_models');
};
