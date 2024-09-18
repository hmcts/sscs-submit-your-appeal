const language = 'cy';
const commonContent = require('commonContent')[language];
const representativeDetailsContent = require(`steps/representative/representative-details/content.${language}`);
const paths = require('paths');

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - Representative Details @batch-10`, () => {

  Before(async ({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.representative.representativeDetails);
  });

  After(async ({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - After completing the form I am taken to the /reasons-for-appealing page`, ({ page }) => {
    enterRequiredRepresentativeDetails(page, );
    await page.click(commonContent.continue);
    page.seeInCurrentUrl(paths.reasonsForAppealing.reasonForAppealing);
  });

  test(`${language.toUpperCase()} - When I only provide a single character for firstName and lastName I see errors`, ({
                                                                                                                        page,
                                                                                                                      }) => {
    await page.fill('input[name="name.first"]', 'H');
    await page.fill('input[name="name.last"]', 'P');
    await page.click(commonContent.continue);
    expect(page.getByText(representativeDetailsContent.fields.name.first.error.invalid)).toBeVisible();
    expect(page.getByText(representativeDetailsContent.fields.name.last.error.invalid)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click continue without filling in the fields I see errors`, ({ page }) => {
    await page.click(commonContent.continue);
    expect(page.getByText(representativeDetailsContent.fields.name.error.required)).toBeVisible();
    expect(page.getByText(representativeDetailsContent.fields.addressLine1.error.required)).toBeVisible();
    expect(page.getByText(representativeDetailsContent.fields.townCity.error.required)).toBeVisible();
    expect(page.getByText(representativeDetailsContent.fields.county.error.required)).toBeVisible();
    expect(page.getByText(representativeDetailsContent.fields.postCode.error.required)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click continue without entering a name or organisation, I see errors`, ({
                                                                                                                     page,
                                                                                                                   }) => {
    await page.click(commonContent.continue);
    expect(page.getByText(representativeDetailsContent.fields.name.error.required)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I enter a name and continue, I do not see errors`, ({ page }) => {
    await page.fill('input[name="name.first"]', 'Harry');
    await page.click(commonContent.continue);
    page.dontSee(representativeDetailsContent.fields.name.error.required);
  });

  test(`${language.toUpperCase()} - When I enter a name with special characters and continue, I do not see errors`, ({
                                                                                                                       page,
                                                                                                                     }) => {
    await page.fill('input[name="name.first"]', 'André-Ottö');
    await page.click(commonContent.continue);
    page.dontSee(representativeDetailsContent.fields.name.error.required);
  });

  test(`${language.toUpperCase()} - When I enter an organisation and continue, I do not see errors`, ({ page }) => {
    await page.fill('input[name="name.organisation"]', 'Hogwarts');
    await page.click(commonContent.continue);
    page.dontSee(representativeDetailsContent.fields.name.error.required);
  });
})