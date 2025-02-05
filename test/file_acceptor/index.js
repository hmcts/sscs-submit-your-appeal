// this is to simulate the upload evidence api. It's not part of the main app.

const logPath = 'test/index.js';
const express = require('express');
const formidable = require('formidable');
const http = require('http');
const path = require('path');
const fs = require('graceful-fs');

const app = express();
/* eslint-disable init-declarations */
let server;

/* eslint-disable no-console */
/* eslint-disable id-blacklist */
/* eslint-disable consistent-return */
/* eslint-disable no-magic-numbers */

app.set('port', 8080);
app.post('/evidence/upload', (req, res) => {
  const incoming = new formidable.IncomingForm({
    uploadDir: path.resolve(__dirname, '.'),
    keepExtensions: true,
    type: 'multipart'
  });

  incoming.once('error', er => {
    console.log(
      `error while receiving the file from the client ${er}`,
      logPath
    );
  });

  incoming.on('file', (field, file) => {
    const pathToFile = `${path.resolve(__dirname, '.')}/${file.name}`;
    fs.rename(file.path, pathToFile);
  });

  incoming.on('error', error => {
    console.log(`an error has occured with form upload ${error}`, logPath);
    req.resume();
  });

  incoming.on('aborted', () => {
    console.log('user aborted upload', logPath);
  });

  incoming.on('end', () => {
    console.log('-> upload done', logPath);
  });

  return incoming.parse(req, (error, fields, files) => {
    if (error) {
      console.log('About to respond with error', logPath);
      return res.send(422, 'Cannot save the uploaded file');
    }
    console.log('About to respond correctly', logPath);
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
  bootstrap,
  teardown
};

/* eslint-enable no-console */
/* eslint-enable id-blacklist */
/* eslint-enable consistent-return */
/* eslint-enable init-declarations */
/* eslint-enable no-magic-numbers */
