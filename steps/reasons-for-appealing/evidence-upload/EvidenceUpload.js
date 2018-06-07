const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const paths = require('paths');
const formidable = require('formidable');
const pt = require('path');
const fs = require('fs');
const http = require('http');
const FormData = require('form-data');
const { PassThrough } = require('stream');

class EvidenceUpload extends Question {
  static get path() {
    return paths.reasonsForAppealing.evidenceUpload;
  }

  static handleUpload(req, res, next) {
    if (req.method.toLowerCase() === 'post') {

      const incoming = new formidable.IncomingForm({
        uploadDir: pt.resolve(__dirname, './../../../uploads'),
        keepExtensions: true,
        type: 'multipart'
      });

      incoming.once('error', er => {
        console.info('error while receiving the file from the client', er);
      });

      incoming.on('file', function(field, file) {
        const pathToFile = pt.resolve(__dirname, './../../../uploads') + '/' + file.name;
        fs.rename(file.path, pathToFile);
      });

      incoming.on('error', function(err) {
        console.log("an error has occured with form upload");
        console.log(err);
        req.resume();
      });

      incoming.on('aborted', function() {
        console.log("user aborted upload");
      });

      incoming.on('end', function() {
        console.log('-> upload done');
      });

      return incoming.parse(req, function(error, fields, files) {
        const pathToFile = pt.resolve(__dirname, './../../../uploads') + '/' + files.uploadEv.name;

        const outgoing = new FormData();
        outgoing.append(files.uploadEv.name, fs.createReadStream(pathToFile));

        const request = http.request({
          method: 'post',
          host: 'localhost',
          port: 3010,
          path: `/upload/${files.uploadEv.name}`,
          encoding: null,
          headers: {
            'cache-control': 'no-cache',
            'content-disposition': `attachment; filename=${files.uploadEv.name}`,
            'Content-Type' : 'multipart/form-data'
          }
        });

        outgoing.pipe(request);

        request.on('error', (e) => {
          console.info('Error while sending the file to the remote server ', e)
        });

        return request.on('response', (res) => {
          console.info('all done', res.statusCode);
          return next();
        });

      });
    }
    return next();
  }

  get middleware() {
    return [EvidenceUpload.handleUpload, ...super.middleware];
  }

  get form() {
    return form({
      uploadEv: text.joi(
        'some error',
        Joi.any().required()
      )
    });
  }


  values() {
    return {
      reasonsForAppealing: {
        otherReasons: this.fields.otherReasonForAppealing.value
      }
    };
  }

  next() {
    return goTo(this.journey.steps.TheHearing);
  }
}

module.exports = EvidenceUpload;
