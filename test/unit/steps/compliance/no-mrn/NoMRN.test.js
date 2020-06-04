const { expect } = require('test/util/chai');
const NoMRN = require('steps/compliance/no-mrn/NoMRN');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

describe('NoMRN.js', () => {
  let noMRN = null;

  beforeEach(() => {
    noMRN = new NoMRN({
      journey: {
        steps: {
          StillCanAppeal: paths.compliance.stillCanAppeal
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /no-mrn', () => {
      expect(NoMRN.path).to.equal(paths.compliance.noMRN);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = noMRN.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('reasonForNoMRN');
    });

    describe('reasonForNoMRN field', () => {
      beforeEach(() => {
        field = fields.reasonForNoMRN;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });
  });

  describe('get middleware()', () => {
    it('returns correct middleware array', () => {
      expect(noMRN.middleware).to.be.an('array');
      expect(noMRN.middleware).to.have.length(11);
      expect(noMRN.middleware[0]).to.equal(checkWelshToggle);
    });
  });

  describe('answers() and values()', () => {
    const question = 'A Question';
    const value = 'The reason is...';

    beforeEach(() => {
      noMRN.content = {
        cya: {
          reasonForNoMRN: {
            question
          }
        }
      };

      noMRN.fields = {
        reasonForNoMRN: {
          value
        }
      };
    });

    it('should contain a single answer', () => {
      const answers = noMRN.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.mrnDate);
      expect(answers[0].answer).to.equal(value);
    });

    it('should contain a value object', () => {
      const values = noMRN.values();
      expect(values).to.eql({ mrn: { reasonForNoMRN: value } });
    });
  });

  describe('next()', () => {
    it('returns the next step path /still-can-appeal', () => {
      expect(noMRN.next()).to.eql({ nextStep: paths.compliance.stillCanAppeal });
    });
  });
});
