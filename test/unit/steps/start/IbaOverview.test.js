/* eslint-disable no-loop-func, guard-for-in */
const { expect } = require('test/util/chai');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');
const IbaOverview = require('steps/start/iba-overview/IbaOverview');
const sinon = require('sinon');
const { Interstitial } = require('@hmcts/one-per-page/steps');

describe('IbaOverview.js', () => {
  let ibaOverview = null;
  beforeEach(() => {
    ibaOverview = new IbaOverview({
      journey: {
        steps: {
          IbaStartPage: paths.start.ibaStartPage
        }
      },
      session: {
        BenefitType: {
          benefitType: benefitTypes.infectedBloodAppeal
        }
      }
    });
  });

  it('returns path /ibca-appeals-overview', () => {
    expect(ibaOverview.path).to.equal(paths.start.ibaOverview);
  });

  describe('handler()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('redirect to /does-not-exist for non-iba', () => {
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
      ibaOverview.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });

    it('super handler called iba', () => {
      const superStub = sinon.stub(Interstitial.prototype, 'handler');
      const req = {
        method: 'GET',
        session: {
          BenefitType: {
            benefitType: benefitTypes.infectedBloodAppeal
          }
        }
      };
      const res = {
        redirect: sinon.spy(),
        render: sinon.spy()
      };
      const next = sinon.spy();
      ibaOverview.handler(req, res, next);
      expect(res.redirect.called).to.eql(false);
      sinon.assert.calledOnce(superStub);
    });
  });

  describe('next()', () => {
    it('returns /ibca-appeal-start-page', () => {
      expect(ibaOverview.next().step).to.eql(paths.start.ibaStartPage);
    });
  });
});
