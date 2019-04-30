const sinon = require('sinon');
const chai = require('chai');
const Base64 = require('js-base64').Base64;
const draftAppealStoreMiddleware = require('middleware/draftAppealStoreMiddleware');
const logger = require('logger');
const request = require('superagent');
const paths = require('paths');

const expect = chai.expect;

// eslint-disable-next-line func-names
describe('middleware/draftAppealStoreMiddleware', () => {
  describe('saveToDraftStore, with values api call', () => {
    const req = {
      journey: { settings: { apiDraftUrl: '__draftUrl__' }, values: { postcodeChecker: true } },
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
    const requestPut = sinon.spy(request, 'put');

    it('should submit the draft to the API', () => {
      draftAppealStoreMiddleware.setFeatureFlag(true);
      draftAppealStoreMiddleware.saveToDraftStore(req, res, next);
      expect(requestPut).to.have.been.calledOnce;
    });
  });

  describe('saveToDraftStore, no values trace call', () => {
    const req = {
      journey: { settings: { apiDraftUrl: '__draftUrl__' }, values: () => {
        throw Error();
      } },
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
    });
  });

  describe('saveToDraftStore, no values next call', () => {
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

    it('should submit the draft to the API', () => {
      draftAppealStoreMiddleware.setFeatureFlag(true);
      draftAppealStoreMiddleware.saveToDraftStore(req, res, next);
      expect(next).to.have.been.calledOnce;
    });
  });

  describe('restoreUserState,', () => {
    const req = {
      journey: { settings: { apiDraftUrl: '__draftUrl__' } },
      cookies: { '__auth-token': 'xxxx' },
      query: { state: Base64.encodeURI('{"foo":"bar"}') },
      session: {}
    };
    const res = {};
    const next = sinon.spy();

    it('should not restore not logged in user session from state ', () => {
      draftAppealStoreMiddleware.setFeatureFlag(true);
      draftAppealStoreMiddleware.restoreUserState(req, res, next);
      expect(next).to.have.been.calledOnce;
    });
  });

  describe('restoreUserState,', () => {
    const req = {
      journey: { settings: { apiDraftUrl: '__draftUrl__' } },
      cookies: { '__auth-token': 'xxxx' },
      idam: 'test_user',
      query: { state: '' },
      session: {}
    };
    const res = {};
    const next = sinon.spy();
    const requestGet = sinon.spy(request, 'get');

    it('should restore session from backend', () => {
      draftAppealStoreMiddleware.setFeatureFlag(true);
      draftAppealStoreMiddleware.restoreUserState(req, res, next);
      expect(requestGet).to.have.been.calledOnce;
    });
  });

  describe('restoreUserSession', () => {
    const req = { session: {} };
    it('should call Object.assign', () => {
      const testValues = { test: 'value' };
      draftAppealStoreMiddleware.restoreUserSession(req, testValues);
      expect(req.session).to.eql(testValues);
    });
  });

  describe('RestoreFromDraftStore', () => {
    it('Expected Middleware count:', () => {
      const restoreFromDraftStore = new draftAppealStoreMiddleware.RestoreFromDraftStore({
        journey: {
          steps: {
            BenefitType: paths.start.benefitType
          }
        }
      });
      expect(restoreFromDraftStore.middleware).to.have.length(3);
    });
  });

  describe('RestoreUserState', () => {
    it('Expected Middleware count:', () => {
      const restoreUserState = new draftAppealStoreMiddleware.RestoreUserState({
        journey: {
          steps: {
            BenefitType: paths.start.benefitType
          }
        }
      });
      expect(restoreUserState.middleware).to.have.length(5);
    });
  });

  describe('SaveToDraftStore', () => {
    it('Expected Middleware count:', () => {
      const saveToDraftStore = new draftAppealStoreMiddleware.SaveToDraftStore({
        journey: {
          steps: {
            BenefitType: paths.start.benefitType
          }
        }
      });
      expect(saveToDraftStore.middleware).to.have.length(10);
    });
  });
});
