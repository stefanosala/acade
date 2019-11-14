'use strict';

const express = require('express');
const shortid = require('shortid');
const bodyParser = require('body-parser');

const config = require('./config');
const redis = require('./services/redis');

const app = express();
app.use(bodyParser.json());

app.post('/', async (req, res, next) => {
  try {
    const randomId = shortid.generate();

    await redis.set(`urls:${randomId}`, req.body.url)

    return res.json({
      status: 'success',
      message: `${req.body.url} added to database`,
      shorturl: `${config.publicUrl}/${randomId}`,
      statusCode: 200,
    });
  } catch (e) {
    next(e);
  }
});

app.get('/:urlId', async (req, res, next) => {
  const urlId = req.params.urlId;

  if (!urlId) return res.sendStatus(404);

  try {
    const url = await redis.get(`urls:${urlId}`);

    if (!url) {
      return res.sendStatus(404);
    }

    await redis.incr(`urls:${urlId}:clicks`);

    res.redirect(301, url);
  } catch (e) {
    next(e);
  }
});

module.exports = app;
