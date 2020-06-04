const HearingSupport = require('steps/hearing/support/HearingSupport');
const { expect } = require('test/util/chai');
const paths = require('paths');
const userAnswer = require('utils/answer');
const checkWelshToggle = require('middleware/checkWelshToggle');

describe('HearingSupport.js', () => {
  let hearingSupport = null;

  beforeEach(() => {
    hearingSupport = new HearingSupport({
      journey: {
        steps: {
          HearingAvailability: paths.hearing.hearingAvailability,
          HearingArrangements: paths.hearing.hearingArrangements
        }
      }
    });

    hearingSupport.fields = {
      arrangements: {}
    };
  });

  describe('get path()', () => {
    it('returns path /hearing-support', () => {
      expect(HearingSupport.path).to.equal(paths.hearing.hearingSupport);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = hearingSupport.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('arrangements');
    });

    describe('arrangements field', () => {
      beforeEach(() => {
        field = fields.arrangements;
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
      expect(hearingSupport.middleware).to.be.an('array');
      expect(hearingSupport.middleware).to.have.length(11);
      expect(hearingSupport.middleware).to.include(checkWelshToggle);
    });
  });

  describe('values()', () => {
    before(() => {
      hearingSupport.fields.arrangements.value = userAnswer.NO;
    });

    it('should contain a value object', () => {
      const values = hearingSupport.values();
      expect(values).to.eql({ hearing: { wantsSupport: false } });
    });
  });

  describe('answers()', () => {
    it('should contain hide index which is set to true', () => {
      const answers = hearingSupport.answers();
      expect(answers.hide).to.equal(true);
    });
  });

  describe('next()', () => {
    it('returns branch object where condition nextStep equals /arrangements', () => {
      const nextStep = hearingSupport.next().branches[0].redirector.nextStep;
      expect(nextStep).to.eq(paths.hearing.hearingArrangements);
    });

    it('returns fallback object where nextStep equals /hearing-availability', () => {
      const nextStep = hearingSupport.next().fallback.nextStep;
      expect(nextStep).to.eq(paths.hearing.hearingAvailability);
    });
  });
});
