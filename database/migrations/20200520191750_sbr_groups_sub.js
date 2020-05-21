exports.up = function(knex) {
    return knex.schema.createTable('sbr_groups_sub', (table)=>{
        table.increments('id');
        table.integer('id_sbr_groups').notNullable();
        table.string('name').notNullable();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('sbr_groups_sub');
};
