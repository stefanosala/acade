'use strict';

const Redis = require('ioredis');

const config = require('../config');

const redis = new Redis(config.redis.connectionString);

module.exports = redis;
