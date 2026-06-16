const env = require('./env');

module.exports = {
  username: env.database.user,
  password: env.database.password,
  database: env.database.name,
  host: env.database.host,
  port: env.database.port,
  dialect: 'postgres',
  define: {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
