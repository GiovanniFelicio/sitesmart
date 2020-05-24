exports.up = function(knex) {
    return knex.schema.createTable('sbr_groups_sub_qn_qnr', (table)=>{
        table.increments('id');
        table.integer('id_sbr_groups_sub', 11).unsigned().notNullable();
        table.integer('id_sbr_qnr', 11).unsigned().notNullable();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
        table.foreign('id_sbr_groups_sub').references('sbr_groups_sub.id').onDelete('CASCADE');
        table.foreign('id_sbr_qnr').references('sbr_qnr.id').onDelete('CASCADE');
        table.engine('innodb');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('sbr_groups_sub_qn_qnr');
};
