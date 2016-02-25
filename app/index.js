'use strict';

const express = require('express');
const shortid = require('shortid');

const config = require('./config');
const redis = require('./services/redis');

const app = express();

app.post('/', (req, res, next) => {
  const randomId = shortid.generate();

  return redis.set(`urls:${randomId}`, req.query.url)
    .then(() => {
      return res.json({
        status: 'success',
        message: `${req.query.url} added to database`,
        shorturl: `${config.publicUrl}/${randomId}`,
        statusCode: 200,
      });
    })
    .catch(next);
});

app.get('/:urlId', (req, res, next) => {
  const urlId = req.params.urlId;

  if (!urlId) return res.sendStatus(404);

  return redis.get(`urls:${urlId}`)
    .then(url => {
      if (!url) {
        return res.sendStatus(404);
      }

      return redis.incr(`urls:${urlId}:clicks`)
        .then(() => res.redirect(301, url));
    })
    .catch(next);
});

module.exports = app;
