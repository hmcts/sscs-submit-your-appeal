const { expect } = require('test/util/chai');
const steps = require('steps');

describe('steps.js', () => {
  it('should return an array', () => {
    expect(steps).to.be.an('array');
  });
  it('should return SessionTimeoutRedirect', () => {
    const sessionTimeOutRedirectStep = steps.filter(
      step => step.name === 'SessionTimeoutRedirect'
    );
    expect(sessionTimeOutRedirectStep.pop().name).to.equal(
      'SessionTimeoutRedirect'
    );
  });
});
