const { Question, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');

class DWPIssuingOfficeEsa extends Question {
  static get path() {
    return paths.compliance.dwpIssuingOfficeESA;
  }

  static selectify(ar) {
    return ar.map(el => {
      return { label: el, value: el };
    });
  }

  get options() {
    return DWPIssuingOfficeEsa.selectify([
      'Balham DRT',
      'Chesterfield DRT',
      'Inverness DRT',
      'Lowestoft DRT',
      'Milton Keynes DRT',
      'Norwich DRT',
      'Sheffield DRT',
      'Springburn DRT',
      'Watford DRT',
      'Wellingborough DRT'
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
    return goTo(this.journey.steps.AppellantName);
  }
}

module.exports = DWPIssuingOfficeEsa;
