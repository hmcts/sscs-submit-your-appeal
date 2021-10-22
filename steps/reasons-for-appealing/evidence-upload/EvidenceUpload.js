/* eslint-disable max-lines */
/* eslint-disable consistent-return */
/* eslint-disable operator-linebreak */
/* eslint-disable complexity */
/* eslint-disable arrow-body-style */
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-len */

const { redirectTo } = require('@hmcts/one-per-page/flow');
const { SaveToDraftStoreAddAnother } = require('middleware/draftAppealStoreMiddleware');
const { text, object } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const config = require('config');
const logger = require('logger');

const logPath = 'EvidenceUpload.js';
const Joi = require('joi');
const paths = require('paths');
const formidable = require('formidable');
const pt = require('path');
const fs = require('graceful-fs');
const moment = require('moment');
const request = require('request');
const { get } = require('lodash');
const fileTypeWhitelist = require('steps/reasons-for-appealing/evidence-upload/fileTypeWhitelist');
const i18next = require('i18next');
const sections = require('steps/check-your-appeal/sections');

const uploadEvidenceUrl = config.get('api.uploadEvidenceUrl');
const maxFileSize = config.get('features.evidenceUpload.maxFileSize');

const maxFileSizeExceededError = 'MAX_FILESIZE_EXCEEDED_ERROR';
const totalFileSizeExceededError = 'MAX_TOTAL_FILESIZE_EXCEEDED_ERROR';
const wrongFileTypeError = 'WRONG_FILE_TYPE_ERROR';
const fileMissingError = 'FILE_MISSING_ERROR';
const technicalProblemError = 'TECHNICAL_PROBLEM_ERROR';

class EvidenceUpload extends SaveToDraftStoreAddAnother {
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

