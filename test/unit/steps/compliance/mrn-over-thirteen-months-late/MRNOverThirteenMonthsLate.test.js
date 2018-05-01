/* eslint-disable max-len */

const { expect } = require('test/util/chai');
const MRNOverThirteenMonthsLate = require('steps/compliance/mrn-over-thirteen-months-late/MRNOverThirteenMonthsLate');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');

describe('MRNOverThirteenMonthsLate.js', () => {
  let mrnOverThirteenMonthsLate = null;

  beforeEach(() => {
    mrnOverThirteenMonthsLate = new MRNOverThirteenMonthsLate({
      journey: {
        steps: {
          AppellantName: paths.identity.enterAppellantName
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /mrn-over-thirteen-months-late', () => {
      expect(MRNOverThirteenMonthsLate.path).to.equal(paths.compliance.mrnOverThirteenMonthsLate);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = mrnOverThirteenMonthsLate.form.fields;
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
      mrnOverThirteenMonthsLate.content = {
        cya: {
          reasonForBeingLate: {
            question
          }
        }
      };

      mrnOverThirteenMonthsLate.fields = {
        reasonForBeingLate: {
          value
        }
      };
    });

    it('should contain a single answer', () => {
      const answers = mrnOverThirteenMonthsLate.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.mrnDate);
      expect(answers[0].answer).to.equal(value);
    });

    it('should contain a value object', () => {
      const values = mrnOverThirteenMonthsLate.values();
      expect(values).to.eql({ mrn: { reasonForBeingLate: value } });
    });
  });

  describe('next()', () => {
    it('returns the next step path /enter-appellant-name', () => {
      const nextStep = { nextStep: paths.identity.enterAppellantName };
      expect(mrnOverThirteenMonthsLate.next()).to.eql(nextStep);
    });
  });
});
