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
      const uploader = new formidable.IncomingForm({
        uploadDir: pt.resolve(__dirname, './../../../uploads'),
        keepExtensions: true,
        type: 'multipart'
      });
      uploader.once('error', console.log);
      uploader.on('file', function(field, file) {
        //rename the incoming file to the file's name
        fs.rename(file.path, pt.resolve(__dirname, './../../../uploads') + '/' + file.name);
      });
/*      return uploader.parse(req, (error, fields, files) => {
        console.info('file uploaded ', typeof files, typeof files.uploadEv, typeof files.uploadEv.File);
        const sender = new FormData();
        const filename = files.uploadEv.name;
        console.info('filename ', filename)
        sender.append(filename, fs.createReadStream(pt.resolve(__dirname, `./../../../uploads/${filename}`)));
        sender.submit(`http://localhost:3010/${filename}`, function(err, res) {
          console.info('sent ', err);
          res.resume();
        });
      });*/
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
