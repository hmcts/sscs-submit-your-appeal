const { expect } = require('test/util/chai');
const paths = require('paths');
const NewAppeal = require('steps/new-appeal/NewAppeal');
const sinon = require('sinon');
const benefitTypes = require('../../../../steps/start/benefit-type/types');
const { Redirect } = require('@hmcts/one-per-page');

describe('NewAppeal.js', () => {
  let newAppeal = null;

  beforeEach(() => {
    newAppeal = new NewAppeal({
      journey: {
        steps: {
          BenefitType: paths.start.benefitType
        }
      }
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('get path()', () => {
    it('returns path /draft-appeals', () => {
      expect(NewAppeal.path).to.equal(paths.newAppeal);
    });
  });

  describe('next()', () => {
    it('should redirect to Benefit Type', () => {
      newAppeal.req = {
        session: {}
      };
      expect(newAppeal.next()).to.eql({
        nextStep: paths.start.benefitType
      });
    });
  });

  describe('When handler is called', () => {
    const req = {
      session: {
        save: sinon.spy(),
        isUserSessionRestored: true,
        drafts: {
          101: {
            key: 'value'
          }
        }
      }
    };
    const res = {
      redirect: sinon.spy(),
      sendStatus: sinon.spy()
    };

    it('should not call redirect to entry when not a get request', () => {
      const superStub = sinon.stub(Redirect.prototype, 'handler');
      newAppeal.handler(req, res);
      expect(req.session.save.calledOnce).to.eql(false);
      expect(res.redirect.calledOnce).to.eql(false);
      sinon.assert.called(superStub);
    });

    it('should call reset journey and redirect to /benefit-type when a get request non IBA', () => {
      req.method = 'GET';
      newAppeal.handler(req, res);
      expect(req.session.save.calledOnce).to.eql(true);
      expect(res.redirect.calledOnce).to.eql(true);
      expect(res.redirect.calledWith(paths.start.benefitType)).to.eql(true);
    });

    it('should call reset journey and call super when a get request IBA', () => {
      const superStub = sinon.stub(Redirect.prototype, 'handler');
      req.method = 'GET';
      req.session.BenefitType = {
        benefitType: benefitTypes.infectedBloodCompensation
      };
      newAppeal.handler(req, res);
      expect(req.session.save.calledTwice).to.eql(true);
      expect(req.session.BenefitType.benefitType).to.eql(
        benefitTypes.infectedBloodCompensation
      );
      sinon.assert.called(superStub);
    });
  });
});
