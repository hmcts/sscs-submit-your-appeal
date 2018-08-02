// this is to simulate the postcode api. It's not part of the main app.

const { Logger } = require('@hmcts/nodejs-logging');
const express = require('express');
const http = require('http');
const HttpStatus = require('http-status-codes');

const logger = Logger.getLogger('PostcodeChecker.js');
const app = express();

/* eslint-disable no-magic-numbers */
app.set('port', 8080);
app.get('/regionalcentre/:postcode', (req, res) => {
  const postcode = req.params.postcode;
  logger.log(`postcode request for ${postcode}`);

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
  logger.log(`Express server listening on port ${app.get('port')}`);
});

/* eslint-enable no-magic-numbers */
