require('dotenv').config();

module.exports = {
  username: process.env.DB_USER || 'futstats',
  password: process.env.DB_PASSWORD || 'futstats',
  database: process.env.DB_NAME || 'futstats',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  dialect: 'postgres',
  define: {
    underscored: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
};
