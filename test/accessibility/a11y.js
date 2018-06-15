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
  ignore: [
    'WCAG2AA.Principle2.Guideline2_4.2_4_1.G1,G123,G124.NoSuchID',
    'WCAG2AA.Principle1.Guideline1_4.1_4_3.G18.Fail'
  ],
  hideElements: '#logo, #footer, link[rel=mask-icon]'
});

const test = promisify(pa11yTest.run, pa11yTest);

const excludeSteps = [
  '/oauth2/callback',
  '/save-and-close',
  '/session'
];


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
