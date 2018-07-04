const { goTo } = require('@hmcts/one-per-page');
const { AddAnother } = require('@hmcts/one-per-page/steps');

const { text, object } = require('@hmcts/one-per-page/forms');
const { Logger } = require('@hmcts/nodejs-logging');
const config = require('config');

const uploadEvidenceUrl = config.get('api.uploadEvidenceUrl');
const maxFileSize = config.get('features.evidenceUpload.maxFileSize');
const Joi = require('joi');
const paths = require('paths');
const formidable = require('formidable');
const { errorFor } = require('@hmcts/one-per-page/src/forms/validator');

const pt = require('path');
const fs = require('fs');
const moment = require('moment');
const request = require('request');
const { get } = require('lodash');
const fileTypeWhitelist = require('steps/reasons-for-appealing/evidence-upload/fileTypeWhitelist');

const maxFileSizeExceededError = 'MAX_FILESIZE_EXCEEDED_ERROR';
const wrongFileTypeError = 'WRONG_FILE_TYPE_ERROR';

class EvidenceUpload extends AddAnother {
  static get path() {
    return paths.reasonsForAppealing.evidenceUpload;
  }

  static makeDir(path, dirCallback) {
    const p = pt.join(__dirname, path);
    fs.stat(p, (fsError, stats) => {
      if (fsError || !stats.isDirectory()) {
        return fs.mkdir(p, dirCallback);
      }
      return dirCallback();
    });
  }

  static handleUpload(req, res, next) {
    const pathToUploadFolder = './../../../uploads';
    const logger = Logger.getLogger('EvidenceUpload.js');

    if (req.method.toLowerCase() === 'post') {
      return EvidenceUpload.makeDir(pathToUploadFolder, mkdirError => {
        if (mkdirError) {
          return next(mkdirError);
        }
        const multiplier = 1024;
        const incoming = new formidable.IncomingForm({
          uploadDir: pt.resolve(__dirname, pathToUploadFolder),
          keepExtensions: true,
          type: 'multipart',
          maxFileSize: maxFileSize * multiplier * multiplier
        });

        incoming.once('error', er => {
          logger.info('error while receiving the file from the client', er);
        });

        incoming.once('fileBegin', function fileBegin(field, file) {
          if (file && file.name && !fileTypeWhitelist.find(el => el === file.type)) {
            /* eslint-disable no-invalid-this */
            return this.emit('error', wrongFileTypeError);
            /* eslint-enable no-invalid-this */
          }
          return true;
        });

        incoming.once('file', (field, file) => {
          if (file.name && file.size) {
            const pathToFile = `${pt.resolve(__dirname, pathToUploadFolder)}/${file.name}`;
            fs.rename(file.path, pathToFile);
          }
        });


        incoming.once('aborted', () => {
          logger.log('user aborted upload');
          return next(new Error());
        });

        incoming.once('end', () => {
          logger.log('-> upload done');
        });

        return incoming.parse(req, (uploadingError, fields, files) => {
          const unprocessableEntityStatus = 422;

          if (uploadingError || !get(files, 'uploadEv.name')) {
            /* eslint-disable operator-linebreak */
            if (uploadingError &&
              uploadingError.message &&
              uploadingError.message.match(/maxFileSize exceeded/)) {
              /* eslint-enable operator-linebreak */
              // cater for the horrible formidable.js error
              /* eslint-disable no-param-reassign */
              uploadingError = maxFileSizeExceededError;
              /* eslint-enable no-param-reassign */
            }
            // this is an obvious mistake but achieves our goal somehow.
            // I'll have to come back to this.
            res.statusCode = unprocessableEntityStatus;
            req.body = {
              'item.uploadEv': uploadingError,
              'item.link': ''
            };
            return next();
          }

          const pathToFile = `${pt
            .resolve(__dirname, pathToUploadFolder)}/${files.uploadEv.name}`;

          return request.post({
            url: uploadEvidenceUrl,
            formData: {
              file: fs.createReadStream(pathToFile)
            }
          }, (forwardingError, resp, body) => {
            if (!forwardingError) {
              logger.info('No forwarding error, about to save data');
              const b = JSON.parse(body);
              req.body = {
                'item.uploadEv': b.documents[0].originalDocumentName,
                'item.link': b.documents[0]._links.self.href
              };
              return fs.unlink(pathToFile, next);
            }
            return next(forwardingError);
          });
        });
      });
    }

    return next();
  }

  get middleware() {
    return [
      ...super.middleware, EvidenceUpload.handleUpload
    ];
  }

  get addAnotherLinkContent() {
    /* eslint-disable no-undefined */
    if (this.fields.items !== undefined) {
      return this.fields.items.value.length > 0 ? 'Add new' : 'Add';
    }
    return false;
    /* eslint-enable no-undefined */
  }

  get field() {
/*    return object({
      uploadEv: text,
      link: text
    }).check(
      errorFor('uploadEv', this.content.fields.uploadEv.error.maxFileSizeExceeded),
      value => value !== maxFileSizeExceededError)*/

    return object({
      uploadEv: text.joi(
        'file missing',
        Joi.string().required()
      ).joi(
        'wrong file type',
        Joi.string().disallow(wrongFileTypeError)
      ).joi(
        'stupid file is too big',
        Joi.string().disallow(maxFileSizeExceededError)
      ),
      link: text.joi('', Joi.string().optional())
    });
  }

  values() {
    return {
      reasonsForAppealing: {
        evidences: [
          {
            url: this.fields.link.value,
            fileName: this.fields.uploadEv.value,
            uploadedDate: moment().format('YYYY-MM-DD')
          }
        ]
      }
    };
  }

  next() {
    return goTo(this.journey.steps.TheHearing);
  }
}

module.exports = EvidenceUpload;
