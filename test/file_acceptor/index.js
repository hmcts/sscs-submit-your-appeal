const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');

const app = express();

app.set('port', 3010);

app.post('/upload/:filename', function (req, res) {
  console.info('file acceptor handler invoked ', req.files)
  let filename = path.basename(req.params.filename);
  filename = path.resolve(__dirname, filename);
  const dst = fs.createWriteStream(filename);
  req.pipe(dst);
  dst.on('drain', function() {
    console.log('drain', new Date());
    req.resume();
  });
  req.on('error', (er) => console.error);
  req.on('end', function () {
    console.info('happily ended!')
    res.send(200);
  });
});

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});