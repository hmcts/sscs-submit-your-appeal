const { expect } = require('test/util/chai');
const paths = require('paths');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const mockHandler = sinon.spy();

class AuthAndRestoreAllDraftsState {
  constructor(params) {
    Object.assign(this, params);
  }
  handler() {
    mockHandler();
  }
}
AuthAndRestoreAllDraftsState.handler = sinon.spy();

const Entry = proxyquire('steps/idam/authenticated/Authenticated', {
  'middleware/draftAppealStoreMiddleware': {
    AuthAndRestoreAllDraftsState
  }
});


describe('Authenticated.js', () => {
  let entry = null;

  beforeEach(() => {
    entry = new Entry({
      journey: {
        steps: {
          HaveAMRN: paths.compliance.haveAMRN
        }
      }
    });
  });

  describe('get path()', () => {
    it('returns path /authenticated', () => {
      expect(Entry.path).to.equal(paths.idam.authenticated);
    });
  });

  describe('next()', () => {
    it('returns the next step path /have-you-got-an-mrn', () => {
      expect(entry.next()).to.eql({ nextStep: paths.compliance.haveAMRN });
    });
  });

  describe('handler()', () => {
    const next = sinon.spy();

    describe('when method is GET', () => {
      const req = { method: 'GET' };
      const redirect = sinon.spy();
      const res = { redirect };

      it('should redirect to checkyour appeal', () => {
        entry.handler(req, res, next);
        expect(redirect.calledOnce).to.eql(true);
      });
    });

    describe('When method is not GET', () => {
      const req = { method: 'FOO' };
      const redirect = sinon.spy();
      const res = {
        redirect,
        sendStatus: sinon.spy()
      };
      it('should call `super.handler()`', () => {
        entry.handler(req, res, next);
        expect(redirect.called).to.eql(false);
        expect(mockHandler.calledOnce).to.eql(true);
      });
    });
  });
});
