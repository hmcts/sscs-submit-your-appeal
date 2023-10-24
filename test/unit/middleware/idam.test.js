const idamExpressMiddleware = require('@hmcts/div-idam-express-middleware');
const { expect, sinon } = require('test/util/chai');
const idam = require('middleware/idam');

describe('middleware/idam', () => {
  const req = {
    host: 'host',
    cookies: {},
    get: null,
    session: {}
  };
  const res = {};
  let next = null;
  let sandbox = null;
  beforeEach(() => {
    sandbox = sinon.createSandbox();
    next = sandbox.stub();
    req.get = sandbox.stub().withArgs('host').returns('host');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should contain all keys', () => {
    expect(idam).to.have.all.keys(
      'getIdamArgs',
      'authenticate',
      'landingPage',
      'protect',
      'logout',
      'userDetails'
    );
  });

  it('logout should call logout middleware if there is a session', () => {
    req.cookies['__auth-token'] = 'aToken';
    const middleWareStub = sandbox.spy(idamExpressMiddleware, 'logout');
    idam.logout(req, res, next);
    expect(middleWareStub).to.have.been.called;
  });
});
