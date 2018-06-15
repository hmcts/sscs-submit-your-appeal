const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { Logger } = require('@hmcts/nodejs-logging');
const config = require('config');

const uploadEvidenceUrl = config.get('api.uploadEvidenceUrl');
const Joi = require('joi');
const paths = require('paths');
const formidable = require('formidable');
const pt = require('path');
const fs = require('fs');
const request = require('request');
const fileTypeWhitelist = require('steps/reasons-for-appealing/evidence-upload/fileTypeWhitelist');

class EvidenceUpload extends Question {
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
        const incoming = new formidable.IncomingForm({
          uploadDir: pt.resolve(__dirname, pathToUploadFolder),
          keepExtensions: true,
          type: 'multipart'
        });

        incoming.once('error', er => {
          logger.info('error while receiving the file from the client', er);
        });

        incoming.once('fileBegin', function(field, file) {
          if (!fileTypeWhitelist.find(el => el === file.type)) {
            return this.emit('error', 'File is of the wrong type');
          }
        });

        incoming.once('file', (field, file) => {
          const pathToFile = `${pt.resolve(__dirname, pathToUploadFolder)}/${file.name}`;
          fs.rename(file.path, pathToFile);
        });


        incoming.once('aborted', () => {
          logger.log('user aborted upload');
          return next(new Error())
        });

        incoming.once('end', () => {
          logger.log('-> upload done');
        });

        return incoming.parse(req, (uploadingError, fields, files) => {
          if (uploadingError) {
            logger.warn('an error has occured with form upload', uploadingError);
            res.header('Connection', 'close');
            res.status(400).send({ status:'error' });
            //res.status(400).render(req.journey.instances.EvidenceUpload.template ));

            setTimeout(function() { res.end(); }, 500);
            return;
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
                uploadEv: b.documents[0].originalDocumentName,
                link: b.documents[0]._links.self.href
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
    return [...super.middleware, EvidenceUpload.handleUpload];
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
        evidence: [
          {
            url: this.fields.link.value,
            fileName: this.fields.uploadEv.value
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
