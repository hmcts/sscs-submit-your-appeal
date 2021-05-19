const { goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');

class DWPIssuingOfficeIidb extends SaveToDraftStore {
  static get path() {
    return paths.compliance.dwpIssuingOfficeIIDB;
  }

  static selectify(ar) {
    return ar.map(el => {
      return { label: el, value: el };
    });
  }

  get options() {
    return DWPIssuingOfficeIidb.selectify([
      'Barrow IIDB Centre',
      'Barnsley Benefit Centre'
    ]);
  }

  get form() {
    return form({
      dwpIssuingOffice: text.joi(
        this.content.fields.dwpIssuingOffice.error.required,
        Joi.string().required())
    });
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.dwpIssuingOffice.question,
        section: sections.mrnDate,
        answer: this.fields.dwpIssuingOffice.value
      })
    ];
  }

  values() {
    return {
      mrn: {
        dwpIssuingOffice: this.fields.dwpIssuingOffice.value
      }
    };
  }

  next() {
    return goTo(this.journey.steps.Appointee);
  }
}

module.exports = DWPIssuingOfficeIidb;
