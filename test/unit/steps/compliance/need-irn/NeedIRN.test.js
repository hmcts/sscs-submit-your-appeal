const { expect } = require('test/util/chai');
const paths = require('paths');
const NeedIRN = require('steps/compliance/need-irn/NeedIRN');
const sinon = require('sinon');
const benefitTypes = require('steps/start/benefit-type/types');
const { ExitPoint } = require('@hmcts/one-per-page');

describe('NeedIRN.js', () => {
  let needIRN = null;
  it('returns path /need-an-irn', () => {
    expect(NeedIRN.path).to.equal(paths.compliance.needIRN);
  });
  describe('handler()', () => {
    beforeEach(() => {
      needIRN = new NeedIRN({
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
            benefitType: benefitTypes.infectedBloodAppeal
          }
        }
      };
      const res = {
        redirect: sinon.spy()
      };
      const next = sinon.spy();
      needIRN.handler(req, res, next);
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
      needIRN.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
  });
});
