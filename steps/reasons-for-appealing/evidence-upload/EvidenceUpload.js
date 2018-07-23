const { goTo } = require('@hmcts/one-per-page');
const { AddAnother } = require('@hmcts/one-per-page/steps');

const { text, object } = require('@hmcts/one-per-page/forms');
const { Logger } = require('@hmcts/nodejs-logging');
const config = require('config');

const uploadEvidenceUrl = config.get('api.uploadEvidenceUrl');
const Joi = require('joi');
const paths = require('paths');
const multiparty = require('multiparty');
const moment = require('moment');
const request = require('request');

require('request-debug')(request);
const HttpStatus = require('http-status-codes');
const fileTypeWhitelist = require('steps/reasons-for-appealing/evidence-upload/fileTypeWhitelist');
const content = require('./content.en.json');

const maxFileSizeExceededError = 'MAX_FILESIZE_EXCEEDED_ERROR';
const wrongFileTypeError = 'WRONG_FILE_TYPE_ERROR';
const fileMissingError = 'FILE_MISSING_ERROR';

/* eslint-disable consistent-return */
/* eslint-disable operator-linebreak */
class EvidenceUpload extends AddAnother {
  static get path() {
    return paths.reasonsForAppealing.evidenceUpload;
  }

  static isCorrectFileType(mimetype, filename) {
    const hasCorrectMT = Boolean(fileTypeWhitelist.find(el => el === mimetype));
    return hasCorrectMT && (filename &&
      fileTypeWhitelist.find(el => el === `.${filename.split('.').pop()}`));
  }

  static handleUpload(req, res, next) {
    const logger = Logger.getLogger('EvidenceUpload.js');

    const urlRegex = RegExp(`${paths.reasonsForAppealing.evidenceUpload}/item-[0-9]*$`);
    if (req.method.toLowerCase() === 'post' && urlRegex.test(req.originalUrl)) {
      const form = new multiparty.Form();

      // Parts are emitted when parsing the form
      form.on('part', part => {
        if (!part.filename) {
          part.resume();
        }

        if (part.filename) {
          logger.info(`got file named ${part.name}`);
          // ignore file's content here
          request.post({
            url: uploadEvidenceUrl,
            headers: {
              'Content-Type': 'multipart/form-data'
            },
            formData: {
              file: {
                value: part,
                options: {
                  filename: part.name,
                  contentType: part.headers['content-type'],
                  knownLength: part.byteCount
                }
              }
            }
          }, (forwardingError, resp, body) => {
            if (forwardingError) {
              logger.error('Evdence upload error from the api: ', forwardingError);
              return next(forwardingError);
            }
            if (resp.statusCode === HttpStatus.OK) {
              logger.info('No forwarding error, about to save data');
              const b = JSON.parse(body);
              req.body = {
                'item.uploadEv': b.documents[0].originalDocumentName,
                'item.link': b.documents[0]._links.self.href
              };
              return next();
            }
            logger.info('Error streaming documents', resp.statusCode, body);
            req.body = {
              'item.uploadEv': wrongFileTypeError
            };
            return next();
          });
        }
      });

      return form.parse(req);
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
      ),
      link: text.joi('', Joi.string().optional())
    });
  }

  values() {
    const evidences = this.fields.items.value.map(file => {
      return {
        url: file.link.value,
        fileName: file.uploadEv.value,
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
    return goTo(this.journey.steps.TheHearing);
  }
}

module.exports = EvidenceUpload;

/* eslint-enable consistent-return */
/* eslint-enable operator-linebreak */
