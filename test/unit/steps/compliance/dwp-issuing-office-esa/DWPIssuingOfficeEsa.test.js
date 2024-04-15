const { expect } = require('test/util/chai');
const DWPIssuingOfficeEsa = require('steps/compliance/dwp-issuing-office-other/DWPIssuingOfficeEsa');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');
const { overrideFeatFlag } = require('utils/stringUtils');
const i18next = require('i18next');

describe('DWPIssuingOfficeEsa.js', () => {
  let dwpIssuingOfficeEsa = null;

  beforeEach(() => {
    i18next.changeLanguage('en');
    dwpIssuingOfficeEsa = new DWPIssuingOfficeEsa({
      journey: {
        steps: {
          Appointee: paths.identity.areYouAnAppointee
        },
        req: {
          session: {
            BenefitType: {
              benefitType: benefitTypes.employmentAndSupportAllowance
            }
          }
        }
      }
    });
  });

  afterEach(() => {
    i18next.changeLanguage('en');
  });

  describe('get path()', () => {
    it('returns path /dwp-issuing-office-other', () => {
      expect(dwpIssuingOfficeEsa.path).to.equal(paths.compliance.dwpIssuingOfficeEsa);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = dwpIssuingOfficeEsa.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('dwpIssuingOffice');
    });

    describe('dwpIssuingOffice field', () => {
      beforeEach(() => {
        field = fields.dwpIssuingOffice;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });
  });

  describe('answers() and values()', () => {
    const question = 'A Question';

    beforeEach(() => {
      dwpIssuingOfficeEsa.fields = {
        dwpIssuingOffice: {
          value: 'Office name'
        }
      };

      dwpIssuingOfficeEsa.content = {
        cya: {
          dwpIssuingOffice: {
            question
          }
        }
      };
    });

    it('should contain a single answer', () => {
      const answers = dwpIssuingOfficeEsa.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.mrnDate);
      expect(answers[0].answer).to.equal('Office name');
    });

    it('should contain a value object', () => {
      const values = dwpIssuingOfficeEsa.values();
      expect(values).to.eql({ mrn: { dwpIssuingOffice: 'Office name' } });
    });
  });

  describe('next()', () => {
    it('returns the next step path /are-you-an-appointee', () => {
      expect(dwpIssuingOfficeEsa.next()).to.eql({ nextStep: paths.identity.areYouAnAppointee });
    });
  });

  describe('options', () => {
    it('has options for ESA when allowRFE is true', () => {
      overrideFeatFlag({ key: 'allowRFE', value: true });
      expect(dwpIssuingOfficeEsa.options.length).to.eql(14);
    });
  });

  describe('options', () => {
    it('has options for ESA when allowRFE is false', () => {
      overrideFeatFlag({ key: 'allowRFE', value: false });
      expect(dwpIssuingOfficeEsa.options.length).to.eql(13);
    });
  });

  describe('options for JSA', () => {
    it('has options for JSA', () => {
      dwpIssuingOfficeEsa.journey.req.session.BenefitType.benefitType = benefitTypes.jobseekersAllowance;
      expect(dwpIssuingOfficeEsa.options.length).to.eql(4);
      expect(dwpIssuingOfficeEsa.options[0].label).to.eql('Worthing DRT');
      expect(dwpIssuingOfficeEsa.options[1].label).to.eql('Birkenhead DRT');
      expect(dwpIssuingOfficeEsa.options[2].label).to.eql('Inverness DRT');
      expect(dwpIssuingOfficeEsa.options[3].label).to.eql('Recovery from Estates (Deceased)');
      expect(dwpIssuingOfficeEsa.options[3].value).to.eql('Recovery from Estates');
    });
    it('has options for JSA Welsh', () => {
      i18next.changeLanguage('cy');
      dwpIssuingOfficeEsa.journey.req.session.BenefitType.benefitType = benefitTypes.jobseekersAllowance;
      expect(dwpIssuingOfficeEsa.options.length).to.eql(4);
      expect(dwpIssuingOfficeEsa.options[0].label).to.eql('Worthing DRT');
      expect(dwpIssuingOfficeEsa.options[1].label).to.eql('Birkenhead DRT');
      expect(dwpIssuingOfficeEsa.options[2].label).to.eql('Inverness DRT');
      expect(dwpIssuingOfficeEsa.options[3].label).to.eql('Recovery from Estates (Ymadawedig)');
      expect(dwpIssuingOfficeEsa.options[3].value).to.eql('Recovery from Estates');
    });
  });

  describe('options for Social Fund', () => {
    it('has options for Social', () => {
      dwpIssuingOfficeEsa.journey.req.session.BenefitType.benefitType = benefitTypes.socialFund;
      expect(dwpIssuingOfficeEsa.options.length).to.eql(3);
      expect(dwpIssuingOfficeEsa.options[0].label).to.eql('St Helens Sure Start Maternity Grant');
      expect(dwpIssuingOfficeEsa.options[1].label).to.eql('Funeral Payment Dispute Resolution Team');
      expect(dwpIssuingOfficeEsa.options[2].label).to.eql('Pensions Dispute Resolution Team');
    });
  });

  describe('options for UC', () => {
    it('has options for UC', () => {
      dwpIssuingOfficeEsa.journey.req.session.BenefitType.benefitType = benefitTypes.universalCredit;
      expect(dwpIssuingOfficeEsa.options.length).to.eql(2);
      expect(dwpIssuingOfficeEsa.options[0].label).to.eql('Universal Credit');
      expect(dwpIssuingOfficeEsa.options[1].label).to.eql('Recovery from Estates (Deceased)');
    });
    it('has options for UC Welsh', () => {
      i18next.changeLanguage('cy');
      dwpIssuingOfficeEsa.journey.req.session.BenefitType.benefitType = benefitTypes.universalCredit;
      expect(dwpIssuingOfficeEsa.options.length).to.eql(2);
      expect(dwpIssuingOfficeEsa.options[0].label).to.eql('Universal Credit');
      expect(dwpIssuingOfficeEsa.options[1].label).to.eql('Recovery from Estates (Ymadawedig)');
    });
  });

  describe('options for Income Support', () => {
    it('has options for Income Support', () => {
      dwpIssuingOfficeEsa.journey.req.session.BenefitType.benefitType = benefitTypes.incomeSupport;
      expect(dwpIssuingOfficeEsa.options.length).to.eql(4);
      expect(dwpIssuingOfficeEsa.options[0].label).to.eql('Worthing DRT');
      expect(dwpIssuingOfficeEsa.options[1].label).to.eql('Birkenhead DRT');
      expect(dwpIssuingOfficeEsa.options[2].label).to.eql('Inverness DRT');
      expect(dwpIssuingOfficeEsa.options[3].label).to.eql('Recovery from Estates (Deceased)');
    });
    it('has options for Income Support Welsh', () => {
      i18next.changeLanguage('cy');
      dwpIssuingOfficeEsa.journey.req.session.BenefitType.benefitType = benefitTypes.incomeSupport;
      expect(dwpIssuingOfficeEsa.options.length).to.eql(4);
      expect(dwpIssuingOfficeEsa.options[0].label).to.eql('Worthing DRT');
      expect(dwpIssuingOfficeEsa.options[1].label).to.eql('Birkenhead DRT');
      expect(dwpIssuingOfficeEsa.options[2].label).to.eql('Inverness DRT');
      expect(dwpIssuingOfficeEsa.options[3].label).to.eql('Recovery from Estates (Ymadawedig)');
    });
  });

  describe('options for Industrial Death Benefit', () => {
    it('has options for Industrial Death Benefit', () => {
      dwpIssuingOfficeEsa.journey.req.session.BenefitType.benefitType = benefitTypes.industrialDeathBenefit;
      expect(dwpIssuingOfficeEsa.options.length).to.eql(2);
      expect(dwpIssuingOfficeEsa.options[0].label).to.eql('Barrow IIDB Centre');
      expect(dwpIssuingOfficeEsa.options[1].label).to.eql('Barnsley Benefit Centre');
    });
  });

  describe('options for Pension Credit', () => {
    it('has options for Pension Credit', () => {
      dwpIssuingOfficeEsa.journey.req.session.BenefitType.benefitType = benefitTypes.pensionCredit;
      expect(dwpIssuingOfficeEsa.options.length).to.eql(2);
      expect(dwpIssuingOfficeEsa.options[0].label).to.eql('Pensions Dispute Resolution Team');
      expect(dwpIssuingOfficeEsa.options[1].label).to.eql('Recovery from Estates (Deceased)');
    });
    it('has options for Pension Credit Welsh', () => {
      i18next.changeLanguage('cy');
      dwpIssuingOfficeEsa.journey.req.session.BenefitType.benefitType = benefitTypes.pensionCredit;
      expect(dwpIssuingOfficeEsa.options.length).to.eql(2);
      expect(dwpIssuingOfficeEsa.options[0].label).to.eql('Pensions Dispute Resolution Team');
      expect(dwpIssuingOfficeEsa.options[1].label).to.eql('Recovery from Estates (Ymadawedig)');
    });
  });

  describe('options for Retirement Pension', () => {
    it('has options for Retirement Pension', () => {
      dwpIssuingOfficeEsa.journey.req.session.BenefitType.benefitType = benefitTypes.retirementPension;
      expect(dwpIssuingOfficeEsa.options.length).to.eql(2);
      expect(dwpIssuingOfficeEsa.options[0].label).to.eql('Pensions Dispute Resolution Team');
      expect(dwpIssuingOfficeEsa.options[1].label).to.eql('Recovery from Estates (Deceased)');
      expect(dwpIssuingOfficeEsa.options[1].value).to.eql('Recovery from Estates');
    });
    it('has options for Retirement Pension Welsh', () => {
      i18next.changeLanguage('cy');
      dwpIssuingOfficeEsa.journey.req.session.BenefitType.benefitType = benefitTypes.retirementPension;
      expect(dwpIssuingOfficeEsa.options.length).to.eql(2);
      expect(dwpIssuingOfficeEsa.options[0].label).to.eql('Pensions Dispute Resolution Team');
      expect(dwpIssuingOfficeEsa.options[1].label).to.eql('Recovery from Estates (Ymadawedig)');
      expect(dwpIssuingOfficeEsa.options[1].value).to.eql('Recovery from Estates');
    });
  });
});
