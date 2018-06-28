const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');

const Joi = require('joi');
const paths = require('paths');
const moment = require('moment');
const { handleUpload,
  maxFileSizeExceededError,
  wrongFileTypeError } = require('steps/reasons-for-appealing/evidence-upload/uploadMethods');

class EvidenceUpload extends Question {
  static get path() {
    return paths.reasonsForAppealing.evidenceUpload;
  }

  get middleware() {
    return [...super.middleware, handleUpload];
  }

  get form() {
    return form({
      uploadEv: text.joi(
        this.content.fields.uploadEv.error.required,
        Joi.string().required()
      ).joi(
        this.content.fields.uploadEv.error.wrongFileType,
        Joi.string().disallow(wrongFileTypeError)
      ).joi(
        this.content.fields.uploadEv.error.maxFileSizeExceeded,
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
