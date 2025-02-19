/* eslint-disable no-shadow */
/* eslint-disable no-await-in-loop */
const { test, expect } = require('@playwright/test');
const accessibilityTestHelper = require('../helpers/accessibilityHelper');
const steps = require('steps');

const excludeSteps = [
  '/sessions',
  '/duplicate-case-error',
  '/idam-redirect',
  '/authenticated',
  '/sign-in-back',
  '/archive-appeal',
  '/entry',
  '/session-timeout-redirect',
  '/equality-and-diversity',
  '/edit-appeal',
  '/new-appeal',
  '/language-preference',
  '/dates-cant-attend'
];

const ibcSteps = [
  '/need-a-review-decision-notice',
  '/enter-appellant-role',
  '/enter-appellant-ibca-reference',
  '/appellant-international-contact-details',
  '/appellant-in-mainland-uk',
  '/representative-in-mainland-uk',
  '/representative-international-details'
];

const loggedInSteps = ['/draft-appeals'];

function accessibilityCheck(url, language) {
  test(`Page ${url} - ${language} should have no accessibility errors`, async({
    page
  }) => {
    for (let i = 1; i < 5; i++) {
      try {
        await page.goto('/');
        await expect(
          page.getByText('Which benefit is your appeal about?').first()
        ).toBeVisible();
        break;
      } catch (error) {
        console.error(
          `Error loading home page, trying again attempt ${i + 1} of 5:`,
          error
        );
      }
    }
    await page.goto(`${url}?lng=${language}`);
    await page.waitForURL(`${url}?lng=${language}`);
    const violations = await accessibilityTestHelper.axeTest(page);
    expect(
      violations,
      `There are ${violations.length} accessibility issues: `
    ).toEqual([]);
  });
}

test.describe('Accessibility tests', { tag: '@accessibility' }, () => {
  const filteredSteps = steps
    .filter(
      step =>
        !excludeSteps.includes(step.path) && !ibcSteps.includes(step.path) && !loggedInSteps.includes(step.path)
    )
    .map(steps => steps.path);
  const urls = [...new Set(filteredSteps)];
  const languages = ['en', 'cy'];
  languages.forEach(language => {
    urls.forEach(url => {
      accessibilityCheck(url, language);
    });
  });
});
