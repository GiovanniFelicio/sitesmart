exports.up = function(knex) {
    return knex.schema.createTable('sbr_groups_sub', (table)=>{
        table.increments('id', 11);
        table.integer('id_sbr_groups').unsigned().notNullable();
        table.string('name').notNullable().unique();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
        table.engine('innodb');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('sbr_groups_sub');
};
