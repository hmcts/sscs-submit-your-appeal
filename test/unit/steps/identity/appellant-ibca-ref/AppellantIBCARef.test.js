const AppellantIBCARef = require('steps/identity/appellant-ibca-ref/AppellantIBCARef');
const sections = require('steps/check-your-appeal/sections');
const { expect } = require('test/util/chai');
const paths = require('paths');
const { it, describe } = require('mocha');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const benefitTypes = require('steps/start/benefit-type/types');

describe('AppellantIBCARef.js', () => {
  let appellantIbcaRef = null;

  beforeEach(() => {
    appellantIbcaRef = new AppellantIBCARef({
      journey: {
        req: { session: { Appointee: { isAppointee: 'no' } } },
        steps: {
          MRNDate: paths.compliance.mrnDate
        }
      }
    });

    appellantIbcaRef.fields = {};
  });

  describe('get path()', () => {
    it('returns the path /enter-appellant-ibca-reference', () => {
      expect(AppellantIBCARef.path).to.equal(paths.identity.enterAppellantIBCARef);
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
      appellantIbcaRef.handler(req, res, next);
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
      appellantIbcaRef.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });

  describe('get form()', () => {
    it('should have one field', () => {
      expect(Object.keys(appellantIbcaRef.form.fields).length).to.equal(1);
    });

    it('should have the key to only field "ibcaRef" ', () => {
      expect(appellantIbcaRef.form.fields).to.have.all.keys('ibcaRef');
    });

    it('should have validations', () => {
      expect(appellantIbcaRef.form.fields.ibcaRef.validations).to.not.be.empty;
    });
  });

  describe('answers() and values() methods', () => {
    const ibcaRefNo = '343545434234';
    const question = 'IBCA Reference';

    beforeEach(() => {
      appellantIbcaRef.content = {
        cya: {
          ibcaRef: {
            question
          }
        }
      };

      appellantIbcaRef.fields = {
        ibcaRef: {
          value: ibcaRefNo
        }
      };
    });

    it('should contain a single question, section and answer', () => {
      const answers = appellantIbcaRef.answers();
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.appellantDetails);
      expect(answers[0].answer).to.equal(ibcaRefNo);
    });

    it('should contain value as IBCA Ref', () => {
      const values = appellantIbcaRef.values();
      expect(values).to.eql({ appellant: { ibcaRef: ibcaRefNo } });
    });
  });

  describe('next()', () => {
    it('should return the next step path /mrn-date', () => {
      expect(appellantIbcaRef.next().step).to.eql(paths.compliance.mrnDate);
    });
  });
});
