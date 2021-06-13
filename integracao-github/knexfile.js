// Update with your config settings.

module.exports = {
  client: "pg",
  connection: {
    database: "graphql_github",
    user: "postgres",
    password: "docker",
  },
  pool: {
    min: 2,
    max: 10,
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "./src/db/migrations",
  },
};
