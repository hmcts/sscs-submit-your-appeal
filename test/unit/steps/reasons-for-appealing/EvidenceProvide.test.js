const { expect } = require('test/util/chai');
const EvidenceProvide = require('steps/reasons-for-appealing/evidence-provide/EvidenceProvide');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const userAnswer = require('utils/answer');

describe('EvidenceProvide.js', () => {
  let evidenceProvide = null;

  beforeEach(() => {
    evidenceProvide = new EvidenceProvide({
      journey: {
        steps: {
          EvidenceUpload: paths.reasonsForAppealing.evidenceUpload,
          TheHearing: paths.hearing.theHearing
        }
      }
    });

    evidenceProvide.fields = {
      evidenceProvide: {}
    };
  });

  describe('get path()', () => {
    it('returns path /evidence-provide', () => {
      expect(EvidenceProvide.path).to.equal(paths.reasonsForAppealing.evidenceProvide);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = evidenceProvide.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('evidenceProvide');
    });

    describe('evidenceProvide field', () => {
      beforeEach(() => {
        field = fields.evidenceProvide;
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
      evidenceProvide.content = {
        cya: {
          evidenceProvide: {
            question
          }
        }
      };

      evidenceProvide.fields = {
        evidenceProvide: {}
      };
    });

    it('should set the question and section', () => {
      const answers = evidenceProvide.answers();
      expect(answers.question).to.equal(question);
      expect(answers.section).to.equal(sections.reasonsForAppealing);
    });

    it('should titleise the users selection to \'No\' for CYA', () => {
      evidenceProvide.fields.evidenceProvide.value = userAnswer.NO;
      const answers = evidenceProvide.answers();
      expect(answers.answer).to.equal('No');
    });

    it('should titleise the users selection to \'Yes\' for CYA', () => {
      evidenceProvide.fields.evidenceProvide.value = userAnswer.YES;
      const answers = evidenceProvide.answers();
      expect(answers.answer).to.equal('Yes');
    });

    it('should set evidenceProvide to false', () => {
      evidenceProvide.fields.evidenceProvide.value = userAnswer.NO;
      const values = evidenceProvide.values();
      expect(values).to.eql({ evidenceProvide: false });
    });

    it('hould set evidenceProvide to true', () => {
      evidenceProvide.fields.evidenceProvide.value = userAnswer.YES;
      const values = evidenceProvide.values();
      expect(values).to.eql({ evidenceProvide: true });
    });
  });

  describe('next()', () => {
    it('returns the next step path /evidence-upload', () => {
      evidenceProvide.fields.evidenceProvide.value = userAnswer.YES;
      const nextStep = evidenceProvide.next().branches[0].redirector.nextStep;
      expect(nextStep).to.eq(paths.reasonsForAppealing.evidenceUpload);
    });

    it('returns the next step path /the-hearing', () => {
      evidenceProvide.fields.evidenceProvide.value = userAnswer.NO;
      const nextStep = evidenceProvide.next().fallback.nextStep;
      expect(nextStep).to.eq(paths.hearing.theHearing);
    });
  });
});
