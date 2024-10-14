/* eslint-disable max-len */

const { expect } = require('test/util/chai');
const IRNOverThirteenMonthsLate = require('steps/compliance/irn-over-thirteen-months-late/IRNOverThirteenMonthsLate');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const benefitTypes = require('steps/start/benefit-type/types');

describe('IRNOverThirteenMonthsLate.js', () => {
  let irnOverThirteenMonthsLate = null;

  beforeEach(() => {
    irnOverThirteenMonthsLate = new IRNOverThirteenMonthsLate({
      journey: {
        req: {
          session: {
            BenefitType: {
              benefitType: benefitTypes.infectedBloodAppeal
            }
          }
        },
        steps: {
          AppellantName: paths.identity.enterAppellantName
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /irn-over-thirteen-months-late', () => {
      expect(IRNOverThirteenMonthsLate.path).to.equal(paths.compliance.irnOverThirteenMonthsLate);
    });
  });
  describe('handler()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('redirect to entry called for iba', () => {
      const superStub = sinon.stub(SaveToDraftStore.prototype, 'handler');
      const req = {
        method: 'GET',
        session: {
          BenefitType: {
            benefitType: benefitTypes.infectedBloodAppeal
          }
        }
      };
      const res = {
        redirect: sinon.spy()
      };
      const next = sinon.spy();
      irnOverThirteenMonthsLate.handler(req, res, next);

      expect(res.redirect.called).to.eql(false);
      sinon.assert.calledOnce(superStub);
    });
    it('redirect to /does-not-exist called for non iba', () => {
      const superStub = sinon.stub(SaveToDraftStore.prototype, 'handler');
      const req = {
        method: 'GET',
        session: {
          BenefitType: {
            benefitType: benefitTypes.nationalInsuranceCredits
          }
        }
      };
      const res = {
        redirect: sinon.spy()
      };
      const next = sinon.spy();
      irnOverThirteenMonthsLate.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = irnOverThirteenMonthsLate.form.fields;
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
      irnOverThirteenMonthsLate.content = {
        cya: {
          reasonForBeingLate: {
            question
          }
        }
      };

      irnOverThirteenMonthsLate.fields = {
        reasonForBeingLate: {
          value
        }
      };
    });

    it('should contain a single answer', () => {
      const answers = irnOverThirteenMonthsLate.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.irnDate);
      expect(answers[0].answer).to.equal(value);
    });

    it('should contain a value object', () => {
      const values = irnOverThirteenMonthsLate.values();
      expect(values).to.eql({ irn: { reasonForBeingLate: value } });
    });
  });

  describe('next()', () => {
    it('returns the next step path /enter-appellant-name for IBA', () => {
      expect(irnOverThirteenMonthsLate.next().step).to.eql(paths.identity.enterAppellantName);
    });
  });
});
