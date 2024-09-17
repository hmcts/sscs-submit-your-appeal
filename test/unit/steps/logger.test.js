/* eslint-disable no-process-env */
const { expect } = require('test/util/chai');
const sinon = require('sinon');
const applicationInsights = require('applicationinsights');
const logger = require('logger');
const chalk = require('chalk');
const config = require('config');

const iKey = config.get('appInsights.instrumentationKey').toString() || process.env.APPINSIGHTS_INSTRUMENTATIONKEY || 'test-key';

describe('logger.js', () => {
  let applicationInsightsStartSpy = null;
  let applicationInsightsExceptionSpy = null;
  let applicationInsightsTraceSpy = null;
  let applicationInsightsEventSpy = null;
  let consoleSpy = null;
  let nativeConsoleSpy = null;
  let sandBox = null;
  beforeEach(() => {
    logger.setIkey(iKey);
    logger.startAppInsights();
    sandBox = sinon.createSandbox();
    nativeConsoleSpy = sandBox.stub(console, 'log');
    applicationInsightsStartSpy = sandBox.stub(applicationInsights, 'start');
    applicationInsightsExceptionSpy = sandBox.stub(applicationInsights.defaultClient,
      'trackException');
    applicationInsightsTraceSpy = sandBox.stub(applicationInsights.defaultClient, 'trackTrace');
    applicationInsightsEventSpy = sandBox.stub(applicationInsights.defaultClient, 'trackEvent');
    consoleSpy = sandBox.spy(logger, 'console');
  });

  afterEach(() => {
    sandBox.restore();
  });

  it('startAppInsights should be not called', () => {
    logger.setIkey('');
    logger.startAppInsights();
    expect(applicationInsightsStartSpy).to.have.not.been.calledOnce;
  });

  it('startAppInsights should be called', () => {
    logger.setIkey(iKey);
    logger.startAppInsights();
    expect(applicationInsightsStartSpy).to.have.been.calledOnce;
  });

  it('exception should call  exception tracking', () => {
    const error = 'Error happened here';
    const label = 'test.js';

    logger.exception(error, label);

    const msgBuild = logger.msgBuilder(error, label);

    expect(applicationInsightsExceptionSpy).to.have.been
      .calledWith(sinon.match({
        exception: sinon.match.instanceOf(Error).and(sinon.match.has('message', msgBuild))
      }));

    expect(consoleSpy).to.have.been.calledWith(sinon.match.instanceOf(Error)
      .and(sinon.match.has('message', msgBuild)), 3);
  });


  it('exception should not call  appinsight tracking', () => {
    const error = 'Error happened here';
    const label = 'test.js';

    logger.exception(error, label, false);

    expect(applicationInsightsExceptionSpy).to.not.have.been.calledOnce;
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

  it('trace should not calling appinsight', () => {
    const error = 'Trace happened here';
    const label = 'test.js';

    logger.trace(error, label, 1, {}, false);

    expect(applicationInsightsTraceSpy).to.have.not.been.calledOnce;
    expect(consoleSpy).to.have.been.calledOnce;
  });

  it('event should be called with proper args', () => {
    const event = 'Event Name';

    logger.event(event);

    expect(applicationInsightsEventSpy).to.have.been.calledOnce;
  });

  it('event should not calling appinsight', () => {
    const eventName = 'Event Name';

    logger.event(eventName, false);

    expect(applicationInsightsTraceSpy).to.have.not.been.calledOnce;
  });


  it('msgBuilder should be return expected msg text', () => {
    const result = logger.msgBuilder('builder', 'test.js');
    expect(result).to.equal('[test.js] - builder');
  });

  it('console should return expected text in color', () => {
    const testProps = { test: '' };
    logger.console('console logging', 0, testProps);
    expect(nativeConsoleSpy).to.have.been.calledWith(chalk.white('console logging'), testProps);

    logger.console('console logging', 1);
    expect(nativeConsoleSpy).to.have.been.calledWith(chalk.green('console logging'), '');

    logger.console('console logging', 2);
    expect(nativeConsoleSpy).to.have.been.calledWith(chalk.yellow('console logging'), '');

    logger.console('console logging', 3);
    expect(nativeConsoleSpy).to.have.been.calledWith(chalk.red('console logging'), '');

    logger.console('console logging', 4);
    expect(nativeConsoleSpy).to.have.been.calledWith(chalk.bgRed('console logging'), '');

    logger.console('console logging');
    expect(nativeConsoleSpy).to.have.been.calledWith('console logging', '');
  });

  it('isObject should validate correctly', () => {
    let isObject = logger.isObject({});
    expect(isObject).to.be.equal(true);

    isObject = logger.isObject(null);
    expect(isObject).to.be.equal(false);
  });
});
