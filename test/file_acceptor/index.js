// this is to simulate the upload evidence api. It's not part of the main app.

const express = require('express');
const formidable = require('formidable');
const http = require('http');
const path = require('path');
const fs = require('fs');

const app = express();

/* eslint-disable no-console */

app.set('port', 3010);
app.post('/upload', (req, res) => {

  const incoming = new formidable.IncomingForm({
    uploadDir: path.resolve(__dirname, '.'),
    keepExtensions: true,
    type: 'multipart'
  });

  incoming.once('error', er => {
    console.info('error while receiving the file from the client', er);
  });

  incoming.on('file', (field, file) => {
    const pathToFile = `${path.resolve(__dirname, '.')}/${file.name}`;
    fs.rename(file.path, pathToFile);
  });

  incoming.on('error', error => {
    console.warn('an error has occured with form upload', error);
    req.resume();
  });

  incoming.on('aborted', () => {
    console.log('user aborted upload');
  });

  incoming.on('end', () => {
    console.log('-> upload done');
  });

  return incoming.parse(req, (error, fields, files) => {
    if (error) {
      return next(error);
    }
    return res.json({
      "documents": [
        {
          "classification": "RESTRICTED",
          "size": 15471,
          "mimeType": "application/pdf",
          "originalDocumentName": files.file.name,
          "createdBy": null,
          "modifiedOn": new Date().valueOf(),
          "createdOn": new Date().valueOf(),
          "_links": {
            "self": {
              "href": "http://localhost:4603/documents/6d90a26f-7560-4f70-9ff7-7e5e0591133d"
            },
            "binary": {
              "href": "http://localhost:4603/documents/6d90a26f-7560-4f70-9ff7-7e5e0591133d/binary"
            }
          }
        }
      ]
    })

  });

});

http.createServer(app).listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')}`);
});

/* eslint-enable no-console */
