exports.up = function(knex) {
    return knex.schema.createTable('users_courses', function(table){
        table.increments('id');
        table.string('user_id').notNullable();
        table.string('course_id').notNullable();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('users_courses')
};
