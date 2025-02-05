const { expect } = require('test/util/chai');
const paths = require('paths');

describe('paths.js', () => {
  it('should return an object', () => {
    expect(paths).to.be.an('object');
  });

  it('should return sessionTimeoutRedirect', () => {
    expect(paths.session.sessionTimeoutRedirect).to.equal(
      '/session-timeout-redirect'
    );
  });
});
