const language = 'cy';
const invalidPostcodeContent = require(`steps/start/invalid-postcode/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');

test.describe(`${language.toUpperCase()} - Invalid postcode @batch-12`, () => {
  Before(async({ page }) => {
    page.goto(paths.start.invalidPostcode);
  });

  test(`${language.toUpperCase()} - When I go to the invalid postcode page I see the page heading`, ({ page }) => {
    expect(page.getByText(invalidPostcodeContent.title)).toBeVisible();
  });
});
