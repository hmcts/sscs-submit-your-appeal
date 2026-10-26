/* eslint-disable no-process-env */
const { expect } = require('test/util/chai');
const sinon = require('sinon');
const applicationInsights = require('applicationinsights');
const logger = require('logger');
const chalk = require('chalk');

describe('logger.js', () => {
  let applicationInsightsExceptionSpy = null;
  let applicationInsightsTraceSpy = null;
  let applicationInsightsEventSpy = null;
  let consoleSpy = null;
  let nativeConsoleSpy = null;
  let sandBox = null;

  before(() => {
    logger.monitoringMiddleware({
      connectionString:
        'InstrumentationKey=test-key;IngestionEndpoint=https://fake.endpoint',
      serviceName: 'TestApp',
      enabled: true
    });
  });

  after(() => {
    // 2. Clean up SDK background timers so your test runner doesn't hang indefinitely
    if (applicationInsights.dispose) {
      applicationInsights.dispose();
    }
  });

  beforeEach(() => {
    sandBox = sinon.createSandbox();
    nativeConsoleSpy = sandBox.stub(console, 'log');

    applicationInsightsExceptionSpy = sandBox.stub(
      applicationInsights.defaultClient,
      'trackException'
    );
    applicationInsightsTraceSpy = sandBox.stub(
      applicationInsights.defaultClient,
      'trackTrace'
    );
    applicationInsightsEventSpy = sandBox.stub(
      applicationInsights.defaultClient,
      'trackEvent'
    );

    consoleSpy = sandBox.spy(logger, 'console');

    logger.monitoringMiddleware({
      connectionString:
        'InstrumentationKey=test-key;IngestionEndpoint=https://fake.endpoint',
      serviceName: 'TestApp',
      enabled: true
    });

    consoleSpy.resetHistory();
  });

  afterEach(() => {
    sandBox.restore();
    delete process.env.APPLICATIONINSIGHTS_ROLE_NAME;
  });

  describe('monitoringMiddleware', () => {
    it('should set cloud role name and return a middleware function', () => {
      const middleware = logger.monitoringMiddleware({
        connectionString:
          'InstrumentationKey=test-key;IngestionEndpoint=https://fake.endpoint',
        serviceName: 'TestApp',
        enabled: true
      });

      expect(
        applicationInsights.defaultClient.context.tags[
          applicationInsights.defaultClient.context.keys.cloudRole
        ]
      ).to.equal('TestApp');
      expect(typeof middleware).to.equal('function');
    });

    it('should not initialize when disabled', () => {
      const middleware = logger.monitoringMiddleware({
        connectionString:
          'InstrumentationKey=test-key;IngestionEndpoint=https://fake.endpoint',
        serviceName: 'TestApp',
        enabled: false
      });

      expect(typeof middleware).to.equal('function');
    });

    it('should call next() as an Express middleware', () => {
      const nextSpy = sandBox.spy();
      const middleware = logger.monitoringMiddleware({ enabled: false });

      middleware({}, {}, nextSpy);

      expect(nextSpy).to.have.been.calledOnce;
    });
  });

  it('exception should call exception tracking', () => {
    const error = 'Error happened here';
    const label = 'test.js';

    logger.exception(error, label);

    const msgBuild = logger.msgBuilder(error, label);

    expect(applicationInsightsExceptionSpy).to.have.been.calledWith(
      sinon.match({
        exception: sinon.match
          .instanceOf(Error)
          .and(sinon.match.has('message', msgBuild))
      })
    );

    expect(consoleSpy).to.have.been.calledWith(
      sinon.match.instanceOf(Error).and(sinon.match.has('message', msgBuild)),
      3
    );
  });

  it('exception should not call appinsight tracking when postToAppInsights is false', () => {
    const error = 'Error happened here';
    const label = 'test.js';

    logger.exception(error, label, false);

    expect(applicationInsightsExceptionSpy).to.have.not.been.called;
    expect(consoleSpy).to.have.been.calledOnce;
  });

  it('trace should be called with proper args', () => {
    const error = 'Trace happened here';
    const label = 'test.js';

    logger.trace(error, label);

    const msgBuild = logger.msgBuilder(error, label);

    expect(applicationInsightsTraceSpy).to.have.been.calledOnce;
    expect(consoleSpy).to.have.been.calledWith(msgBuild, 1);
  });

  it('trace should not call appinsight when postToAppInsights is false', () => {
    const error = 'Trace happened here';
    const label = 'test.js';

    logger.trace(error, label, 1, {}, false);

    expect(applicationInsightsTraceSpy).to.have.not.been.called;
    expect(consoleSpy).to.have.been.calledOnce;
  });

  it('event should be called with proper args', () => {
    const event = 'Event Name';

    logger.event(event);

    expect(applicationInsightsEventSpy).to.have.been.calledOnce;
  });

  it('event should not call appinsight when postToAppInsights is false', () => {
    const eventName = 'Event Name';

    logger.event(eventName, false);

    expect(applicationInsightsEventSpy).to.have.not.been.called;
  });

  it('msgBuilder should return expected msg text', () => {
    const result = logger.msgBuilder('builder', 'test.js');
    expect(result).to.equal('[test.js] - builder');
  });

  it('console should return expected text in color', () => {
    const testProps = { test: '' };
    logger.console('console logging', 0, testProps);
    expect(nativeConsoleSpy).to.have.been.calledWith(
      chalk.white('console logging'),
      testProps
    );

    logger.console('console logging', 1);
    expect(nativeConsoleSpy).to.have.been.calledWith(
      chalk.green('console logging'),
      ''
    );

    logger.console('console logging', 2);
    expect(nativeConsoleSpy).to.have.been.calledWith(
      chalk.yellow('console logging'),
      ''
    );

    logger.console('console logging', 3);
    expect(nativeConsoleSpy).to.have.been.calledWith(
      chalk.red('console logging'),
      ''
    );

    logger.console('console logging', 4);
    expect(nativeConsoleSpy).to.have.been.calledWith(
      chalk.bgRed('console logging'),
      ''
    );

    logger.console('console logging');
    expect(nativeConsoleSpy).to.have.been.calledWith('console logging', '');
  });

  it('isObject should validate correctly', () => {
    expect(logger.isObject({})).to.be.equal(true);
    expect(logger.isObject(null)).to.be.equal(false);
  });
});
