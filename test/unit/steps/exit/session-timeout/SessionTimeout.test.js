const { expect } = require('test/util/chai');
const SessionTimeout = require('steps/exit-points/session-timeout/SessionTimeout');
const paths = require('paths');

describe('SessionTimeout.js', () => {
  describe('get path()', () => {
    it('returns path /exit', () => {
      expect(SessionTimeout.path).to.equal(paths.session.timeout);
    });
  });
});
