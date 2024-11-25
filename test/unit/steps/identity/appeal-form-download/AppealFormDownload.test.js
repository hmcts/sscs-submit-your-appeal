const AppealFormDownload = require('steps/appeal-form-download/AppealFormDownload');
const { expect } = require('test/util/chai');
const paths = require('paths');
const urls = require('urls');
const benefitTypes = require('steps/start/benefit-type/types');
const preserveSession = require('middleware/preserveSession');
const sinon = require('sinon');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');

describe('AppealFormDownload.js', () => {
  let appealFormDownload = null;

  beforeEach(() => {
    appealFormDownload = new AppealFormDownload({
      journey: {},
      sess: {
        BenefitType: {
          benefitType: null
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /appointee-form-download', () => {
      expect(AppealFormDownload.path).to.equal(paths.appealFormDownload);
    });
  });

  describe('handler()', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('redirect to doesNotExist called for iba', () => {
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
      appealFormDownload.handler(req, res, next);
      expect(res.redirect.called).to.eql(true);
      expect(res.redirect.calledWith(paths.errors.doesNotExist)).to.eql(true);
      sinon.assert.notCalled(superStub);
    });
    it('no redirect to /does-not-exist called for non iba', () => {
      const superStub = sinon.stub(SaveToDraftStore.prototype, 'handler');
      const req = {
        method: 'GET',
        session: {
          BenefitType: {
            benefitType: benefitTypes.attendanceAllowance
          }
        }
      };
      const res = {
        redirect: sinon.spy()
      };
      const next = sinon.spy();
      appealFormDownload.handler(req, res, next);
      expect(res.redirect.called).to.eql(false);
      sinon.assert.calledOnce(superStub);
    });
  });

  describe('get benefitType()', () => {
    it('returns correct wording', () => {
      appealFormDownload.req.sess.BenefitType.benefitType = 'some benefitType';
      expect(appealFormDownload.benefitType).to.equal('some benefitType');
    });
  });

  describe('get getFormLink()', () => {
    it('returns SSCS5 form link when Benefit type is Child Benefit', () => {
      appealFormDownload.req.sess.BenefitType.benefitType = benefitTypes.childBenefit;
      expect(appealFormDownload.formDownload.link).to.equal(urls.formDownload.sscs5);
    });

    it('returns SSCS5 form type when Benefit type is Child Benefit', () => {
      appealFormDownload.req.sess.BenefitType.benefitType = benefitTypes.childBenefit;
      expect(appealFormDownload.formDownload.type).to.equal('SSCS5');
    });

    it('returns SSCS1 form link when Benefit type is not Child Benefit', () => {
      appealFormDownload.req.sess.BenefitType.benefitType = benefitTypes.socialFund;
      expect(appealFormDownload.formDownload.link).to.equal(urls.formDownload.sscs1);
    });

    it('returns SSCS1 form type when Benefit type is not Child Benefit', () => {
      appealFormDownload.req.sess.BenefitType.benefitType = benefitTypes.socialFund;
      expect(appealFormDownload.formDownload.type).to.equal('SSCS1');
    });

    it('returns SSCS3 form link when Benefit type is Compensation Recovery', () => {
      appealFormDownload.req.sess.BenefitType.benefitType = benefitTypes.compensationRecovery;
      expect(appealFormDownload.formDownload.link).to.equal(urls.formDownload.sscs3);
    });

    it('returns SSCS3 form type when Benefit type is Compensation Recovery', () => {
      appealFormDownload.req.sess.BenefitType.benefitType = benefitTypes.compensationRecovery;
      expect(appealFormDownload.formDownload.type).to.equal('SSCS3');
    });

    it('returns SSCS2 form type when Benefit type is Child support', () => {
      appealFormDownload.req.sess.BenefitType.benefitType = benefitTypes.childSupport;
      expect(appealFormDownload.formDownload.type).to.equal('SSCS2');
      expect(appealFormDownload.formDownload.link).to.equal(urls.formDownload.sscs2);
    });
  });

  describe('get session()', () => {
    it('returns the session from the request', () => {
      expect(appealFormDownload.session).to.equal(appealFormDownload.req.sess);
    });
  });

  describe('get middleware()', () => {
    it('returns path /confirmation', () => {
      expect(appealFormDownload.middleware[0]).to.equal(preserveSession);
    });
  });
});
