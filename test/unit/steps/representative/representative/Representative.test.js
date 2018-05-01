const { expect } = require('test/util/chai');
const Representative = require('steps/representative/representative/Representative');
const sections = require('steps/check-your-appeal/sections');
const userAnswer = require('utils/answer');
const paths = require('paths');

describe('Representative.js', () => {
  let representative = null;

  beforeEach(() => {
    representative = new Representative({
      journey: {
        steps: {
          RepresentativeDetails: paths.representative.representativeDetails,
          ReasonForAppealing: paths.reasonsForAppealing.reasonForAppealing
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
            question
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

    it('should titleise the users selection to \'No\' for CYA', () => {
      representative.fields.hasRepresentative.value = userAnswer.NO;
      const answers = representative.answers();
      expect(answers.answer).to.equal('No');
    });

    it('should titleise the users selection to \'Yes\' for CYA', () => {
      representative.fields.hasRepresentative.value = userAnswer.YES;
      const answers = representative.answers();
      expect(answers.answer).to.equal('Yes');
    });

    it('should set hasRepresentative to false', () => {
      representative.fields.hasRepresentative.value = userAnswer.NO;
      const values = representative.values();
      expect(values).to.eql({ hasRepresentative: false });
    });

    it('hould set hasRepresentative to true', () => {
      representative.fields.hasRepresentative.value = userAnswer.YES;
      const values = representative.values();
      expect(values).to.eql({ hasRepresentative: true });
    });
  });

  describe('next()', () => {
    it('nextStep equals /representative-details', () => {
      representative.fields.hasRepresentative.value = userAnswer.YES;
      const branches = representative.next().branches[0];
      expect(branches.redirector).to.eql({ nextStep: paths.representative.representativeDetails });
    });

    it('nextStep equals /reason-for-appealing', () => {
      representative.fields.hasRepresentative.value = userAnswer.NO;
      const fallback = representative.next().fallback;
      expect(fallback).to.eql({ nextStep: paths.reasonsForAppealing.reasonForAppealing });
    });
  });
});
