const { redirectTo } = require('@hmcts/one-per-page/flow');
const { AddAnother } = require('@hmcts/one-per-page/steps');
const { text, object } = require('@hmcts/one-per-page/forms');
const { Logger } = require('@hmcts/nodejs-logging');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const config = require('config');
const appInsights = require('app-insights');
const Joi = require('joi');
const paths = require('paths');
const formidable = require('formidable');
const pt = require('path');
const fs = require('fs');
const moment = require('moment');
const request = require('request');
const { get } = require('lodash');
const fileTypeWhitelist = require('steps/reasons-for-appealing/evidence-upload/fileTypeWhitelist');
const content = require('./content.en.json');
const sections = require('steps/check-your-appeal/sections');

const uploadEvidenceUrl = config.get('api.uploadEvidenceUrl');
const maxFileSize = config.get('features.evidenceUpload.maxFileSize');

const maxFileSizeExceededError = 'MAX_FILESIZE_EXCEEDED_ERROR';
const wrongFileTypeError = 'WRONG_FILE_TYPE_ERROR';
const fileMissingError = 'FILE_MISSING_ERROR';
const technicalProblemError = 'TECHNICAL_PROBLEM_ERROR';

/* eslint-disable consistent-return */
/* eslint-disable operator-linebreak */
/* eslint-disable complexity */
/* eslint-disable arrow-body-style */
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-len */
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

  static isCorrectFileType(mimetype, filename) {
    const hasCorrectMT = Boolean(fileTypeWhitelist.find(el => el === mimetype));
    return hasCorrectMT && (filename &&
      fileTypeWhitelist.find(el => el === `.${filename.split('.').pop()}`));
  }

  static handleUpload(req, res, next) {
    const pathToUploadFolder = './../../../uploads';
    const logger = Logger.getLogger('EvidenceUpload.js');

    const urlRegex = RegExp(`${paths.reasonsForAppealing.evidenceUpload}/item-[0-9]*$`);
    if (req.method.toLowerCase() === 'post' && urlRegex.test(req.originalUrl)) {
      return EvidenceUpload.makeDir(pathToUploadFolder, mkdirError => {
        if (mkdirError) {
          return next(mkdirError);
        }
        const multiplier = 1024;
        const incoming = new formidable.IncomingForm({
          uploadDir: pt.resolve(__dirname, pathToUploadFolder),
          keepExtensions: true,
          type: 'multipart'
        });

        incoming.on('fileBegin', () => {
          const emptyRequestSize = 200;
          if (incoming.bytesExpected === null ||
            incoming.bytesExpected <= emptyRequestSize) {
            req.body = {
              'item.uploadEv': fileMissingError,
              'item.link': ''
            };
            logger.error('Evidence upload error: you need to choose a file');
          } else if (incoming.bytesExpected > (maxFileSize * multiplier * multiplier)) {
            req.body = {
              'item.uploadEv': maxFileSizeExceededError,
              'item.link': ''
            };
            logger.error('Evidence upload error: the file is too big');
          }
        });

        return incoming.parse(req, (uploadingError, fields, files) => {
          if (req.body && req.body['item.uploadEv'] &&
            (req.body['item.uploadEv'] === maxFileSizeExceededError ||
              req.body['item.uploadEv'] === fileMissingError)) {
            return fs.unlink(files['item.uploadEv'].path, next);
          }
          if (files && files['item.uploadEv'] && files['item.uploadEv'].path &&
            !fileTypeWhitelist.find(el => el === files['item.uploadEv'].type)) {
            req.body = {
              'item.uploadEv': wrongFileTypeError,
              'item.link': ''
            };
            return fs.unlink(files['item.uploadEv'].path, next);
          }
          if (uploadingError || !get(files, '["item.uploadEv"].name')) {
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
            req.body = {
              'item.uploadEv': uploadingError,
              'item.link': ''
            };
            return next();
          }

          const pathToFile = `${pt.resolve(__dirname, pathToUploadFolder)}/${files['item.uploadEv'].name}`;
          return fs.rename(files['item.uploadEv'].path, pathToFile, () => {
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
              req.body = {
                'item.uploadEv': technicalProblemError,
                'item.link': ''
              };
              appInsights.trackException(forwardingError);
              return fs.unlink(pathToFile, next);
            });
          });
        });
      });
    }
    return next();
  }

  get middleware() {
    return [...super.middleware, EvidenceUpload.handleUpload];
  }

  get addAnotherLinkContent() {
    /* eslint-disable no-undefined */
    if (this.fields.items !== undefined) {
      return this.fields.items.value.length > 0 ? 'Add another file' : 'Add file';
    }
    return false;
    /* eslint-enable no-undefined */
  }

  editUrl(index) {
    if (!this.fields.items || index === this.fields.items.value.length) {
      return super.editUrl(index);
    }
    return false;
  }

  get field() {
    return object({
      uploadEv: text.joi(
        content.fields.uploadEv.error.required,
        Joi.string().disallow(fileMissingError)
      ).joi(
        content.fields.uploadEv.error.wrongFileType,
        Joi.string().disallow(wrongFileTypeError)
      ).joi(
        content.fields.uploadEv.error.maxFileSizeExceeded,
        Joi.string().disallow(maxFileSizeExceededError)
      ).joi(
        content.fields.uploadEv.error.technical,
        Joi.string().disallow(technicalProblemError)
      ),
      link: text.joi('', Joi.string().optional())
    });
  }

  answers() {
    return answer(this, {
      section: sections.reasonsForAppealing,
      answer: this.fields.items.value.map(file => file.uploadEv)
    });
  }

  values() {
    const evidences = this.fields.items.value.map(file => {
      return {
        url: file.link,
        fileName: file.uploadEv,
        uploadedDate: moment().format('YYYY-MM-DD')
      };
    });
    return {
      reasonsForAppealing: {
        evidences
      }
    };
  }

  validateList(list) {
    return list.check(content.noItemsError, arr => arr.length > 0);
  }

  next() {
    return redirectTo(this.journey.steps.EvidenceDescription);
  }
}

module.exports = EvidenceUpload;

/* eslint-enable consistent-return */
/* eslint-enable operator-linebreak */
/* eslint-enable complexity */
/* eslint-enable arrow-body-style */
/* eslint-enable max-nested-callbacks */
/* eslint-enable max-len */
