// Update with your config settings.

module.exports = {
  client: "pg",
  connection: {
    database: "graph_ql",
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
