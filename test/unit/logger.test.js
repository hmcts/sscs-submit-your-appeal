const { expect } = require('test/util/chai');
const sinon = require('sinon');
const applicationInsights = require('applicationinsights');
const logger = require('logger');
const chalk = require('chalk');

describe('logger.js', () => {
  let applicationInsightsStartSpy = null;
  let applicationInsightsExceptionSpy = null;
  let applicationInsightsTraceSpy = null;
  let consoleSpy = null;
  let nativeConsoleSpy = null;
  let sandBox = null;

  beforeEach(() => {
    logger.setIkey('test-key');
    logger.startAppInsights();
    sandBox = sinon.sandbox.create();
    nativeConsoleSpy = sandBox.stub(console, 'log');
    applicationInsightsStartSpy = sandBox.stub(applicationInsights, 'start');
    applicationInsightsExceptionSpy = sandBox.stub(applicationInsights.defaultClient,
      'trackException');
    applicationInsightsTraceSpy = sandBox.stub(applicationInsights.defaultClient, 'trackTrace');
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
    logger.setIkey('test-key');
    logger.startAppInsights();
    expect(applicationInsightsStartSpy).to.have.been.calledOnce;
  });

  it('exception should call  exception tracking', () => {
    const error = 'Error happened here';
    const label = 'test.js';

    logger.exception(error, label);

    const msgBuild = logger.msgBuilder(error, label);
    const errorObj = new Error(msgBuild);

    expect(applicationInsightsExceptionSpy).to.have.been
      .calledWith(sinon.match({ exception: errorObj }));

    expect(consoleSpy).to.have.been.calledWith(sinon.match(errorObj), 3);
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