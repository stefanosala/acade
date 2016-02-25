'use strict';

const config = {
  host: process.env.HOST || '0.0.0.0',
  port: process.env.PORT || '8000',
  redis: {
    connectionString: process.env.REDIS_URL,
  },
};
config.publicUrl = process.env.PUBLIC_URL ||
  `http://${config.host}:${config.port}`;

module.exports = config;
