'use strict';

const app = require('./app/index');
const config = require('./app/config');

app.listen(config.port, config.host, () => {
  console.log(`App listening on http://${config.host}:${config.port}`);
});
