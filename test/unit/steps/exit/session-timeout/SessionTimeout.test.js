const { expect } = require('test/util/chai');
const SessionTimeout = require('steps/exit-points/session-timeout/SessionTimeout');
const paths = require('paths');
const checkWelshToggle = require('middleware/checkWelshToggle');

describe('SessionTimeout.js', () => {
  describe('get path()', () => {
    it('returns path /exit', () => {
      expect(SessionTimeout.path).to.equal(paths.session.timeout);
    });
  });

  describe('get middleware()', () => {
    it('returns correct middleware array', () => {
      const sessionTimeout = new SessionTimeout({
        journey: {}
      });

      expect(sessionTimeout.middleware).to.be.an('array');
      expect(sessionTimeout.middleware).to.have.length(6);
      expect(sessionTimeout.middleware[0]).to.equal(checkWelshToggle);
    });
  });
});
