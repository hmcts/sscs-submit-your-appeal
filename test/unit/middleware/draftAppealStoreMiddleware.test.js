const sinon = require('sinon');
const chai = require('chai');
const Base64 = require('js-base64').Base64;
const draftAppealStoreMiddleware = require('middleware/draftAppealStoreMiddleware');
const logger = require('logger');

const expect = chai.expect;

// eslint-disable-next-line func-names
describe('middleware/draftAppealStoreMiddleware', () => {
  describe('saveToDraftStore,', () => {
    const req = {
      journey: { settings: { apiDraftUrl: '__draftUrl__' } },
      session: {
        foo: 'bar',
        cookie: '__cookie__',
        expires: '__expires__'
      },
      idam: 'test_user',
      cookies: { '__auth-token': 'xxx' }
    };
    const res = {};
    const next = sinon.spy();
    const loggerSpy = sinon.spy(logger, 'trace');
    it('should submit the draft to the API', () => {
      draftAppealStoreMiddleware.setFeatureFlag(true);
      draftAppealStoreMiddleware.saveToDraftStore(req, res, next);
      expect(loggerSpy).to.have.been.calledTwice;
      expect(next).to.have.been.calledOnce;
    });
  });

  describe('restoreUserState,', () => {
    const req = {
      journey: { settings: { apiDraftUrl: '__draftUrl__' } },
      cookies: { '__auth-token': 'xxxx' },
      idam: 'test_user',
      query: { state: Base64.encodeURI('{"foo":"bar"}') },
      session: {}
    };
    const res = {};
    const next = sinon.spy();

    it('should restore session from state', () => {
      draftAppealStoreMiddleware.setFeatureFlag(true);
      draftAppealStoreMiddleware.restoreUserState(req, res, next);
      expect(req.session).to.eql({ foo: 'bar', isUserSessionRestored: false });
    });
  });
});
