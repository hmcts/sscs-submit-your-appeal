// this is to simulate the postcode api. It's not part of the main app.

const logger = require('logger');

const logPath = 'index.js';
const express = require('express');
const http = require('http');
const HttpStatus = require('http-status-codes');

const app = express();

/* eslint-disable no-magic-numbers */
app.set('port', 8080);
app.get('/regionalcentre/:postcode', (req, res) => {
  const postcode = req.params.postcode;
  logger.trace(`postcode request for ${postcode}`, logPath);

  const cannedRes = {
    EH8: { status: HttpStatus.OK, body: { regionalCentre: 'Glasgow' } },
    ZX99: { status: HttpStatus.NOT_FOUND, body: { } },
    default: { status: HttpStatus.OK, body: { regionalCentre: 'Birmingham' } }
  };
  const resJson = (postcode in cannedRes) ? cannedRes[postcode] : cannedRes.default;

  res.status(resJson.status);
  res.json(resJson.body);
});

http.createServer(app).listen(app.get('port'), () => {
  logger.trace(`Express server listening on port ${app.get('port')}`, logPath);
});

/* eslint-enable no-magic-numbers */
