const { expect } = require('test/util/chai');
const DWPIssuingOffice = require('steps/compliance/dwp-issuing-office/DWPIssuingOffice');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');
const { overrideFeatFlag } = require('utils/stringUtils');

describe('DWPIssuingOffice.js', () => {
  let dWPIssuingOffice = null;

  beforeEach(() => {
    dWPIssuingOffice = new DWPIssuingOffice({
      journey: {
        req: {
          session: {
            BenefitType: {
              benefitType: benefitTypes.personalIndependencePayment
            }
          }
        },
        steps: {
          Appointee: paths.identity.areYouAnAppointee
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /dwp-issuing-office', () => {
      expect(dWPIssuingOffice.path).to.equal(paths.compliance.dwpIssuingOffice);
    });
  });

  describe('get dwp office options()', () => {
    it('return dwp office option when allowRFE flag is true', () => {
      overrideFeatFlag({ key: 'allowRFE', value: true });
      expect(11).to.equal(dWPIssuingOffice.options.length);
    });
  });

  describe('get dwp office options()', () => {
    it('return dwp office option when allowRFE flag is false', () => {
      overrideFeatFlag({ key: 'allowRFE', value: false });
      expect(10).to.equal(dWPIssuingOffice.options.length);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = dWPIssuingOffice.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('pipNumber');
    });

    describe('pipNumber field', () => {
      beforeEach(() => {
        field = fields.pipNumber;
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
      dWPIssuingOffice.fields = {
        pipNumber: {
          value: '5'
        }
      };

      dWPIssuingOffice.content = {
        cya: {
          pipNumber: {
            question
          }
        }
      };
    });

    it('should contain a single answer', () => {
      const answers = dWPIssuingOffice.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.mrnDate);
      expect(answers[0].answer).to.equal('5');
    });

    it('should contain a value object', () => {
      const values = dWPIssuingOffice.values();
      expect(values).to.eql({ mrn: { dwpIssuingOffice: 'DWP PIP (5)' } });
    });
  });

  describe('next()', () => {
    it('returns the next step path /are-you-an-appointee', () => {
      expect(dWPIssuingOffice.next()).to.eql({ nextStep: paths.identity.areYouAnAppointee });
    });
  });

  describe('options for JSA', () => {
    it('has options for JSA', () => {
      dWPIssuingOffice.journey.req.session.BenefitType.benefitType = benefitTypes.jobseekersAllowance;
      expect(dWPIssuingOffice.options.length).to.eql(4);
      expect(dWPIssuingOffice.options[0].label).to.eql('Worthing DRT');
      expect(dWPIssuingOffice.options[1].label).to.eql('Birkenhead DRT');
      expect(dWPIssuingOffice.options[2].label).to.eql('Inverness DRT');
      expect(dWPIssuingOffice.options[3].label).to.eql('Recovery from Estates');
    });
  });

  describe('options for Social Fund', () => {
    it('has options for Social', () => {
      dWPIssuingOffice.journey.req.session.BenefitType.benefitType = benefitTypes.socialFund;
      expect(dWPIssuingOffice.options.length).to.eql(3);
      expect(dWPIssuingOffice.options[0].label).to.eql('St Helens Sure Start Maternity Grant');
      expect(dWPIssuingOffice.options[1].label).to.eql('Funeral Payment Dispute Resolution Team');
      expect(dWPIssuingOffice.options[2].label).to.eql('Pensions Dispute Resolution Team');
    });
  });

  describe('options for UC', () => {
    it('has options for UC', () => {
      dWPIssuingOffice.journey.req.session.BenefitType.benefitType = benefitTypes.universalCredit;
      expect(dWPIssuingOffice.options.length).to.eql(2);
      expect(dWPIssuingOffice.options[0].label).to.eql('Universal Credit');
      expect(dWPIssuingOffice.options[1].label).to.eql('Recovery from Estates');
    });
  });

  describe('options for Income Support', () => {
    it('has options for Income Support', () => {
      dWPIssuingOffice.journey.req.session.BenefitType.benefitType = benefitTypes.incomeSupport;
      expect(dWPIssuingOffice.options.length).to.eql(4);
      expect(dWPIssuingOffice.options[0].label).to.eql('Worthing DRT');
      expect(dWPIssuingOffice.options[1].label).to.eql('Birkenhead DRT');
      expect(dWPIssuingOffice.options[2].label).to.eql('Inverness DRT');
      expect(dWPIssuingOffice.options[3].label).to.eql('Recovery from Estates');
    });
  });
});
