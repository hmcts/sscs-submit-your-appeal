const { expect } = require('test/util/chai');
const paths = require('paths');
const NeedRDN = require('steps/compliance/need-rdn/NeedRDN');
const sinon = require('sinon');
const benefitTypes = require('steps/start/benefit-type/types');
const { ExitPoint } = require('lib/vendor/one-per-page');

describe('NeedRDN.js', () => {
  let needRDN = null;
  it('returns path /need-a-review-decision-notice', () => {
    expect(NeedRDN.path).to.equal(paths.compliance.needRDN);
  });
  describe('handler()', () => {
    beforeEach(() => {
      needRDN = new NeedRDN({
        journey: {
          req: {
            session: {
              BenefitType: {
                benefitType: null
              }
            }
          }
        }
      });
    });

    afterEach(() => {
      sinon.restore();
    });

    it('redirect to entry called for iba', () => {
      const superStub = sinon.stub(ExitPoint.prototype, 'handler');
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
      needRDN.handler(req, res, next);
      expect(res.redirect.called).to.eql(false);
      sinon.assert.calledOnce(superStub);
    });
    it('redirect to /does-not-exist called for non iba', () => {
      const superStub = sinon.stub(ExitPoint.prototype, 'handler');
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
      needRDN.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });
});
