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
const moment = require('moment');
const stream = require('stream');
const request = require('request');
const fileTypeWhitelist = require('steps/reasons-for-appealing/evidence-upload/fileTypeWhitelist');

const maxFileSizeExceededError = 'MAX_FILESIZE_EXCEEDED_ERROR';
const wrongFileTypeError = 'WRONG_FILE_TYPE_ERROR';
const fileMissingError = 'FILE_MISSING_ERROR';


class EvidenceUpload extends AddAnother {
  static get path() {
    return paths.reasonsForAppealing.evidenceUpload;
  }

  static handleUpload(req, res, next) {
    const logger = Logger.getLogger('EvidenceUpload.js');

    if (req.method.toLowerCase() === 'post') {
      const multiplier = 1024;
      const incoming = new formidable.IncomingForm({
        keepExtensions: true,
        type: 'multipart',
  //      maxFileSize: maxFileSize * multiplier * multiplier
      });

      incoming.once('error', er => {
        logger.info('error while receiving the file from the client', er);
      });

      incoming.once('aborted', () => {
        logger.log('user aborted upload');
        return next(new Error());
      });

      incoming.once('end', () => {
        logger.log('-> upload done');
      });

      let uploadingFile = false;
      incoming.onPart = part => {
        if (incoming.bytesExpected < 200) {
          req.body = {
            'item.uploadEv': fileMissingError
          };
          return next();
        }
        if (!part.filename) {
          // let formidable handle all non-file parts
          incoming.handlePart(part);
          return;
        }
        if (incoming.bytesExpected > (maxFileSize * multiplier * multiplier)) {
          req.body = {
            'item.uploadEv': maxFileSizeExceededError
          };
          return next();
        }
        if (part && part.filename && !fileTypeWhitelist.find(el => el === part.mime)) {
          /* eslint-disable no-invalid-this */
          //return incoming.emit('error', wrongFileTypeError);
          req.body = {
            'item.uploadEv': wrongFileTypeError
          };
          return next();
          /* eslint-enable no-invalid-this */
        }

        const fileName = part.filename;
        const fileData = new stream.PassThrough();
        uploadingFile = true;
        const apiRequest = request.post({
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
          return next(forwardingError);
        });

        let fileSize = 0;
        part.on('data', incomingData => {
          fileSize += incomingData.length;
          if (fileSize > maxFileSize * multiplier * multiplier) {
            const errorMessage = `maxFileSize exceeded, received ${fileSize} bytes of file data`;
            incoming._error(new Error(errorMessage));
            apiRequest.abort();
            return;
          }
          fileData.push(incomingData);
        });

        part.on('end', () => {
          fileData.end();
        });
      };

      incoming.on('error', uploadingError => {
        /* eslint-disable operator-linebreak */
        const unprocessableEntityStatus = 422;
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
        res.status = unprocessableEntityStatus;
        req.body = {
          'item.uploadEv': uploadingError
        };
        return next();
      });

      return incoming.parse(req, uploadingError => {
/*        const unprocessableEntityStatus = 422;

        if (!uploadingFile) {
          // this is an obvious mistake but achieves our goal somehow.
          // I'll have to come back to this.
          res.status = unprocessableEntityStatus;
          req.body = {
            uploadEv: uploadingError
          };
          next();
        }*/
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
    return object({
      uploadEv: text.joi(
        'file missing',
        Joi.string().disallow(fileMissingError)
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
