const { goTo } = require('lib/vendor/one-per-page');
const { form, text } = require('lib/vendor/one-per-page/forms');
const { answer } = require('lib/vendor/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const sections = require('steps/check-your-appeal/sections');
const {
  getBenefitName,
  getBenefitCode,
  isFeatureFlagEnabled
} = require('utils/stringUtils');
const Joi = require('joi');
const paths = require('paths');
const i18next = require('i18next');
const { isIba } = require('utils/benefitTypeUtils');

class DWPIssuingOffice extends SaveToDraftStore {
  static get path() {
    return paths.compliance.dwpIssuingOffice;
  }

  handler(req, res, next) {
    if (req.method === 'GET' && isIba(req)) {
      res.redirect(paths.errors.doesNotExist);
    } else {
      super.handler(req, res, next);
    }
  }

  static selectify(ar) {
    const sessionLanguage = i18next.language || 'en';

    const requireContent = require('utils/requireContent');

    const content = requireContent.requireLocalized(
      './content',
      sessionLanguage
    );

    return ar.map(el => {
      if (el === 'Recovery from Estates') {
        return { label: content.cya.dwpIssuingOffice.rfe, value: el };
      }
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
        Joi.string().required()
      )
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
