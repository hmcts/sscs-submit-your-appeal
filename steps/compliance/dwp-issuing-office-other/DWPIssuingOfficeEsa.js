const { goTo } = require('lib/vendor/one-per-page');
const { form, text } = require('lib/vendor/one-per-page/forms');
const { answer } = require('lib/vendor/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const sections = require('steps/check-your-appeal/sections');
const Joi = require('joi');
const paths = require('paths');
const { getBenefitCode, isFeatureFlagEnabled } = require('utils/stringUtils');
const i18next = require('i18next');
const { isIba } = require('utils/benefitTypeUtils');

class DWPIssuingOfficeEsa extends SaveToDraftStore {
  static get path() {
    return paths.compliance.dwpIssuingOfficeEsa;
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

  // eslint-disable-next-line complexity
  get options() {
    if (
      getBenefitCode(this.journey.req.session.BenefitType.benefitType) === 'ESA'
    ) {
      if (isFeatureFlagEnabled('allowRFE')) {
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
          'Worthing DRT',
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
    } else if (
      getBenefitCode(this.journey.req.session.BenefitType.benefitType) === 'DLA'
    ) {
      return DWPIssuingOfficeEsa.selectify([
        'Disability Benefit Centre 4',
        'The Pension Service 11',
        'Recovery from Estates'
      ]);
    } else if (
      getBenefitCode(this.journey.req.session.BenefitType.benefitType) ===
      'attendanceAllowance'
    ) {
      return DWPIssuingOfficeEsa.selectify([
        'The Pension Service 11',
        'Recovery from Estates'
      ]);
    } else if (
      getBenefitCode(this.journey.req.session.BenefitType.benefitType) === 'JSA'
    ) {
      return DWPIssuingOfficeEsa.selectify([
        'Worthing DRT',
        'Birkenhead DRT',
        'Inverness DRT',
        'Recovery from Estates'
      ]);
    } else if (
      getBenefitCode(this.journey.req.session.BenefitType.benefitType) ===
      'industrialInjuriesDisablement'
    ) {
      return DWPIssuingOfficeEsa.selectify([
        'Barrow IIDB Centre',
        'Barnsley Benefit Centre'
      ]);
    } else if (
      getBenefitCode(this.journey.req.session.BenefitType.benefitType) ===
      'industrialDeathBenefit'
    ) {
      return DWPIssuingOfficeEsa.selectify([
        'Barrow IIDB Centre',
        'Barnsley Benefit Centre'
      ]);
    } else if (
      getBenefitCode(this.journey.req.session.BenefitType.benefitType) ===
        'pensionCredit' ||
      getBenefitCode(this.journey.req.session.BenefitType.benefitType) ===
        'retirementPension'
    ) {
      return DWPIssuingOfficeEsa.selectify([
        'Pensions Dispute Resolution Team',
        'Recovery from Estates'
      ]);
    } else if (
      getBenefitCode(this.journey.req.session.BenefitType.benefitType) ===
      'socialFund'
    ) {
      return DWPIssuingOfficeEsa.selectify([
        'St Helens Sure Start Maternity Grant',
        'Funeral Payment Dispute Resolution Team',
        'Pensions Dispute Resolution Team'
      ]);
    } else if (
      getBenefitCode(this.journey.req.session.BenefitType.benefitType) ===
      'incomeSupport'
    ) {
      return DWPIssuingOfficeEsa.selectify([
        'Worthing DRT',
        'Birkenhead DRT',
        'Inverness DRT',
        'Recovery from Estates'
      ]);
    } else if (
      getBenefitCode(this.journey.req.session.BenefitType.benefitType) === 'UC'
    ) {
      return DWPIssuingOfficeEsa.selectify([
        'Universal Credit',
        'Recovery from Estates'
      ]);
    }
    return DWPIssuingOfficeEsa.selectify([
      'Universal Credit',
      'Recovery from Estates'
    ]);
  }

  get form() {
    return form({
      dwpIssuingOffice: text.joi(
        this.content.fields.dwpIssuingOffice.error.required,
        Joi.string().required()
      )
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
