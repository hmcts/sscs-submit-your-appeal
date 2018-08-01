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
const moment = require('moment');
const stream = require('stream');
const request = require('request');
const fileTypeWhitelist = require('steps/reasons-for-appealing/evidence-upload/fileTypeWhitelist');
const content = require('./content.en.json');
const sections = require('steps/check-your-appeal/sections');

const uploadEvidenceUrl = config.get('api.uploadEvidenceUrl');
const maxFileSize = config.get('features.evidenceUpload.maxFileSize');

const maxFileSizeExceededError = 'MAX_FILESIZE_EXCEEDED_ERROR';
const wrongFileTypeError = 'WRONG_FILE_TYPE_ERROR';
const fileMissingError = 'FILE_MISSING_ERROR';

/* eslint-disable consistent-return */
class EvidenceUpload extends AddAnother {
  static get path() {
    return paths.reasonsForAppealing.evidenceUpload;
  }

  static handleUpload(req, res, next) {
    const logger = Logger.getLogger('EvidenceUpload.js');

    const urlRegex = RegExp(`${paths.reasonsForAppealing.evidenceUpload}/item-[0-9]*$`);
    if (req.method.toLowerCase() === 'post' && urlRegex.test(req.originalUrl)) {
      const multiplier = 1024;
      const incoming = new formidable.IncomingForm({
        keepExtensions: true,
        type: 'multipart'
      });

      incoming.onPart = part => {
        const emptyRequestApproxSizeInBytes = 200;
        if (incoming.bytesExpected <= emptyRequestApproxSizeInBytes) {
          req.body = {
            'item.uploadEv': fileMissingError
          };
          return next();
        }
        if (!part.filename) {
          // let formidable handle all non-file parts
          incoming.handlePart(part);
          return next();
        }
        if (incoming.bytesExpected > (maxFileSize * multiplier * multiplier)) {
          req.body = {
            'item.uploadEv': maxFileSizeExceededError
          };
          return next();
        }
        if (part && part.filename && !fileTypeWhitelist.find(el => el === part.mime)) {
          req.body = {
            'item.uploadEv': wrongFileTypeError
          };
          return next();
        }

        const fileName = part.filename;
        const fileData = new stream.PassThrough();
        request.post({
          url: uploadEvidenceUrl,
          formData: {
            file: {
              value: fileData,
              options: {
                filename: fileName,
                contentType: part.mime,
                knownLength: req.headers['content-length']
              }
            }
          }
        }, (forwardingError, resp, body) => {
          if (!forwardingError) {
            logger.info('No forwarding error, about to save data');
            const b = JSON.parse(body);
            req.body = {
              'item.uploadEv': b.documents[0].originalDocumentName,
              'item.link': b.documents[0]._links.self.href
            };

            return next();
          }
          appInsights.trackException(forwardingError);
          return next(forwardingError);
        });

        part.on('data', incomingData => {
          fileData.push(incomingData);
        });

        part.on('end', () => {
          fileData.end();
        });
      };

      return incoming.parse(req);
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

  answers() {
    return answer(this, {
      section: sections.reasonsForAppealing,
      answer: this.fields.items.value.map(file => file.uploadEv)
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
    return redirectTo(this.journey.steps.EvidenceDescription);
  }
}

module.exports = EvidenceUpload;
