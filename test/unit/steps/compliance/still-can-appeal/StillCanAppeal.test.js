const { expect } = require('test/util/chai');
const paths = require('paths');
const StillCanAppeal = require('steps/compliance/still-can-appeal/StillCanAppeal');
const sinon = require('sinon');
const benefitTypes = require('steps/start/benefit-type/types');
const { Interstitial } = require('lib/vendor/one-per-page/src/steps');

describe('StillCanAppeal', () => {
  let stillCanAppeal = null;

  beforeEach(() => {
    stillCanAppeal = new StillCanAppeal({
      journey: {
        steps: {
          Appointee: paths.identity.areYouAnAppointee
        }
      }
    });
  });

  it('get path /still-can-appeal', () => {
    expect(stillCanAppeal.path).to.equal(paths.compliance.stillCanAppeal);
  });

  describe('handler()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('no redirect to /does-not-exist called for non iba', () => {
      const superStub = sinon.stub(Interstitial.prototype, 'handler');
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
      stillCanAppeal.handler(req, res, next);
      expect(res.redirect.called).to.eql(false);
      sinon.assert.calledOnce(superStub);
    });
    it('redirect to /does-not-exist called for iba', () => {
      const superStub = sinon.stub(Interstitial.prototype, 'handler');
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
      stillCanAppeal.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });

  it('next returns the next step path /are-you-an-appointee', () => {
    expect(stillCanAppeal.next()).to.eql({
      nextStep: paths.identity.areYouAnAppointee
    });
  });
});
