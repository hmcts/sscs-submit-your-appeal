const {
  expect
} = require('test/util/chai');
const paths = require('paths');
const NewAppeal = require('steps/new-appeal/NewAppeal');
const sinon = require('sinon');
const resetJourney = require('middleware/draftAppealStoreMiddleware').resetJourney;

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
      newAppeal.handler(req, res);
      expect(res.redirect.called).to.eql(false);
    });
    it('should call reset journey and redirect to entry when a get request', () => {
      sinon.spy(resetJourney);
      newAppeal.handler(req, res);
      expect(resetJourney.calledOnce);
    });
  });
});
