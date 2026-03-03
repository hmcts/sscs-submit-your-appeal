const { expect } = require('chai');
const sinon = require('sinon');
const request = require('superagent');
const logger = require('logger');

describe('S2S generateToken', () => {
  let s2sModule = null;
  const fakeToken = 'mocked-token';

  beforeEach(() => {
    delete require.cache[require.resolve('../../../services/s2s')];
    // eslint-disable-next-line global-require
    s2sModule = require('../../../services/s2s');

    sinon.restore();
    sinon.stub(logger, 'trace');
  });

  it('should return token text when POST succeeds', async() => {
    const timeoutStub = sinon.stub().resolves({ text: fakeToken });
    const sendStub = sinon.stub().returns({ timeout: timeoutStub });
    const setStub = sinon.stub().returns({ send: sendStub });
    sinon.stub(request, 'post').returns({ set: setStub });

    const token = await s2sModule.generateToken();
    expect(token).to.equal(fakeToken);

    expect(request.post.calledOnce).to.be.true;
    expect(setStub.calledWith('Content-Type', 'application/json')).to.be.true;
    expect(
      sendStub.calledWith(
        sinon.match({
          microservice: sinon.match.string,
          oneTimePassword: sinon.match.string
        })
      )
    ).to.be.true;
  });

  it('should return empty string if POST fails', async() => {
    const timeoutStub = sinon.stub().rejects(new Error('Network error'));
    const sendStub = sinon.stub().returns({ timeout: timeoutStub });
    const setStub = sinon.stub().returns({ send: sendStub });
    sinon.stub(request, 'post').returns({ set: setStub });

    const token = await s2sModule.generateToken();
    expect(token).to.equal('');
    expect(logger.trace.calledOnce).to.be.true;
    expect(logger.trace.firstCall.args[0]).to.equal(
      'Error generating S2S token'
    );
    expect(logger.trace.firstCall.args[1]).to.be.instanceOf(Error);
  });

  it('should never return empty string if POST succeeds', async() => {
    const timeoutStub = sinon.stub().resolves({ text: fakeToken });
    const sendStub = sinon.stub().returns({ timeout: timeoutStub });
    const setStub = sinon.stub().returns({ send: sendStub });
    sinon.stub(request, 'post').returns({ set: setStub });

    const token = await s2sModule.generateToken();
    expect(token).to.not.equal('');
  });
});
