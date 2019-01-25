const { expect } = require('test/util/chai');
const sinon = require('sinon');
const applicationInsights = require('applicationinsights');
const logger = require('logger');
const chalk = require('chalk');

describe('logger.js', () => {
  let applicationInsightsStartSpy = null;
  let startAppInsightsSpy = null;
  let exceptionSpy = null;
  let traceSpy = null;
  let msgBuilderSpy = null;
  let consoleSpy = null;
  let nativeConsoleSpy = null;

  beforeEach(() => {
    applicationInsightsStartSpy = sinon.spy(applicationInsights, 'start');
    startAppInsightsSpy = sinon.spy(logger, 'startAppInsights');
    exceptionSpy = sinon.spy(logger, 'exception');
    traceSpy = sinon.spy(logger, 'trace');
    msgBuilderSpy = sinon.spy(logger, 'msgBuilder');
    consoleSpy = sinon.spy(logger, 'console');
    nativeConsoleSpy = sinon.spy(console, 'log');
  });

  afterEach(() => {
    applicationInsightsStartSpy.restore();
    startAppInsightsSpy.restore();
    exceptionSpy.restore();
    traceSpy.restore();
    msgBuilderSpy.restore();
    consoleSpy.restore();
    nativeConsoleSpy.restore();
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

  it('exception should call app exception tracking', () => {
    logger.exception('Error happened here', 'test.js');
    expect(consoleSpy).to.have.been.calledWith(sinon.match.any, 3);
  });

  it('trace should return an function', () => {
    logger.trace('Info was sent', 'test.js');
    expect(consoleSpy).to.have.been.calledWith('[test.js] - Info was sent');
  });

  it('msgBuilder should return an function', () => {
    const result = logger.msgBuilder('builder', 'test.js');
    expect(result).to.equal('[test.js] - builder');
  });

  it('console should return an function', () => {
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

  it('isObject', () => {
    let isObject = logger.isObject({});
    expect(isObject).to.be.equal(true);

    isObject = logger.isObject(null);
    expect(isObject).to.be.equal(false);
  });
});