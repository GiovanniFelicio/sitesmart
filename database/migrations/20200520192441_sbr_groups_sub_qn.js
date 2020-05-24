exports.up = function(knex) {
    return knex.schema.createTable('sbr_groups_sub_qn', (table)=>{
        table.increments('id', 11);
        table.integer('id_sbr_groups_sub', 11).unsigned().notNullable();
        table.text('question').notNullable();
        table.string('type').notNullable();
        table.string('model').notNullable();
        table.string('value').nullable();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
        table.foreign('id_sbr_groups_sub').references('sbr_groups_sub.id').onDelete('CASCADE');
        table.engine('innodb');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('sbr_groups_sub_qn');
};
