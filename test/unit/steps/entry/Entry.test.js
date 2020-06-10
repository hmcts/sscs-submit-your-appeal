const { expect } = require('test/util/chai');
const paths = require('paths');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const mockHandler = sinon.spy();
class RestoreFromDraftStore {
  constructor(params) {
    Object.assign(this, params);
  }
  handler() {
    mockHandler();
  }
}

RestoreFromDraftStore.handler = sinon.spy();

const Entry = proxyquire('steps/entry/Entry', {
  'middleware/draftAppealStoreMiddleware': {
    RestoreFromDraftStore
  }
});

describe('Entry.js', () => {
  let entry = null;

  beforeEach(() => {
    entry = new Entry({
      journey: {
        steps: {
          BenefitType: paths.start.benefitType
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /entry', () => {
      expect(Entry.path).to.equal(paths.session.entry);
    });
  });

  describe('next()', () => {
    it('returns the next step path /benefit-type', () => {
      expect(entry.next()).to.eql({ nextStep: paths.start.benefitType });
    });
  });

  describe('Wen method user data is restored', () => {
    const req = { session: { isUserSessionRestored: true, featureToggles: { ft_welsh: false } } };
    const redirect = sinon.spy();
    const res = {
      redirect,
      sendStatus: sinon.spy()
    };
    it('should not call `super.handler()`', () => {
      entry.handler(req, res);
      expect(redirect.called).to.eql(true);
      expect(mockHandler.calledOnce).to.eql(false);
    });
  });

  describe('Wen method user data is not restored', () => {
    const req = { session: { isUserSessionRestored: false, featureToggles: { ft_welsh: false } } };
    const redirect = sinon.spy();
    const res = {
      redirect,
      sendStatus: sinon.spy()
    };
    it('should not call `super.handler()`', () => {
      entry.handler(req, res);
      expect(redirect.called).to.eql(false);
      expect(mockHandler.calledOnce).to.eql(true);
    });
  });
});
