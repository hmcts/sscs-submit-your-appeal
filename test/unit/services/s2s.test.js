const { expect, sinon } = require('test/util/chai');
const proxyquire = require('proxyquire');

describe('S2S generateToken', () => {
  let generateToken = null;
  let stubs = null;
  let loggerTraceSpy = null;

  beforeEach(() => {
    stubs = {
      superagent: {
        post: sinon.stub()
      },
      otplib: {
        authenticator: {
          generate: sinon.stub()
        }
      },
      logger: {
        trace: sinon.spy()
      },
      config: {
        get: sinon.stub()
      }
    };

    // Mock config values
    stubs.config.get.withArgs('s2s.microservice').returns('my-service');
    stubs.config.get.withArgs('s2s.secret').returns('secret');
    stubs.config.get.withArgs('s2s.url').returns('http://s2s.local');
    stubs.config.get.withArgs('s2s.timeout').returns(1000);

    generateToken = proxyquire('services/s2s', stubs).generateToken;
    loggerTraceSpy = stubs.logger.trace;
  });

  it('should return token text when POST succeeds', async() => {
    const otp = '123456';
    stubs.otplib.authenticator.generate.returns(otp);

    // Chain stub objects
    const timeoutStub = sinon.stub().resolves({ text: 'token-abc' });
    const sendStub = sinon.stub().returns({ timeout: timeoutStub });
    const setStub = sinon.stub().returns({ send: sendStub });

    // superagent.post now correctly tracks arguments
    stubs.superagent.post.returns({ set: setStub });

    const token = await generateToken();

    expect(token).to.equal('token-abc');

    // Correct assertions
    expect(stubs.superagent.post.calledOnce).to.be.true;
    expect(stubs.superagent.post.firstCall.args[0]).to.equal(
      'http://s2s.local/lease'
    );
    expect(setStub.calledWith('Content-Type', 'application/json')).to.be.true;
    expect(
      sendStub.calledWith({ microservice: 'my-service', oneTimePassword: otp })
    ).to.be.true;
    expect(timeoutStub.calledWith(1000)).to.be.true;
  });

  it('should return empty string and log error when POST fails', async() => {
    const otp = '654321';
    stubs.otplib.authenticator.generate.returns(otp);

    const fieldStub = { send: sinon.stub().rejects(new Error('Failed')) };
    stubs.superagent.post.returns(fieldStub);

    const token = await generateToken();

    expect(token).to.equal('');
    expect(loggerTraceSpy.calledOnce).to.be.true;
    expect(loggerTraceSpy.args[0][0]).to.equal('Error generateToken');
    expect(loggerTraceSpy.args[0][1]).to.be.instanceOf(Error);
  });
});
