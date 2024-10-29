const { expect } = require('test/util/chai');
const EvidenceProvide = require('steps/reasons-for-appealing/evidence-provide/EvidenceProvide');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const userAnswer = require('utils/answer');
const benefitTypes = require('steps/start/benefit-type/types');
const i18next = require('i18next');

describe('EvidenceProvide.js', () => {
  let evidenceProvide = null;

  beforeEach(() => {
    evidenceProvide = new EvidenceProvide({
      journey: {
        steps: {
          EvidenceUpload: paths.reasonsForAppealing.evidenceUpload,
          TheHearing: paths.hearing.theHearing
        }
      },
      session: {
        BenefitType: {
          benefitType: {}
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

  describe('noticeType()', () => {
    it('should return "Review Decision Notice" when in IBA journey', () => {
      evidenceProvide.req.session.BenefitType.benefitType = benefitTypes.infectedBloodAppeal;
      expect(evidenceProvide.noticeType).to.equal('Review Decision Notice');
    });

    it('should return "Mandatory Reconsideration Notice (MRN)"', () => {
      evidenceProvide.req.session.BenefitType.benefitType = benefitTypes.personalIndependencePayment;
      expect(evidenceProvide.noticeType).to.equal('Mandatory Reconsideration Notice (MRN)');
    });

    it('should return "Mandatory Reconsideration Notice (MRN)" in welsh', () => {
      i18next.changeLanguage('cy');
      evidenceProvide.req.session.BenefitType.benefitType = benefitTypes.personalIndependencePayment;
      expect(evidenceProvide.noticeType).to.equal('Hysbysiad Gorfodi i Ailystyried (MRN)');
    });

    after(() => {
      i18next.changeLanguage('en');
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
            question,
            yes: 'Yes',
            no: 'No'
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

    describe('English', () => {
      it('should titleise the users selection to \'No\' for CYA (English)', () => {
        evidenceProvide.fields.evidenceProvide.value = userAnswer.NO;
        const answers = evidenceProvide.answers();
        expect(answers.answer).to.equal('No');
      });

      it('should titleise the users selection to \'Yes\' for CYA (English)', () => {
        evidenceProvide.fields.evidenceProvide.value = userAnswer.YES;
        const answers = evidenceProvide.answers();
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

      it('should titleise the users selection to \'Na hoffwn\' for CYA (Welsh)', () => {
        evidenceProvide.content.cya.evidenceProvide.no = 'Na hoffwn';
        evidenceProvide.fields.evidenceProvide.value = userAnswer.NO;
        const answers = evidenceProvide.answers();
        expect(answers.answer).to.equal('Na hoffwn');
      });

      it('should titleise the users selection to \'Hoffwn\' for CYA (Welsh)', () => {
        evidenceProvide.content.cya.evidenceProvide.yes = 'Hoffwn';
        evidenceProvide.fields.evidenceProvide.value = userAnswer.YES;
        const answers = evidenceProvide.answers();
        expect(answers.answer).to.equal('Hoffwn');
      });
    });

    it('should set evidenceProvide to false', () => {
      evidenceProvide.fields.evidenceProvide.value = userAnswer.NO;
      const values = evidenceProvide.values();
      expect(values).to.eql({ evidenceProvide: false });
    });

    it('should set evidenceProvide to true', () => {
      evidenceProvide.fields.evidenceProvide.value = userAnswer.YES;
      const values = evidenceProvide.values();
      expect(values).to.eql({ evidenceProvide: true });
    });

    it('should set evidenceProvide to empty string', () => {
      evidenceProvide.fields.evidenceProvide.value = '';
      const values = evidenceProvide.values();
      expect(values).to.eql({ evidenceProvide: '' });
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
