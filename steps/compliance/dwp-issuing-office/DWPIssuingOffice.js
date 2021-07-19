const { goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const sections = require('steps/check-your-appeal/sections');
const { getBenefitName, getBenefitCode, isFeatureFlagEnabled } = require('utils/stringUtils');
const Joi = require('joi');
const paths = require('paths');

const benefitTypes = ['ESA', 'DLA', 'attendanceAllowance', 'industrialInjuriesDisablement', 'JSA', 'socialFund', 'incomeSupport', 'UC'];

class DWPIssuingOffice extends SaveToDraftStore {
  static get path() {
    return paths.compliance.dwpIssuingOffice;
  }

  static selectify(ar) {
    return ar.map(el => {
      return { label: el, value: el };
    });
  }

  // eslint-disable-next-line complexity
  get options() {
    if (getBenefitCode(this.journey.req.session.BenefitType.benefitType) === 'ESA') {
      if (isFeatureFlagEnabled('allowRFE')) {
        return DWPIssuingOffice.selectify([
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
      return DWPIssuingOffice.selectify([
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
    } else if (getBenefitCode(this.journey.req.session.BenefitType.benefitType) === 'DLA') {
      return DWPIssuingOffice.selectify([
        'Disability Benefit Centre 4',
        'The Pension Service 11',
        'Recovery from Estates'
      ]);
    } else if (getBenefitCode(this.journey.req.session.BenefitType.benefitType) === 'attendanceAllowance') {
      return DWPIssuingOffice.selectify([
        'The Pension Service 11',
        'Recovery from Estates'
      ]);
    } else if (getBenefitCode(this.journey.req.session.BenefitType.benefitType) === 'JSA') {
      return DWPIssuingOffice.selectify([
        'Worthing DRT',
        'Birkenhead DRT',
        'Inverness DRT',
        'Recovery from Estates'
      ]);
    } else if (getBenefitCode(this.journey.req.session.BenefitType.benefitType) === 'industrialInjuriesDisablement') {
      return DWPIssuingOffice.selectify([
        'Barrow IIDB Centre',
        'Barnsley Benefit Centre'
      ]);
    } else if (getBenefitCode(this.journey.req.session.BenefitType.benefitType) === 'socialFund') {
      return DWPIssuingOffice.selectify([
        'St Helens Sure Start Maternity Grant',
        'Funeral Payment Dispute Resolution Team',
        'Pensions Dispute Resolution Team'
      ]);
    } else if (getBenefitCode(this.journey.req.session.BenefitType.benefitType) === 'incomeSupport') {
      return DWPIssuingOffice.selectify([
        'Worthing DRT',
        'Birkenhead DRT',
        'Inverness DRT',
        'Recovery from Estates'
      ]);
    } else if (getBenefitCode(this.journey.req.session.BenefitType.benefitType) === 'UC') {
      return DWPIssuingOffice.selectify([
        'Universal Credit',
        'Recovery from Estates'
      ]);
    } else if (isFeatureFlagEnabled('allowRFE')) {
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
    if (benefitTypes.includes(getBenefitCode(this.journey.req.session.BenefitType.benefitType))) {
      return form({
        dwpIssuingOffice: text.joi(
          this.content.fields.dwpIssuingOffice.error.required,
          Joi.string().required())
      });
    }
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
    if (benefitTypes.includes(getBenefitCode(this.journey.req.session.BenefitType.benefitType))) {
      return [
        answer(this, {
          question: this.content.cya.dwpIssuingOffice.question,
          section: sections.mrnDate,
          answer: this.fields.dwpIssuingOffice.value
        })
      ];
    }
    return [
      answer(this, {
        question: this.content.cya.pipNumber.question,
        section: sections.mrnDate,
        answer: this.fields.pipNumber.value
      })
    ];
  }

  values() {
    if (benefitTypes.includes(getBenefitCode(this.journey.req.session.BenefitType.benefitType))) {
      return {
        mrn: {
          dwpIssuingOffice: this.fields.dwpIssuingOffice.value
        }
      };
    }
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
