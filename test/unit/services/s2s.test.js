const chai = require('chai');
const sinon = require('sinon');

const expect = chai.expect;
const S2SService = require('../../../services/s2sService');

describe('S2SService', () => {
  let service = null;
  let configStub = null;
  let requestStub = null;
  let authStub = null;
  let loggerStub = null;
  let clock = null;

  beforeEach(() => {
    clock = sinon.useFakeTimers();

    configStub = {
      get: sinon.stub()
    };
    configStub.get.withArgs('s2s.microservice').returns('my-service');
    configStub.get.withArgs('s2s.secret').returns('secret-key');
    configStub.get.withArgs('s2s.url').returns('http://s2s-api');
    configStub.get.withArgs('s2s.timeout').returns(5000);

    loggerStub = { trace: sinon.stub() };
    authStub = { generate: sinon.stub().returns('123456') };

    const createMockRequest = resolveWith => ({
      set: sinon.stub().returnsThis(),
      send: sinon.stub().returnsThis(),
      timeout: sinon.stub().returnsThis(),
      then: (onSuccess, onFail) => {
        if (resolveWith instanceof Error) return onFail(resolveWith);
        return onSuccess(resolveWith);
      }
    });

    requestStub = {
      post: sinon.stub().returns(createMockRequest({ text: 'fake-token' }))
    };

    service = new S2SService({
      config: configStub,
      request: requestStub,
      logger: loggerStub,
      authenticator: authStub
    });
  });

  afterEach(() => {
    sinon.restore();
    clock.restore();
  });

  describe('generateToken()', () => {
    it('should set the internal token and expiry on success', async() => {
      const token = await service.generateToken();

      expect(token).to.equal('fake-token');
      expect(service.token).to.equal('fake-token');
      expect(service.tokenExpiry).to.equal(1000 * 60 * 60);
    });

    it('should return empty string and log error if request fails', async() => {
      requestStub.post.returns({
        set: sinon.stub().returnsThis(),
        send: sinon.stub().returnsThis(),
        timeout: sinon.stub().returnsThis(),
        then: (onSuccess, onFail) => onFail(new Error('API Down'))
      });

      const token = await service.generateToken();

      expect(token).to.equal('');
      expect(loggerStub.trace.calledOnce).to.be.true;
    });
  });

  describe('getServiceAuthToken()', () => {
    it('should fetch a new token if cache is empty', async() => {
      await service.getServiceAuthToken();
      expect(requestStub.post.calledOnce).to.be.true;
    });

    it('should use cached token if it is still valid', async() => {
      service.token = 'existing-token';
      service.tokenExpiry = Date.now() + 5000;

      const token = await service.getServiceAuthToken();

      expect(token).to.equal('existing-token');
      expect(requestStub.post.called).to.be.false;
    });

    it('should refresh if token is expired', async() => {
      service.token = 'old-token';
      service.tokenExpiry = Date.now() - 10;

      await service.getServiceAuthToken();
      expect(requestStub.post.calledOnce).to.be.true;
    });

    it('should throw if it cannot acquire a token', async() => {
      service.token = '';
      requestStub.post.returns({
        set: sinon.stub().returnsThis(),
        send: sinon.stub().returnsThis(),
        timeout: sinon.stub().returnsThis(),
        then: (onSuccess, onFail) => onFail(new Error('Fail'))
      });

      try {
        await service.getServiceAuthToken();
        throw new Error('Should have failed');
      } catch (error) {
        expect(error.message).to.equal('S2S token unavailable');
      }
    });
  });

  describe('initTokenRefresh()', () => {
    it('should call refresh immediately and set an interval', async() => {
      const intervalId = service.initTokenRefresh();

      expect(requestStub.post.calledOnce).to.be.true;

      await clock.tickAsync(1000 * 60 * 60);
      expect(requestStub.post.calledTwice).to.be.true;

      clearInterval(intervalId);
    });
  });
});
