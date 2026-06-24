require('dotenv').config();

const env = {
  app: {
    port: Number(process.env.PORT) || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    name: process.env.DB_NAME || 'futstats',
    user: process.env.DB_USER || 'futstats',
    password: process.env.DB_PASSWORD || 'futstats',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  },
};

module.exports = env;
