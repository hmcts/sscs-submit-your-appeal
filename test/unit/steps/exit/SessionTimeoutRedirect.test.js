const {
  expect
} = require('test/util/chai');
const SessionTimeoutRedirect = require('steps/exit-points/SessionTimeoutRedirect');
const paths = require('paths');
const steps = require('steps');

describe.only('SessionTimeoutRedirect.js', () => {
  describe('path()', () => {
    it('returns path /session-timeout-redirect', () => {
      expect(SessionTimeoutRedirect.path).to.equal(paths.session.sessionTimeoutRedirect);
    });
  });

  describe('next()', () => {
    it.only('redirect to /sign-out if user is logged in', () => {
      const signOutStep = steps.filter(step => step.name === 'SignOut').pop();
      const sessionTimeoutStep = steps.filter(step => step.name === 'SessionTimeout').pop();
      const req = {
        idam: {
          userId: '1'
        },
        journey: {
          steps: {
            SignOut: signOutStep,
            SessionTimeoutStep: sessionTimeoutStep
          }
        }
      };

      const sessionTimeoutRedirect = new SessionTimeoutRedirect(req);
      expect(sessionTimeoutRedirect.next().step.path).to.equal(paths.idam.signOut);
    });
  });
});
