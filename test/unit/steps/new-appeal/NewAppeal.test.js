const {
  expect
} = require('test/util/chai');
const paths = require('paths');
const NewAppeal = require('steps/new-appeal/NewAppeal');
const sinon = require('sinon');

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
      newAppeal.handler(req, res);
      expect(res.redirect.calledOnce).to.eql(false);
      expect(req.session.save.calledOnce).to.eql(false);
    });

    it('should call reset journey and redirect to entry when a get request', () => {
      req.method = 'GET';
      newAppeal.handler(req, res);
      expect(res.redirect.calledOnce).to.eql(true);
      /* eslint-disable-next-line no-undefined */
      expect(req.session.isUserSessionRestored).to.eql(undefined);
      expect(req.session.save.calledTwice).to.eql(true);
    });
  });
});
