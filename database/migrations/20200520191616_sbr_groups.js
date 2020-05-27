exports.up = function(knex) {
    return knex.schema.createTable('sbr_groups', (table)=>{
        table.increments('id', 11);
        table.string('name').notNullable();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
        table.engine('innodb');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('sbr_groups');
};
