const proxyquire = require('proxyquire').noCallThru();
const sinon = require('sinon');
const chai = require('chai');
const Base64 = require('js-base64').Base64;

const post = sinon.spy(() => Promise.resolve());
const get = sinon.spy(() => Promise.resolve('{ "foo": "bar" }'));

const draftAppealStoreMiddleware = proxyquire('middleware/draftAppealStoreMiddleware', {
  'request-promise-native': { post, get },
  config: { get: () => 'true' }
});

const expect = chai.expect;

describe('middleware/draftAppealStoreMiddleware', () => {
  describe('saveToDraftStore,', () => {
    const req = {
      journey: { settings: { draftUrl: '__draftUrl__' } },
      session: {
        foo: 'bar',
        cookie: '__cookie__',
        expires: '__expires__'
      },
      idam: 'test_user'
    };

    const res = {};
    const next = sinon.spy();

    it('should submit the draft to the API', async() => {
      await draftAppealStoreMiddleware.saveToDraftStore(req, res, next);
      expect(next.calledOnce).to.eql(true);
      expect(post.getCall(0).args[0].uri).to.eql(req.journey.settings.draftUrl);
      expect(post.getCall(0).args[0].body).to.eql('{"foo":"bar"}');
      expect(post.getCall(0).args[0].headers).to.eql({ 'content-type': 'application/json' });
    });
  });

  describe('restoreFromDraftStore,', () => {
    const req = {
      journey: { settings: { draftUrl: '__draftUrl__' } },
      idam: 'test_user',
      session: {}
    };
    const res = {};
    const next = sinon.spy();

    it('should restore a previously saved session', async() => {
      await draftAppealStoreMiddleware.restoreFromDraftStore(req, res, next);
      expect(next.calledOnce).to.eql(true);
      expect(req.session).to.eql({ foo: 'bar' });
    });
  });

  describe('restoreFromIdamState,', () => {
    const req = {
      idam: 'test_user',
      query: { state: Base64.encodeURI('{"foo":"bar"}') },
      session: {}
    };
    const res = {};
    const next = sinon.spy();

    it('should', async() => {
      await draftAppealStoreMiddleware.restoreFromIdamState(req, res, next);
      expect(req.session).to.eql({ foo: 'bar' });
      expect(next.calledOnce).to.eql(true);
    });
  });
});
