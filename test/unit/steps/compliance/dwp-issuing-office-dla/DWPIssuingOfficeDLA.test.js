const { expect } = require('test/util/chai');
const DWPIssuingOfficeEsa = require('steps/compliance/dwp-issuing-office-other/DWPIssuingOfficeEsa');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');

describe('DWPIssuingOfficeEsa.js', () => {
  let dwpIssuingOfficeEsa = null;

  beforeEach(() => {
    dwpIssuingOfficeEsa = new DWPIssuingOfficeEsa({
      journey: {
        steps: {
          Appointee: paths.identity.areYouAnAppointee
        },
        req: {
          session: {
            BenefitType: {
              benefitType: benefitTypes.disabilityLivingAllowance
            }
          }
        }
      }
    });
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
    it('has options for DLA', () => {
      expect(dwpIssuingOfficeEsa.options.length).to.eql(3);
      expect(dwpIssuingOfficeEsa.options[0].label).to.eql('Disability Benefit Centre 4');
      expect(dwpIssuingOfficeEsa.options[1].label).to.eql('The Pension Service 11');
      expect(dwpIssuingOfficeEsa.options[2].label).to.eql('Recovery from Estates');
    });
  });
});
