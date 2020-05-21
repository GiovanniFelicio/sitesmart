exports.up = function(knex) {
    return knex.schema.createTable('sbr_qnr', (table)=>{
        table.increments('id');
        table.string('id_sbr_users').notNullable();
        table.string('name').notNullable();
        table.integer('status', 2).default(1);
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('sbr_qnr');
};
