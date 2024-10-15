const { expect } = require('test/util/chai');
const IRNOverOneMonthLate = require('steps/compliance/irn-over-month-late/IRNOverOneMonthLate');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const benefitTypes = require('steps/start/benefit-type/types');


describe('IRNOverOneMonth.js', () => {
  let irnOverOneMonth = null;

  beforeEach(() => {
    irnOverOneMonth = new IRNOverOneMonthLate({
      journey: {
        req: {
          session: {
            BenefitType: {
              benefitType: benefitTypes.infectedBloodAppeal
            }
          }
        },
        steps: {
          AppellantRole: paths.identity.enterAppellantRole
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /irn-over-month-late', () => {
      expect(IRNOverOneMonthLate.path).to.equal(paths.compliance.irnOverMonthLate);
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
      irnOverOneMonth.handler(req, res, next);
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
      irnOverOneMonth.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });

  describe('get form()', () => {
    let fields = null;
    let field = null;

    before(() => {
      fields = irnOverOneMonth.form.fields;
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
      irnOverOneMonth.content = {
        cya: {
          reasonForBeingLate: {
            question
          }
        }
      };

      irnOverOneMonth.fields = {
        reasonForBeingLate: {
          value
        }
      };
    });

    it('should contain a single answer', () => {
      const answers = irnOverOneMonth.answers();
      expect(answers.length).to.equal(1);
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.irnDate);
      expect(answers[0].answer).to.equal(value);
    });

    it('should contain a value object', () => {
      const values = irnOverOneMonth.values();
      expect(values).to.eql({ irn: { reasonForBeingLate: value } });
    });
  });

  describe('next()', () => {
    it('returns the next step path /enter-appellant-role for IBA', () => {
      expect(irnOverOneMonth.next().step).to.eql(paths.identity.enterAppellantRole);
    });
  });
});
