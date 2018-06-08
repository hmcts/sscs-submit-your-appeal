// this is to simulate the upload evidence api. It's not part of the main app.

const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');

const app = express();

/* eslint-disable no-console */

app.set('port', 3010);
app.post('/upload/:filename', (req, res) => {
  console.info('file acceptor handler invoked ', req.files);
  let filename = path.basename(req.params.filename);
  filename = path.resolve(__dirname, filename);
  const dst = fs.createWriteStream(filename);
  req.pipe(dst);
  dst.on('drain', () => {
    console.log('drain', new Date());
    req.resume();
  });
  req.on('error', error => {
    console.error('Error on file_acceptor', error);
  });
  req.on('end', () => {
    console.info('happily ended!');
    return res.json({
      file: 'ugo!.pdf'
    });
  });
});

http.createServer(app).listen(app.get('port'), () => {
  console.log(`Express server listening on port ${app.get('port')}`);
});

/* eslint-enable no-console */
