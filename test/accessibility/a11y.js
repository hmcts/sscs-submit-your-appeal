const { fail } = require('assert');
const { it } = require('mocha');
const promisify = require('es6-promisify');
const pa11y = require('pa11y');
const supertest = require('supertest');
const app = require('app');
const steps = require('steps');

const agent = supertest.agent(app);
const pa11yTest = pa11y({
  page: {
    headers: {
      Cookie: ''
    }
  },
  hideElements: '#logo, #footer, link[rel=mask-icon]'
});

const test = promisify(pa11yTest.run, pa11yTest);

const excludeSteps = ['/sessions'];


function ensurePageCallWillSucceed(url) {
  const res = agent.get(url);
  if (res.redirect) {
    throw new Error(`Call to ${url} resulted in a redirect to ${res.get('Location')}`);
  }

  if (!res.ok) {
    throw new Error(`Call to ${url} resulted in ${res.status}`);
  }
}

function expectNoErrors(messages) {
  const errors = messages.filter(m => m.type === 'error');

  if (errors.length > 0) {
    const errorsAsJson = `${JSON.stringify(errors, null, 2)}`;
    fail(`There are accessibility issues: \n${errorsAsJson}\n`);
  }
}

function accessibilityCheck(url) {
  describe(`Page ${url}`, () => {
    it('should have no accessibility errors', async() => {
      await ensurePageCallWillSucceed(url);
      const messages = await test(agent.get(url).url);
      expectNoErrors(messages);
    });
  });
}

describe('Accessibility', () => {
  steps.forEach(step => {
    const url = step.path;
    const excluded = excludeSteps.some(_ => _ === url);

    if (!excluded) {
      accessibilityCheck(url);
    }
  });
});
