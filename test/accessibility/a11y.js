const { fail } = require('assert');
const pa11y = require('pa11y');
const supertest = require('supertest');
const app = require('test/accessibility/testApp');
const steps = require('steps');

const agent = supertest.agent(app);
const options = {
  ignore: [
    'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.Fieldset.Name',
    'WCAG2AA.Principle4.Guideline4_1.4_1_2.H91.Select.Name',
    'WCAG2AA.Principle1.Guideline1_3.1_3_1.H71.NoLegend',
    'WCAG2AA.Principle1.Guideline1_3.1_3_1.F68'
  ],
  hideElements: '.govuk-header, .govuk-footer, link[rel=mask-icon], #ctsc-web-chat, iframe'
};

const excludeSteps = [
  '/sessions',
  '/internal-server-error',
  '/duplicate-case-error',
  '/enter-appellant-contact-details',
  '/appointee-contact-details',
  '/idam-redirect',
  '/authenticated',
  '/sign-out',
  '/sign-in-back'
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
      const messages = await pa11y(agent.get(url).url, options);
      expectNoErrors(messages.issues);
    });
  });
}

describe('Accessibility', () => {
  const languages = ['en', 'cy'];

  languages.forEach(language => {
    steps.forEach(step => {
      const url = step.path;
      const excluded = excludeSteps.some(stepUrl => stepUrl === url);

      if (!excluded) {
        accessibilityCheck(`${url}?lng=${language}`);
      }
    });
  });
});
