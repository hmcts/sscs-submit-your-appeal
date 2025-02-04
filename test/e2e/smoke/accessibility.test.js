const { test, expect } = require("@playwright/test");
const accessibilityTestHelper = require("../helpers/accessibilityHelper");
const steps = require("../../../steps");

let excludeSteps = [
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
  '/new-appeal'
];

let ibcSteps = [
  '/need-a-review-decision-notice',
  '/enter-appellant-role',
  '/enter-appellant-ibca-reference',
  '/appellant-international-contact-details',
  '/appellant-in-mainland-uk',
  '/representative-in-mainland-uk',
  '/representative-international-details'
];

let loggedInSteps = [
  '/draft-appeals',
]

function accessibilityCheck(url, language) {
  test(`Page ${url} - ${language} should have no accessibility errors`, async ({ page }) => {
    await page.goto('/');
    await page.goto(`${url}?lng=${language}`);
    await page.waitForURL(`${url}?lng=${language}`)
    let violations = await accessibilityTestHelper.axeTest(page);
    expect(
      violations,
      `There are ${violations.length} accessibility issues: `
    ).toEqual([]);
  });
}

test.describe('Accessibility tests', { tag: '@accessibility' }, () => {
  let urls = [...new Set(steps.filter(step => !excludeSteps.includes(step.path)
    && !ibcSteps.includes(step.path)
    && !loggedInSteps.includes(step.path))
    .map(steps => steps.path))];
  const languages = ['en', 'cy'];
  languages.forEach(language => {
    urls.forEach(url => {
      accessibilityCheck(url, language);
    });
  });
});