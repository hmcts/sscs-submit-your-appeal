const TheHearing = require('steps/hearing/the-hearing/TheHearing');
const sections = require('steps/check-your-appeal/sections');
const { expect } = require('test/util/chai');
const paths = require('paths');
const userAnswer = require('utils/answer');

describe('TheHearing.js', () => {
  let theHearing = null;

  beforeEach(() => {
    theHearing = new TheHearing({
      journey: {
        steps: {
          HearingOptions: paths.hearing.hearingOptions,
          HearingSupport: paths.hearing.hearingSupport,
          NotAttendingHearing: paths.hearing.notAttendingHearing
        }
      },
      session: {
        BenefitType: {
          benefitType: {}
        }
      }
    });

    theHearing.fields = {
      attendHearing: {}
    };
  });

  describe('get path()', () => {
    it('returns path /the-hearing', () => {
      expect(theHearing.path).to.equal(paths.hearing.theHearing);
    });
  });

  describe('suffix()', () => {
    it('should return Iba for IBA case', () => {
      theHearing.req.hostname = 'some-iba-hostname';
      expect(theHearing.suffix).to.eql('Iba');
    });

    it('should return empty for non IBA case', () => {
      theHearing.req.hostname = 'some-normal-hostname';
      expect(theHearing.suffix).to.eql('');
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = theHearing.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('attendHearing');
    });

    describe('attendHearing field', () => {
      beforeEach(() => {
        field = fields.attendHearing;
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
    const value = userAnswer.NO;

    beforeEach(() => {
      theHearing.content = {
        cya: {
          attendHearing: {
            question,
            yes: 'Yes',
            no: 'No'
          }
        }
      };

      theHearing.fields.attendHearing.value = value;
    });

    it('should contain a single answer', () => {
      const answers = theHearing.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.theHearing);
      expect(answers[0].answer).to.equal('No');
    });

    it('should contain a value object', () => {
      const values = theHearing.values();
      expect(values).to.eql({ hearing: { wantsToAttend: false } });
    });

    it('should contain null as the value', () => {
      theHearing.fields.attendHearing.value = '';
      const values = theHearing.values();
      expect(values).to.eql({ hearing: { wantsToAttend: null } });
    });
  });

  describe('next()', () => {
    it('returns the next step path /hearing-options when attendHearing value is Yes', () => {
      theHearing.fields.attendHearing.value = 'yes';
      expect(theHearing.next().step).to.eq(paths.hearing.hearingOptions);
    });

    it('returns the next step path /not-attending-hearing when attendHearing value is No', () => {
      theHearing.fields.attendHearing.value = 'no';
      expect(theHearing.next().step).to.eq(paths.hearing.notAttendingHearing);
    });
  });
});
