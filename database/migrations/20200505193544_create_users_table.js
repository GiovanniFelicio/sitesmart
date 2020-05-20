
exports.up = function(knex) {
    return knex.schema.createTable('users', function(table){
        table.increments('id');
        table.string('name', 30).notNullable();
        table.string('email', 40).unique().notNullable();
        table.bigInteger('cpf', 12).unique();
        table.tinyint('level', 2).default(0).notNullable();
        table.string('password').notNullable();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('users')
};
