const { expect } = require('test/util/chai');
const DWPIssuingOffice = require('steps/compliance/dwp-issuing-office/DWPIssuingOffice');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');
const { overrideFeatFlag } = require('utils/stringUtils');

describe('DWPIssuingOffice.js', () => {
  let dwpIssuingOffice = null;

  beforeEach(() => {
    dwpIssuingOffice = new DWPIssuingOffice({
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

  describe('get path()', () => {
    it('returns path /dwp-issuing-office', () => {
      expect(dwpIssuingOffice.path).to.equal(paths.compliance.dwpIssuingOffice);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = dwpIssuingOffice.form.fields;
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
      dwpIssuingOffice.fields = {
        dwpIssuingOffice: {
          value: 'Office name'
        }
      };

      dwpIssuingOffice.content = {
        cya: {
          dwpIssuingOffice: {
            question
          }
        }
      };
    });

    it('should contain a single answer', () => {
      const answers = dwpIssuingOffice.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.mrnDate);
      expect(answers[0].answer).to.equal('Office name');
    });

    it('should contain a value object', () => {
      const values = dwpIssuingOffice.values();
      expect(values).to.eql({ mrn: { dwpIssuingOffice: 'Office name' } });
    });
  });

  describe('next()', () => {
    it('returns the next step path /are-you-an-appointee', () => {
      expect(dwpIssuingOffice.next()).to.eql({ nextStep: paths.identity.areYouAnAppointee });
    });
  });

  describe('options', () => {
    it('has options for ESA when allowRFE is true', () => {
      overrideFeatFlag({ key: 'allowRFE', value: true });
      expect(dwpIssuingOffice.options.length).to.eql(14);
    });
  });

  describe('options', () => {
    it('has options for ESA when allowRFE is false', () => {
      overrideFeatFlag({ key: 'allowRFE', value: false });
      expect(dwpIssuingOffice.options.length).to.eql(13);
    });
  });
});
