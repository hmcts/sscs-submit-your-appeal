const { expect } = require('chai');
const proxyquire = require('proxyquire');
const sinon = require('sinon');

describe('services/healthcheck', () => {
  const addToStub = sinon.stub();
  const webStub = sinon.stub().callsFake((url, options) => ({ url, options }));
  const rawStub = sinon.stub().callsFake(fn => fn);
  const upStub = sinon.stub().returns('up');
  const downStub = sinon.stub().returns('down');
  const configGetStub = sinon.stub();
  const createClientStub = sinon.stub();
  const loggerStub = { trace: sinon.stub() };
  let setup = proxyquire('services/healthcheck.js', {
    '@hmcts/nodejs-healthcheck': {
      addTo: addToStub,
      web: webStub,
      raw: rawStub,
      up: upStub,
      down: downStub
    },
    config: {
      get: configGetStub,
      redis: { url: 'redis://localhost:6379' }
    },
    redis: {
      createClient: createClientStub
    },
    logger: loggerStub
  }).setup;

  beforeEach(() => {
    addToStub.resetHistory();
    webStub.resetHistory();
    rawStub.resetHistory();
    upStub.resetHistory();
    downStub.resetHistory();
    configGetStub.resetHistory();
    createClientStub.resetHistory();
    loggerStub.trace.resetHistory();

    configGetStub.callsFake(key => {
      const values = {
        'health.idam.url.hmctsAccess': 'https://hmcts-access.example',
        'services.idam.url.hmctsAccess': 'https://hmcts-access.fallback.example',
        'health.timeout': 3000,
        'health.deadline': 6000,
        'api.url': 'https://api.example'
      };

      return values[key];
    });

    createClientStub.returns({
      on: sinon.stub(),
      ping: sinon.stub().returns(true)
    });

    setup = proxyquire('services/healthcheck.js', {
      '@hmcts/nodejs-healthcheck': {
        addTo: addToStub,
        web: webStub,
        raw: rawStub,
        up: upStub,
        down: downStub
      },
      config: {
        get: configGetStub,
        redis: { url: 'redis://localhost:6379' }
      },
      redis: {
        createClient: createClientStub
      },
      logger: loggerStub
    }).setup;
  });

  afterEach(() => {
    sinon.restore();
  });

  it('registers healthcheck configuration', () => {
    setup({});

    expect(addToStub).to.have.been.calledOnce;
    expect(webStub).to.have.been.calledWith(
      'https://api.example/health',
      sinon.match({
        timeout: 3000,
        deadline: 6000
      })
    );
    expect(webStub).to.have.been.calledWith(
      'https://api.example/health/readiness',
      sinon.match({
        timeout: 3000,
        deadline: 6000
      })
    );
    expect(webStub).to.have.been.calledWith(
      'https://hmcts-access.example',
      sinon.match({
        timeout: 3000,
        deadline: 6000
      })
    );
  });

  it('redis checks use client ping', () => {
    setup({});

    const addToArg = addToStub.firstCall.args[1];

    expect(addToArg.readinessChecks.redis()).to.equal('up');
    expect(addToArg.hmctsAccessChecks.redis()).to.equal('up');
    expect(upStub).to.have.been.calledTwice;
  });
});
