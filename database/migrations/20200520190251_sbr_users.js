exports.up = function(knex) {
    return knex.schema.createTable('sbr_users', (table)=>{
        table.increments('id', 11);
        table.string('name').notNullable();
        table.string('username', 100).notNullable().unique();
        table.string('email', 100).notNullable().unique();
        table.string('password').notNullable();
        table.integer('role', 2).notNullable();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
        table.engine('innodb');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('sbr_users');
};
