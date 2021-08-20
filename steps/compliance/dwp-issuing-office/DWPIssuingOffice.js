const { goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const sections = require('steps/check-your-appeal/sections');
const { getBenefitName, getBenefitCode, isFeatureFlagEnabled } = require('utils/stringUtils');
const Joi = require('joi');
const paths = require('paths');

class DWPIssuingOffice extends SaveToDraftStore {
  static get path() {
    return paths.compliance.dwpIssuingOffice;
  }

  static selectify(ar) {
    return ar.map(el => {
      return { label: el, value: el };
    });
  }

  get options() {
    if (isFeatureFlagEnabled('allowRFE')) {
      return DWPIssuingOffice.selectify([
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        'AE',
        'Recovery from Estates'
      ]);
    }
    return DWPIssuingOffice.selectify([
      '1',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      'AE'
    ]);
  }

  get form() {
    return form({
      pipNumber: text.joi(
        this.content.fields.pipNumber.error.required,
        Joi.string().required())
    });
  }

  get benefitName() {
    return getBenefitName(this.req.session.BenefitType.benefitType);
  }

  get benefitCode() {
    return getBenefitCode(this.req.session.BenefitType.benefitType);
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.pipNumber.question,
        section: sections.mrnDate,
        answer: this.fields.pipNumber.value
      })
    ];
  }

  values() {
    return {
      mrn: {
        dwpIssuingOffice: `DWP PIP (${this.fields.pipNumber.value})`
      }
    };
  }

  next() {
    return goTo(this.journey.steps.Appointee);
  }
}

module.exports = DWPIssuingOffice;
