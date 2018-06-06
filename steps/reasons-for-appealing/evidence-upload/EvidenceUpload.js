const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');
const formidable = require('formidable');
const pt = require('path');

class EvidenceUpload extends Question {
  static get path() {
    return paths.reasonsForAppealing.evidenceUpload;
  }

  static handleUpload(req, res, next) {
    // for now
    if (req.method.toLowerCase() === 'post') {
      const form = new formidable.IncomingForm({
        uploadDir: pt.resolve(__dirname, './../../../uploads'),
        keepExtensions: true,
        type: 'multipart'
      });
      form.once('error', console.log)
      return form.parse(req, function (err, fields, files) {
        return next();
      })
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
