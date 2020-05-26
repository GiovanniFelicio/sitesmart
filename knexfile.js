// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql',
    connection: {
        host: '127.0.0.1',
        
        database: "site",
        user: "root",
        password: "09112013"
    },
    // connection: {
    //     host: '192.168.200.140',
    //     database: "site",
    //     user: "root",
    //     password: "p1nc3l"
    // },
    migrations:{
      tableName: 'knex_migrations',
      directory: `${__dirname}/database/migrations`
    },
    seeds:{
      directory: `${__dirname}/database/seeds`
    }
  },

  /*staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }*/

};