  static handleFileBegin(req, incoming) {
    const emptyRequestSize = 200;
    const multiplier = 1024;
    const items = get(req, 'session.EvidenceUpload.items');
    const itemsCount = (items && items.length) ? items.length : 0;
    const totalUploadedFileSize = EvidenceUpload.getTotalSize(items, 0);

    logger.trace(`Total files already uploaded count: ${itemsCount}` +
      `and files size: ${totalUploadedFileSize} , current file size: ${incoming.bytesExpected}`);

    if (incoming.bytesExpected === null ||
      incoming.bytesExpected <= emptyRequestSize) {
      req.body = {
        'item.uploadEv': fileMissingError,
        'item.link': '',
        'item.size': incoming.bytesExpected
      };
      logger.exception('Evidence upload error: you need to choose a file', logPath);
    } else if (incoming.bytesExpected > (maxFileSize * multiplier * multiplier)) {
      req.body = {
        'item.uploadEv': maxFileSizeExceededError,
        'item.link': '',
        'item.size': incoming.bytesExpected,
        'item.totalFileCount': itemsCount + 1
      };
      logger.trace(`Evidence upload error: the file is too big - file was: ${incoming.bytesExpected} bytes`, logPath);
    } else if (EvidenceUpload.getTotalSize(items, incoming.bytesExpected) >
      (maxFileSize * multiplier * multiplier)) {
      logger.trace('File is not empty and within file size limit', logPath);
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

    const urlRegex = RegExp(`${paths.reasonsForAppealing.evidenceUpload}/item-[0-9]*$`);
    if (req.method.toLowerCase() === 'post' && urlRegex.test(req.originalUrl)) {
      logger.trace(`Url req : ${req.url}`, logPath);
      return EvidenceUpload.makeDir(pathToUploadFolder, EvidenceUpload.handleMakeDir(next, pathToUploadFolder, req));
    }
    return next();
  }

  static handleMakeDir(next, pathToUploadFolder, req) {
    return mkdirError => {
      const logValue = `${pathToUploadFolder}, ${req.originalUrl}`;
      logger.trace(`Makedir:  ${logValue}`, logPath);
      if (mkdirError) {
        logger.exception(`Makedir error :  ${logValue}`, logPath);
        return next(mkdirError);
      }
      const incoming = new formidable.IncomingForm({
        uploadDir: pt.resolve(__dirname, pathToUploadFolder),
        keepExtensions: true,
        type: 'multipart'
      });
      incoming.on('fileBegin', () => EvidenceUpload.handleFileBegin(req, incoming));
      return incoming.parse(req, EvidenceUpload.handleIcomingParse(req, next, pathToUploadFolder));
    };
  }

  static handleIcomingParse(req, next, pathToUploadFolder) {
    return (uploadingError, fields, files) => {
      logger.trace(`req body :  ${req.body['item.uploadEv']}`);
      if (req.body && req.body['item.uploadEv'] &&
        (req.body['item.uploadEv'] === maxFileSizeExceededError ||
          req.body['item.uploadEv'] === fileMissingError ||
          req.body['item.uploadEv'] === totalFileSizeExceededError)) {
        logger.trace(`req body :  ${req.body['item.uploadEv']}`);
        return fs.unlink(files['item.uploadEv'].path, next);
      }

      if (files && files['item.uploadEv'] && files['item.uploadEv'].path &&
        !fileTypeWhitelist.find(el => el === files['item.uploadEv'].type)) {
        req.body = {
          'item.uploadEv': wrongFileTypeError,
          'item.link': '',
          'item.size': 0
        };
        logger.trace(`File path: ${files['item.uploadEv'].path}`);
        return fs.unlink(files['item.uploadEv'].path, next);
      }
      let uploadingErrorText = uploadingError;
      if (uploadingError || !get(files, '["item.uploadEv"].name')) {
        if (uploadingError &&
          uploadingError.message &&
          uploadingError.message.match(/maxFileSize exceeded/)) {
          uploadingErrorText = maxFileSizeExceededError;
        }

        req.body = {
          'item.uploadEv': uploadingErrorText,
          'item.link': '',
          'item.size': 0
        };
        return next();
      }

      const pathToFile = `${pt.resolve(__dirname, pathToUploadFolder)}/${files['item.uploadEv'].name}`;
      const size = files['item.uploadEv'].size;
      logger.trace(`File size: ${size}`);
      return fs.rename(files['item.uploadEv'].path, pathToFile, EvidenceUpload.handleRename(pathToFile, req, size, next));
    };
  }

  static handleRename(pathToFile, req, size, next) {
    return () => {
      return request.post({
        url: uploadEvidenceUrl,
        formData: {
          file: fs.createReadStream(pathToFile)
        }
      }, EvidenceUpload.handlePostResponse(req, size, pathToFile, next));
    };
  }

  static handlePostResponse(req, size, pathToFile, next) {
    return (forwardingError, resp, body) => {
      if (!forwardingError) {
        logger.trace('No forwarding error, about to save data', logPath);
        const b = JSON.parse(body);
        if (b && b.documents) {
          if (b.documents[0].hashToken) {
            req.body = {
              'item.uploadEv': b.documents[0].originalDocumentName,
              'item.link': b.documents[0]._links.self.href,
              'item.hashToken': b.documents[0].hashToken,
              'item.size': size
            };
          } else {
            req.body = {
              'item.uploadEv': b.documents[0].originalDocumentName,
              'item.link': b.documents[0]._links.self.href,
              'item.hashToken': '',
              'item.size': size
            };
          }
        }
        return fs.unlink(pathToFile, next);
      }
      req.body = {
        'item.uploadEv': technicalProblemError,
        'item.link': '',
        'item.hashToken': '',
        'item.size': 0
      };
      logger.exception(forwardingError, logPath);
      return fs.unlink(pathToFile, next);
    };
  }

  get middleware() {
    return [
      ...super.middleware,
      EvidenceUpload.handleUpload
    ];
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
    const sessionLanguage = i18next.language;
    const content = require(`./content.${sessionLanguage}`);

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
      hashToken: text.joi('', Joi.string().optional()),
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
      if (file.hashToken) {
        return {
          url: file.link,
          fileName: file.uploadEv,
          hashToken: file.hashToken,
          uploadedDate: moment().format('YYYY-MM-DD')
        };
      } else {
        return {
          url: file.link,
          fileName: file.uploadEv,
          uploadedDate: moment().format('YYYY-MM-DD')
        };
      }
    });
    return {
      reasonsForAppealing: {
        evidences
      }
    };
  }

  validateList(list) {
    const sessionLanguage = i18next.language;
    const content = require(`./content.${sessionLanguage}`);

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
