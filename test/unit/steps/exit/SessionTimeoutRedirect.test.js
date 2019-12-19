const {
  expect
} = require('test/util/chai');
const SessionTimeoutRedirect = require('steps/exit-points/SessionTimeoutRedirect');
const paths = require('paths');
const steps = require('steps');
const itParam = require('mocha-param');

describe('path()', () => {
  it('returns path /session-timeout-redirect', () => {
    expect(SessionTimeoutRedirect.path).to.equal(paths.session.sessionTimeoutRedirect);
  });
});

function generateDifferentScenarios() {
  const signOutStep = steps.filter(step => step.name === 'SignOut').pop();
  // const sessionTimeoutStep = steps.filter(step => step.name === 'SessionTimeout').pop();
  const scenarioWithLoggedUser = {
    req: {
      idam: {
        userId: '1'
      },
      journey: {
        steps: {
          SignOut: signOutStep
        }
      }
    },
    expected: {
      path: '/sign-out'
    }
  };

  // const reqWithNoLoggedUser = {
  //   journey: {
  //     steps: {
  //       SessionTimeoutStep: sessionTimeoutStep
  //     }
  //   }
  // };
  return [scenarioWithLoggedUser];
}

describe.only('next()', () => {
  itParam('redirect to ', generateDifferentScenarios(), scenario => {
    const sessionTimeoutRedirect = new SessionTimeoutRedirect(scenario.req);
    expect(sessionTimeoutRedirect.next().step.path).to.equal(scenario.expected.path);
  });
});