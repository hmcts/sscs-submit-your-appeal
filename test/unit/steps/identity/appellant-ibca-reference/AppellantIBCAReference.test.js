const AppellantIBCAReference = require('steps/identity/appellant-ibca-reference/AppellantIBCAReference');
const sections = require('steps/check-your-appeal/sections');
const { expect } = require('test/util/chai');
const paths = require('paths');
const { it, describe } = require('mocha');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const benefitTypes = require('steps/start/benefit-type/types');

describe('AppellantIBCAReference.js', () => {
  let appellantIbcaReference = null;

  beforeEach(() => {
    appellantIbcaReference = new AppellantIBCAReference({
      journey: {
        req: { session: { Appointee: { isAppointee: 'no' } } },
        steps: {
          MRNDate: paths.compliance.mrnDate
        }
      }
    });

    appellantIbcaReference.fields = {};
  });

  describe('get path()', () => {
    it('returns the path /enter-appellant-ibca-reference', () => {
      expect(AppellantIBCAReference.path).to.equal(paths.identity.enterAppellantIBCAReference);
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
            benefitType: benefitTypes.infectedBloodCompensation
          }
        }
      };
      const res = {
        redirect: sinon.spy()
      };
      const next = sinon.spy();
      appellantIbcaReference.handler(req, res, next);
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
      appellantIbcaReference.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });

  describe('get form()', () => {
    it('should have one field', () => {
      expect(Object.keys(appellantIbcaReference.form.fields).length).to.equal(1);
    });

    it('should have the key to only field "ibcaReference" ', () => {
      expect(appellantIbcaReference.form.fields).to.have.all.keys('ibcaReference');
    });

    it('should have validations', () => {
      expect(appellantIbcaReference.form.fields.ibcaReference.validations).to.not.be.empty;
    });
  });

  describe('answers() and values() methods', () => {
    const ibcaReferenceNo = '343545434234';
    const question = 'IBCA Reference';

    beforeEach(() => {
      appellantIbcaReference.content = {
        cya: {
          ibcaReference: {
            question
          }
        }
      };

      appellantIbcaReference.fields = {
        ibcaReference: {
          value: ibcaReferenceNo
        }
      };
    });

    it('should contain a single question, section and answer', () => {
      const answers = appellantIbcaReference.answers();
      expect(answers[0].question).to.equal(question);
      expect(answers[0].section).to.equal(sections.appellantDetails);
      expect(answers[0].answer).to.equal(ibcaReferenceNo);
    });

    it('should contain value as IBCA Ref', () => {
      const values = appellantIbcaReference.values();
      expect(values).to.eql({ appellant: { ibcaReference: ibcaReferenceNo } });
    });
  });

  describe('next()', () => {
    it('should return the next step path /mrn-date', () => {
      expect(appellantIbcaReference.next().step).to.eql(paths.compliance.mrnDate);
    });
  });
});
