const { expect } = require('test/util/chai');
const Representative = require('steps/representative/representative/Representative');
const sections = require('steps/check-your-appeal/sections');
const userAnswer = require('utils/answer');
const paths = require('paths');
const i18next = require('i18next');

describe('Representative.js', () => {
  let representative = null;

  beforeEach(() => {
    representative = new Representative({
      journey: {
        steps: {
          RepresentativeDetails: paths.representative.representativeDetails,
          ReasonForAppealing: paths.reasonsForAppealing.reasonForAppealing,
          RepresentativeInUk: paths.representative.representativeInUk
        }
      }
    });

    representative.fields = {
      hasRepresentative: {}
    };
  });

  describe('get path()', () => {
    it('returns path /representative', () => {
      expect(Representative.path).to.equal(paths.representative.representative);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = representative.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('hasRepresentative');
    });

    describe('hasRepresentative field', () => {
      beforeEach(() => {
        field = fields.hasRepresentative;
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
      representative.content = {
        cya: {
          hasRepresentative: {
            question,
            yes: 'Yes',
            no: 'No'
          }
        }
      };

      representative.fields = {
        hasRepresentative: {}
      };
    });

    it('should set the question and section', () => {
      const answers = representative.answers();
      expect(answers.question).to.equal(question);
      expect(answers.section).to.equal(sections.representative);
    });

    describe('English', () => {
      it('should titleise the users selection to \'No\' for CYA (English)', () => {
        representative.fields.hasRepresentative.value = userAnswer.NO;
        const answers = representative.answers();
        expect(answers.answer).to.equal('No');
      });

      it('should titleise the users selection to \'Yes\' for CYA (English)', () => {
        representative.fields.hasRepresentative.value = userAnswer.YES;
        const answers = representative.answers();
        expect(answers.answer).to.equal('Yes');
      });
    });

    describe('Welsh', () => {
      beforeEach(() => {
        i18next.changeLanguage('cy');
      });

      afterEach(() => {
        i18next.changeLanguage('en');
      });

      it('should titleise the users selection to \'Nac ydw\' for CYA (Welsh)', () => {
        representative.content.cya.hasRepresentative.no = 'Nac ydw';
        representative.fields.hasRepresentative.value = userAnswer.NO;
        const answers = representative.answers();
        expect(answers.answer).to.equal('Nac ydw');
      });

      it('should titleise the users selection to \'Ydw\' for CYA (Welsh)', () => {
        representative.content.cya.hasRepresentative.yes = 'Ydw';
        representative.fields.hasRepresentative.value = userAnswer.YES;
        const answers = representative.answers();
        expect(answers.answer).to.equal('Ydw');
      });
    });

    it('should set hasRepresentative to false', () => {
      representative.fields.hasRepresentative.value = userAnswer.NO;
      const values = representative.values();
      expect(values).to.eql({ hasRepresentative: false });
    });

    it('should set hasRepresentative to true', () => {
      representative.fields.hasRepresentative.value = userAnswer.YES;
      const values = representative.values();
      expect(values).to.eql({ hasRepresentative: true });
    });

    it('should set hasRepresentative to null', () => {
      representative.fields.hasRepresentative.value = '';
      const values = representative.values();
      expect(values).to.eql({ hasRepresentative: null });
    });
  });

  describe('next()', () => {
    it('nextStep equals /representative-details if not iba with rep', () => {
      representative.fields.hasRepresentative.value = userAnswer.YES;
      expect(representative.next().step).to.eql(paths.representative.representativeDetails);
    });

    it('nextStep equals /representative-details if iba with rep', () => {
      representative.req = { hostname: 'some-iba-hostname' };
      representative.fields.hasRepresentative.value = userAnswer.YES;
      expect(representative.next().step).to.eql(paths.representative.representativeInUk);
    });

    it('nextStep equals /reason-for-appealing no rep', () => {
      representative.fields.hasRepresentative.value = userAnswer.NO;
      expect(representative.next().step).to.eql(paths.reasonsForAppealing.reasonForAppealing);
    });
  });
});
