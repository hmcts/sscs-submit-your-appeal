const { expect } = require('test/util/chai');
const IRNOverOneMonthLate = require('steps/compliance/irn-over-month-late/IRNOverOneMonthLate');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');

describe('IRNOverOneMonth.js', () => {
  let irnOverOneMonth = null;

  beforeEach(() => {
    irnOverOneMonth = new IRNOverOneMonthLate({
      journey: {
        req: {
          session: {
            BenefitType: {
              benefitType: benefitTypes.infectedBloodAppeal
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
    it('returns path /irn-over-month-late', () => {
      expect(IRNOverOneMonthLate.path).to.equal(paths.compliance.irnOverMonthLate);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = irnOverOneMonth.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('reasonForBeingLate');
    });

    describe('reasonForBeingLate field', () => {
      beforeEach(() => {
        field = fields.reasonForBeingLate;
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
    const value = 'The reason is...';

    beforeEach(() => {
      irnOverOneMonth.content = {
        cya: {
          reasonForBeingLate: {
            question
          }
        }
      };

      irnOverOneMonth.fields = {
        reasonForBeingLate: {
          value
        }
      };
    });

    it('should contain a single answer', () => {
      const answers = irnOverOneMonth.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.irnDate);
      expect(answers[0].answer).to.equal(value);
    });

    it('should contain a value object', () => {
      const values = irnOverOneMonth.values();
      expect(values).to.eql({ irn: { reasonForBeingLate: value } });
    });
  });

  describe('next()', () => {
    it('returns the next step path /are-you-an-appointee for IBA', () => {
      expect(irnOverOneMonth.next().step).to.eql(paths.identity.areYouAnAppointee);
    });
  });
});
