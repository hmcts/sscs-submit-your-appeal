const {
  expect
} = require('test/util/chai');
const SessionTimeoutRedirect = require('steps/exit-points/SessionTimeoutRedirect');
const paths = require('paths');

describe.only('SessionTimeoutRedirect.js',() => {
  
  describe('get path()', () => {
    it('returns path /session-timeout-redirect', () => {
      expect(SessionTimeoutRedirect.path).to.equal(paths.session.sessionTimeoutRedirect);
    });
  });

});
