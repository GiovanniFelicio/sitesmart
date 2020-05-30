exports.up = function(knex) {
    return knex.schema.createTable('sbr_groups', (table)=>{
        table.increments('id', 11);
        table.string('name').notNullable().unique();
        table.timestamps(true, true);
        table.timestamp('deleted_at').nullable();
        table.engine('innodb');
    });
};

exports.down = function(knex) {
    return knex.schema.dropTable('sbr_groups');
};
const ON_UPDATE_DELETED_AT = `DELIMITER //
CREATE TRIGGER siteUpAfterUpDeletedAtGroups AFTER UPDATE ON sbr_groups
    FOR EACH ROW
    BEGIN
        IF NEW.deleted_at <> OLD.deleted_at THEN  
            UPDATE sbr_groups_sub SET deleted_at = CURRENT_TIME() WHERE id_sbr_groups = NEW.id;
        END IF;
    END;//`