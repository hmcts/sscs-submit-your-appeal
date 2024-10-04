/* eslint-disable no-loop-func, guard-for-in */
const { expect } = require('test/util/chai');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');
const IbaStartPage = require('steps/start/iba-start-page/IbaStartPage');
const sinon = require('sinon');
const { Interstitial } = require('@hmcts/one-per-page/steps');

describe('IbaStartPage.js', () => {
  let ibaStartPage = null;
  beforeEach(() => {
    ibaStartPage = new IbaStartPage({
      journey: {
        steps: {
          LanguagePreference: paths.start.languagePreference,
          Independence: paths.start.independence
        }
      },
      session: {
        BenefitType: {
          benefitType: benefitTypes.infectedBloodAppeal
        }
      }
    });
  });

  it('returns path /ibca-appeal-start-page', () => {
    expect(ibaStartPage.path).to.equal(paths.start.ibaStartPage);
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
      ibaStartPage.handler(req, res, next);
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
      ibaStartPage.handler(req, res, next);
      expect(res.redirect.called).to.eql(false);
      sinon.assert.calledOnce(superStub);
    });
  });

  describe('next()', () => {
    it('returns /language-preference when Welsh feature toggle is on', () => {
      // eslint-disable-next-line no-process-env
      process.env.FT_WELSH = 'true';
      expect(ibaStartPage.next().step).to.eql(paths.start.languagePreference);
      // eslint-disable-next-line no-process-env
      process.env.FT_WELSH = 'false';
    });

    it('returns /independence when Welsh feature toggle is off', () => {
      expect(ibaStartPage.next().step).to.eql(paths.start.independence);
    });
  });
});
