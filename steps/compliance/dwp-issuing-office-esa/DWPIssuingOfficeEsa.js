const { goTo } = require('@hmcts/one-per-page');
const { get } = require('lodash');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');

class DWPIssuingOfficeEsa extends SaveToDraftStore {
  static get path() {
    return paths.compliance.dwpIssuingOfficeESA;
  }

  static selectify(ar) {
    return ar.map(el => {
      return { label: el, value: el };
    });
  }

  get options() {
    const useDLA = [benefitTypes.disabilityLivingAllowance];
    const benefitType = get(this, 'journey.req.session.BenefitType.benefitType');
    const isDla = useDLA.indexOf(benefitType) !== -1;

    if (isDla) {
      return DWPIssuingOfficeEsa.selectify([
        'Disability Benefit Centre 4',
        'The Pension Service 11',
        'Recovery from Estates'
      ]);
    }
    return DWPIssuingOfficeEsa.selectify([
      'Balham DRT',
      'Birkenhead LM DRT',
      'Chesterfield DRT',
      'Coatbridge Benefit Centre',
      'Inverness DRT',
      'Lowestoft DRT',
      'Milton Keynes DRT',
      'Norwich DRT',
      'Sheffield DRT',
      'Springburn DRT',
      'Watford DRT',
      'Wellingborough DRT',
      'Worthing DRT'
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

module.exports = DWPIssuingOfficeEsa;
