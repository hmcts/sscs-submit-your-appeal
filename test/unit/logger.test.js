const { expect } = require('test/util/chai');
const logger = require('logger');

describe('logger.js', () => {
  it('startAppInsights should return an function', () => {
    expect(logger.startAppInsights).to.be.an('function');
  });

  it('exception should return an function', () => {
    expect(logger.exception).to.be.an('function');
  });

  it('trace should return an function', () => {
    expect(logger.trace).to.be.an('function');
  });

  it('msgBuilder should return an function', () => {
    expect(logger.msgBuilder).to.be.an('function');
  });

  it('console should return an function', () => {
    expect(logger.console).to.be.an('function');
  });
});