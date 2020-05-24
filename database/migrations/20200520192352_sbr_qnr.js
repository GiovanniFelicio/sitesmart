exports.up = function(knex) {
    return knex.schema.createTable('sbr_qnr', (table)=>{
        table.increments('id', 11);
        table.integer('id_sbr_users', 11).unsigned().notNullable();
        table.string('name').notNullable();
        table.integer('status', 2).default(1);
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
        table.foreign('id_sbr_users').references('sbr_users.id').onDelete('CASCADE');
        table.engine('innodb');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('sbr_qnr');
};
