exports.up = function(knex) {
    return knex.schema.createTable('sbr_groups_sub', (table)=>{
        table.increments('id', 11);
        table.integer('id_sbr_groups').unsigned().notNullable();
        table.string('name').notNullable();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
        table.engine('innodb');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('sbr_groups_sub');
};

const ON_UPDATE_DELETED_AT = `DELIMITER //
CREATE TRIGGER siteUpAfterUpDeletedAtSubGroups AFTER UPDATE ON sbr_groups_sub
    FOR EACH ROW
    BEGIN
        IF NEW.deleted_at <> NULL THEN  
            UPDATE sbr_groups_sub_qn SET deleted_at = CURRENT_TIME() WHERE id_sbr_groups_sub = NEW.id;
        END IF;
    END;//`