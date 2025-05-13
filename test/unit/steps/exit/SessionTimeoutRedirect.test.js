const { expect } = require('test/util/chai');
const SessionTimeoutRedirect = require('steps/exit-points/SessionTimeoutRedirect');
const paths = require('paths');
const SignOut = require('steps/idam/sign-out/SignOut');
const SessionTimeout = require('steps/exit-points/session-timeout/SessionTimeout');

describe('path()', () => {
  it('returns path /session-timeout-redirect', () => {
    expect(SessionTimeoutRedirect.path).to.equal(
      paths.session.sessionTimeoutRedirect
    );
  });
});

describe('next()', () => {
  it('redirect to /sign-out when user is logged in', () => {
    const req = {
      idam: {
        userId: '1'
      },
      journey: {
        steps: {
          SignOut
        }
      }
    };
    const expectedPath = '/sign-out';
    const sessionTimeoutRedirect = new SessionTimeoutRedirect(req);
    expect(sessionTimeoutRedirect.next().step.path).to.equal(expectedPath);
  });

  it('redirect to /sign-out when user is not logged in', () => {
    const req = {
      journey: {
        steps: {
          SessionTimeout
        }
      }
    };
    const expectedPath = '/session-timeout';
    const sessionTimeoutRedirect = new SessionTimeoutRedirect(req);
    expect(sessionTimeoutRedirect.next().step.path).to.equal(expectedPath);
  });
});
