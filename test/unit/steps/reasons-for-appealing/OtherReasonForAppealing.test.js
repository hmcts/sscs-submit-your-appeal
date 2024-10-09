/* eslint-disable max-len */

const OtherReasonForAppealing = require('steps/reasons-for-appealing/other-reasons-for-appealing/OtherReasonForAppealing');
const sections = require('steps/check-your-appeal/sections');
const { expect } = require('test/util/chai');
const paths = require('paths');
const userAnswer = require('utils/answer');
const benefitTypes = require('steps/start/benefit-type/types');

const evidenceUploadEnabled = require('config').features.evidenceUpload.enabled;

describe('OtherReasonForAppealing.js', () => {
  let otherReasonForAppealing = null;

  beforeEach(() => {
    otherReasonForAppealing = new OtherReasonForAppealing({
      journey: {
        steps: {
          SendingEvidence: paths.reasonsForAppealing.sendingEvidence,
          EvidenceProvide: paths.reasonsForAppealing.evidenceProvide
        }
      },
      session: {
        BenefitType: {
          benefitType: {}
        }
      }
    });

    otherReasonForAppealing.fields = {
      otherReasonForAppealing: {}
    };
  });

  describe('get path()', () => {
    it('returns path /other-reason-for-appealing', () => {
      expect(otherReasonForAppealing.path).to.eq(paths.reasonsForAppealing.otherReasonForAppealing);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = otherReasonForAppealing.form.fields;
    });

    it('should contain 1 field', () => {
      expect(Object.keys(fields).length).to.equal(1);
      expect(fields).to.have.all.keys('otherReasonForAppealing');
    });

    describe('otherReasonForAppealing field', () => {
      beforeEach(() => {
        field = fields.otherReasonForAppealing;
      });

      it('has constructor name FieldDescriptor', () => {
        expect(field.constructor.name).to.eq('FieldDescriptor');
      });

      it('contains validation', () => {
        expect(field.validations).to.be.empty;
      });
    });
  });

  describe('answers() and values()', () => {
    const question = 'A Question';
    const value = 'Reason';

    beforeEach(() => {
      otherReasonForAppealing.content = {
        cya: {
          otherReasonForAppealing: {
            question
          }
        }
      };

      otherReasonForAppealing.fields.otherReasonForAppealing.value = value;
    });

    describe('answers()', () => {
      it('should contain a single answer', () => {
        const answers = otherReasonForAppealing.answers();
        expect(answers.length).to.equal(1);
        expect(answers[0].question).to.equal(question);
        expect(answers[0].section).to.equal(sections.reasonsForAppealing);
      });

      it('should set the answer index as the field value when it has been set', () => {
        const answers = otherReasonForAppealing.answers();
        expect(answers[0].answer).to.equal(value);
      });

      it('should set the answer index as Not Required when it hasn\'t been set', () => {
        otherReasonForAppealing.fields.otherReasonForAppealing.value = undefined;
        const answers = otherReasonForAppealing.answers();
        expect(answers[0].answer).to.equal(userAnswer.NOT_REQUIRED);
      });
    });

    it('should contain a value object', () => {
      const values = otherReasonForAppealing.values();
      expect(values).to.eql({ reasonsForAppealing: { otherReasons: value } });
    });
  });

  describe('reviewBody()', () => {
    it('should return "IBCA" in IBA journey', () => {
      otherReasonForAppealing.req.session.BenefitType.benefitType = benefitTypes.infectedBloodAppeal;
      expect(otherReasonForAppealing.reviewBody).to.equal('IBCA');
    });

    it('should return  "DWP" in non IBA journey', () => {
      otherReasonForAppealing.req.session.BenefitType.benefitType = benefitTypes.personalIndependencePayment;
      expect(otherReasonForAppealing.reviewBody).to.equal('DWP');
    });
  });

  describe('subtitleEnd()', () => {
    it('should return "decision" in IBA journey', () => {
      otherReasonForAppealing.req.session.BenefitType.benefitType = benefitTypes.infectedBloodAppeal;
      expect(otherReasonForAppealing.subtitleEnd).to.equal('decision');
    });

    it('should return  "assessment" in non IBA journey', () => {
      otherReasonForAppealing.req.session.BenefitType.benefitType = benefitTypes.personalIndependencePayment;
      expect(otherReasonForAppealing.subtitleEnd).to.equal('assessment');
    });
  });

  describe('next()', () => {
    const expectedPath = evidenceUploadEnabled ? 'evidence-provide' : 'sending-evidence';
    const pathObjectName = evidenceUploadEnabled ? 'evidenceProvide' : 'sendingEvidence';
    it(`returns the next step path /${expectedPath}`, () => {
      expect(otherReasonForAppealing.next().step).to.eq(paths.reasonsForAppealing[pathObjectName]);
    });
  });
});
