const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const paths = require('paths');
const formidable = require('formidable');
const pt = require('path');
const fs = require('fs');
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
      incoming.once('error', console.log);
      incoming.on('file', function(field, file) {
        //rename the incoming file to the file's name
        const pathToFile = pt.resolve(__dirname, './../../../uploads') + '/' + file.name;
        fs.rename(file.path, pathToFile);
        console.info('where am i');
        const outgoing = new FormData();
        outgoing.append(file.name, pathToFile);
        outgoing.submit(`http://localhost:3010/upload/${file.name}`, function(err, res) {
          console.info('sent ', err);
          res.resume();
        });
      });

      incoming.on('error', function(err) {
        console.log("an error has occured with form upload");
        console.log(err);
        req.resume();
      });

      incoming.on('aborted', function(err) {
        console.log("user aborted upload");
      });

      incoming.on('end', function() {
        console.log('-> upload done');
      });

      return incoming.parse(req, function() {
        return next();
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
