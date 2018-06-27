// this is to simulate the upload evidence api. It's not part of the main app.

const { Logger } = require('@hmcts/nodejs-logging');
const express = require('express');
const formidable = require('formidable');
const http = require('http');
const path = require('path');
const fs = require('fs');

const app = express();
/* eslint-disable init-declarations */
let server;

/* eslint-disable no-console */
/* eslint-disable id-blacklist */
/* eslint-disable consistent-return */
/* eslint-disable no-magic-numbers */

const logger = Logger.getLogger('PostcodeChecker.js');


app.set('port', 3010);
app.post('/upload', (req, res) => {
  const incoming = new formidable.IncomingForm({
    uploadDir: path.resolve(__dirname, '.'),
    keepExtensions: true,
    type: 'multipart'
  });

  incoming.once('error', er => {
    logger.info('error while receiving the file from the client', er);
  });

  incoming.on('file', (field, file) => {
    const pathToFile = `${path.resolve(__dirname, '.')}/${file.name}`;
    fs.rename(file.path, pathToFile);
  });

  incoming.on('error', error => {
    logger.warn('an error has occured with form upload', error);
    req.resume();
  });

  incoming.on('aborted', () => {
    logger.log('user aborted upload');
  });

  incoming.on('end', () => {
    logger.log('-> upload done');
  });

  return incoming.parse(req, (error, fields, files) => {
    if (error) {
      logger.info('About to respond with error');
      return res.send(422, 'Cannot save the uploaded file');
    }
    logger.info('About to respond correctly');
    return res.json({
      documents: [
        {
          classification: 'RESTRICTED',
          size: 15471,
          mimeType: 'application/pdf',
          originalDocumentName: files.file.name,
          createdBy: null,
          modifiedOn: new Date().valueOf(),
          createdOn: new Date().valueOf(),
          _links: {
            self: {
              href: 'http://localhost:4603/documents/6d90a26f-7560-4f70-9ff7-7e5e0591133d'
            },
            binary: {
              href: 'http://localhost:4603/documents/6d90a26f-7560-4f70-9ff7-7e5e0591133d/binary'
            }
          }
        }
      ]
    });
  });
});

function teardown(callback) {
  if (server && server.close) {
    return server.close(callback);
  }
}

function bootstrap(callback) {
  server = http.createServer(app).listen(app.get('port'), callback);
  return server;
}

process.on('SIGINT', teardown);
process.on('SIGTERM', teardown);

module.exports = {
  bootstrap, teardown
};

http.createServer(app).listen(app.get('port'), () => {
  logger.log(`Express server listening on port ${app.get('port')}`);
});


/* eslint-enable no-console */
/* eslint-enable id-blacklist */
/* eslint-enable consistent-return */
/* eslint-enable init-declarations */
/* eslint-enable no-magic-numbers */
