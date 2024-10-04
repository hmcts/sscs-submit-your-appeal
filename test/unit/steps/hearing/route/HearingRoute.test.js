const HearingRoute = require('steps/hearing/route/HearingRoute');
const { expect } = require('test/util/chai');
const paths = require('paths');
const userAnswer = require('utils/answer');

describe('HearingRoute.js', () => {
  let hearingRoute = null;

  beforeEach(() => {
    hearingRoute = new HearingRoute({
      journey: {
        steps: {
          HearingSupport: paths.hearing.hearingSupport
        }
      }
    });

    hearingRoute.fields = {
      hearingRoute: {}
    };
  });

  describe('get path()', () => {
    it('returns path /hearing-route', () => {
      expect(HearingRoute.path).to.equal(paths.hearing.hearingRoute);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = hearingRoute.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('hearingRoute');
    });

    describe('hearingRoute field', () => {
      beforeEach(() => {
        field = fields.hearingRoute;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.not.be.empty;
      });
    });
  });

  describe('answers()', () => {
    it('should contain correct value object for directive', () => {
      hearingRoute.fields.hearingRoute.value = userAnswer.YES;
      const answers = hearingRoute.answers();
      expect(answers.length).to.eql(1);
      expect(answers[0].section).to.eql('hearing-options');
      expect(answers[0].answer).to.eql('Directive');
      expect(answers[0].url).to.eql(paths.hearing.hearingRoute);
    });

    it('should contain correct value object for substantive', () => {
      hearingRoute.fields.hearingRoute.value = userAnswer.NO;
      const answers = hearingRoute.answers();
      expect(answers.length).to.eql(1);
      expect(answers[0].section).to.eql('hearing-options');
      expect(answers[0].answer).to.eql('Substantive');
      expect(answers[0].url).to.eql(paths.hearing.hearingRoute);
    });
  });

  describe('next()', () => {
    it('returns /hearing-support', () => {
      expect(hearingRoute.next().step).to.eq(paths.hearing.hearingSupport);
    });
  });
});
