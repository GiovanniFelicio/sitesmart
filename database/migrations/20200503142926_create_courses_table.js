
exports.up = function(knex) {
    return knex.schema.createTable('courses', (table)=>{
        table.increments('id');
        table.string('name').notNullable();
        table.string('price').notNullable();
        table.string('broadcast_on').notNullable();
        table.integer('speaker').notNullable();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('courses');
};
