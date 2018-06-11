const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { api } = require('../../../config/default');
const { Logger } = require('@hmcts/nodejs-logging');
const Joi = require('joi');
const paths = require('paths');
const formidable = require('formidable');
const pt = require('path');
const fs = require('fs');
const request = require('request');

class EvidenceUpload extends Question {
  static get path() {
    return paths.reasonsForAppealing.evidenceUpload;
  }

  static handleUpload(req, res, next) {
    const pathToUploadFolder = './../../../uploads';
    const logger = Logger.getLogger('EvidenceUpload.js');

    if (req.method.toLowerCase() === 'post') {
      const incoming = new formidable.IncomingForm({
        uploadDir: pt.resolve(__dirname, pathToUploadFolder),
        keepExtensions: true,
        type: 'multipart'
      });

      incoming.once('error', er => {
        logger.info('error while receiving the file from the client', er);
      });

      incoming.on('file', (field, file) => {
        const pathToFile = `${pt.resolve(__dirname, pathToUploadFolder)}/${file.name}`;
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
          return next(error);
        }
        const pathToFile = `${pt.resolve(__dirname, './../../../uploads')}/${files.uploadEv.name}`;

        //const outgoing = new FormData();
        //outgoing.append('file', fs.createReadStream(pathToFile));

        return request.post({
          url: `http://localhost:3010/upload/${files.uploadEv.name}`,
          formData: {
            file: fs.createReadStream(pathToFile)
          },
        }, function (err, resp, body) {
          if (!err) {
            const b = JSON.parse(body);
            req.body = {
              uploadEv: b.documents[0].originalDocumentName,
              link: b.documents[0]._links.self
            };
          }
          return next(err)
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
        'Please choose a file',
        Joi.string().required()
      ),
      link: text.joi('Unexpected error', Joi.string().required())
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
