/* eslint-disable consistent-return */
/* eslint-disable operator-linebreak */
/* eslint-disable complexity */
/* eslint-disable arrow-body-style */
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-len */
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
const totalFileSizeExceededError = 'MAX_TOTAL_FILESIZE_EXCEEDED_ERROR';
const wrongFileTypeError = 'WRONG_FILE_TYPE_ERROR';
const fileMissingError = 'FILE_MISSING_ERROR';
const technicalProblemError = 'TECHNICAL_PROBLEM_ERROR';

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

  static getTotalSize(items, bytesExpected) {
    if (!items) {
      return parseInt(bytesExpected, 10);
    }
    const bytesSoFar = items.reduce((accumulator, currentValue) => {
      return parseInt(currentValue.size, 10) + accumulator;
    }, 0);
    return bytesSoFar + parseInt(bytesExpected, 10);
  }

  static handleFileBegin(req, incoming, logger) {
    const emptyRequestSize = 200;
    const multiplier = 1024;
    const items = get(req, 'session.EvidenceUpload.items');
    const itemsCount = (items && items.length) ? items.length : 0;

    if (incoming.bytesExpected === null ||
      incoming.bytesExpected <= emptyRequestSize) {
      req.body = {
        'item.uploadEv': fileMissingError,
        'item.link': '',
        'item.size': incoming.bytesExpected
      };
      logger.error('Evidence upload error: you need to choose a file');
      appInsights.trackTrace('Evidence upload error: you need to choose a file');
    } else if (incoming.bytesExpected > (maxFileSize * multiplier * multiplier)) {
      req.body = {
        'item.uploadEv': maxFileSizeExceededError,
        'item.link': '',
        'item.size': incoming.bytesExpected,
        'item.totalFileCount': itemsCount + 1
      };
      logger.error('Evidence upload error: the file is too big');
      appInsights.trackTrace('Evidence upload error: the file is too big');
    } else if (EvidenceUpload.getTotalSize(items, incoming.bytesExpected) >
      (maxFileSize * multiplier * multiplier)) {
      appInsights.trackTrace('File is not empty and within file size limit');
      req.body = {
        'item.uploadEv': totalFileSizeExceededError,
        'item.link': '',
        'item.size': incoming.bytesExpected,
        'item.totalFileCount': itemsCount + 1
      };
    }
  }
  static handleUpload(req, res, next) {
    const pathToUploadFolder = './../../../uploads';
    const logger = Logger.getLogger('EvidenceUpload.js');

    const urlRegex = RegExp(`${paths.reasonsForAppealing.evidenceUpload}/item-[0-9]*$`);
    if (req.method.toLowerCase() === 'post' && urlRegex.test(req.originalUrl)) {
      appInsights.trackTrace(`Url req : ${req.url}`);
      return EvidenceUpload.makeDir(pathToUploadFolder, EvidenceUpload.handleMakeDir(next, pathToUploadFolder, req, logger));
    }
    return next();
  }

  static handleMakeDir(next, pathToUploadFolder, req, logger) {
    return mkdirError => {
      const logValue = `${pathToUploadFolder}, ${req.originalUrl}`;
      appInsights.trackTrace(`Makedir:  ${logValue}`);
      if (mkdirError) {
        logger.error(`Makedir error :  ${logValue}`);
        return next(mkdirError);
      }
      const incoming = new formidable.IncomingForm({
        uploadDir: pt.resolve(__dirname, pathToUploadFolder),
        keepExtensions: true,
        type: 'multipart'
      });
      incoming.on('fileBegin', () => EvidenceUpload.handleFileBegin(req, incoming, logger));
      return incoming.parse(req, EvidenceUpload.handleIcomingParse(req, next, pathToUploadFolder, logger));
    };
  }

  static handleIcomingParse(req, next, pathToUploadFolder, logger) {
    return (uploadingError, fields, files) => {
      if (req.body && req.body['item.uploadEv'] &&
        (req.body['item.uploadEv'] === maxFileSizeExceededError ||
          req.body['item.uploadEv'] === fileMissingError ||
          req.body['item.uploadEv'] === totalFileSizeExceededError)) {
        appInsights.trackTrace(`req body :  ${req.body}`);
        return fs.unlink(files['item.uploadEv'].path, next);
      }

      if (files && files['item.uploadEv'] && files['item.uploadEv'].path &&
        !fileTypeWhitelist.find(el => el === files['item.uploadEv'].type)) {
        req.body = {
          'item.uploadEv': wrongFileTypeError,
          'item.link': '',
          'item.size': 0
        };
        appInsights.trackTrace(`File path: ${files['item.uploadEv'].path}`);
        return fs.unlink(files['item.uploadEv'].path, next);
      }

      if (uploadingError || !get(files, '["item.uploadEv"].name')) {
        if (uploadingError &&
          uploadingError.message &&
          uploadingError.message.match(/maxFileSize exceeded/)) {
          // cater for the horrible formidable.js error
          // eslint-disable-next-line no-param-reassign
          uploadingError = maxFileSizeExceededError;
        }

        req.body = {
          'item.uploadEv': uploadingError,
          'item.link': '',
          'item.size': 0
        };
        return next();
      }

      const pathToFile = `${pt.resolve(__dirname, pathToUploadFolder)}/${files['item.uploadEv'].name}`;
      const size = files['item.uploadEv'].size;
      return fs.rename(files['item.uploadEv'].path, pathToFile, EvidenceUpload.handleRename(pathToFile, logger, req, size, next));
    };
  }

  static handleRename(pathToFile, logger, req, size, next) {
    return () => {
      return request.post({
        url: uploadEvidenceUrl,
        formData: {
          file: fs.createReadStream(pathToFile)
        }
      }, EvidenceUpload.handlePostResponse(logger, req, size, pathToFile, next));
    };
  }

  static handlePostResponse(logger, req, size, pathToFile, next) {
    return (forwardingError, resp, body) => {
      if (!forwardingError) {
        appInsights.trackTrace('No forwarding error, about to save data');
        const b = JSON.parse(body);
        req.body = {
          'item.uploadEv': b.documents[0].originalDocumentName,
          'item.link': b.documents[0]._links.self.href,
          'item.size': size
        };
        return fs.unlink(pathToFile, next);
      }
      req.body = {
        'item.uploadEv': technicalProblemError,
        'item.link': '',
        'item.size': 0
      };
      appInsights.trackException(forwardingError);
      return fs.unlink(pathToFile, next);
    };
  }

  get middleware() {
    return [...super.middleware, EvidenceUpload.handleUpload];
  }

  get addAnotherLinkContent() {
    // eslint-disable-next-line no-undefined
    if (this.fields.items !== undefined) {
      return this.fields.items.value.length > 0 ? 'Add another file' : 'Add file';
    }
    return false;
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
      ).joi(
        content.fields.uploadEv.error.totalFileSizeExceeded,
        Joi.string().disallow(totalFileSizeExceededError)
      ),
      link: text.joi('', Joi.string().optional()),
      size: text.joi(0, Joi.number().optional()),
      totalFileCount: text.joi(0, Joi.number().optional())
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

EvidenceUpload.maxFileSizeExceededError = maxFileSizeExceededError;
EvidenceUpload.totalFileSizeExceededError = totalFileSizeExceededError;
EvidenceUpload.wrongFileTypeError = wrongFileTypeError;
EvidenceUpload.fileMissingError = fileMissingError;
EvidenceUpload.technicalProblemError = technicalProblemError;

module.exports = EvidenceUpload;