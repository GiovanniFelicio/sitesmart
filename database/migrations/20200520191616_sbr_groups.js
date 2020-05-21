exports.up = function(knex) {
    return knex.schema.createTable('sbr_groups', (table)=>{
        table.increments('id');
        table.string('name').notNullable();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('sbr_groups');
};
