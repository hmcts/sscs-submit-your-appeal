const language = 'en';
const commonContent = require('commonContent')[language];
const hearingArrangementsContent = require(`steps/hearing/arrangements/content.${language}`);
const paths = require('paths');

const languageInterpreterTextField = 'input[id="selection.interpreterLanguage.language"]';
const signLanguageTextField = 'input[id="selection.signLanguage.language"]';
const anythingElseTextField = 'textarea[name="selection.anythingElse.language"]';

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(`${language.toUpperCase()} - Hearing arrangements @batch-08`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.hearing.hearingArrangements);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - I do not select any checkboxes and continue to see errors`, async({ page }) => {
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(hearingArrangementsContent.fields.selection.error.required).first()).toBeVisible();
    await page.waitForURL(`**/${paths.hearing.hearingArrangements}`);
  });

  test(`${language.toUpperCase()} - I select language interpreter and see the interpreter language type field`, async({ page }) => {
    await expect(page.locator(languageInterpreterTextField).first()).not.toBeVisible();
    await page.getByText(hearingArrangementsContent.fields.selection.languageInterpreter.requested.label).first().click();
    await expect(page.locator(languageInterpreterTextField).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - I select sign language interpreter and see the sign language type field`, async({ page }) => {
    await expect(page.locator(signLanguageTextField).first()).not.toBeVisible();
    await page.getByText(hearingArrangementsContent.fields.selection.signLanguage.requested.label).first().click();
    await expect(page.locator(signLanguageTextField).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - I select other and see the anything else field`, async({ page }) => {
    await expect(page.locator(anythingElseTextField).first()).not.toBeVisible();
    await page.getByText(hearingArrangementsContent.fields.selection.anythingElse.requested.label).first().click();
    await expect(page.locator(anythingElseTextField).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - I select language interpreter and do not enter any language I see errors`, async({ page }) => {
    await page.getByText(hearingArrangementsContent.fields.selection.languageInterpreter.requested.label).first().click();
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(hearingArrangementsContent.fields.selection.languageInterpreter.language.error.required).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - I select a language interpreter, enter a non-existent list language, I see errors`, async({ page }) => {
    await page.getByText(hearingArrangementsContent.fields.selection.languageInterpreter.requested.label).first().click();
    await page.fill(languageInterpreterTextField, 'Invalid language');
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(hearingArrangementsContent.fields.selection.languageInterpreter.language.error.invalid).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - I select sign language and do not enter any language I see errors`, async({ page }) => {
    await page.getByText(hearingArrangementsContent.fields.selection.signLanguage.requested.label).first().click();
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(hearingArrangementsContent.fields.selection.signLanguage.language.error.required).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - Select sign language and enter a language that is not on the list I see errors`, async({ page }) => {
    await page.getByText(hearingArrangementsContent.fields.selection.signLanguage.requested.label).first().click();
    await page.fill(signLanguageTextField, 'Invalid language');
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(hearingArrangementsContent.fields.selection.signLanguage.language.error.invalid).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - I select anything else and don't enter any thing into the field I see errors`, async({ page }) => {
    await page.getByText(hearingArrangementsContent.fields.selection.anythingElse.requested.label).first().click();
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(hearingArrangementsContent.fields.selection.anythingElse.language.error.required).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - I select anything else and enter illegal characters in the field I see errors`, async({ page }) => {
    await page.getByText(hearingArrangementsContent.fields.selection.anythingElse.requested.label).first().click();
    await page.fill(anythingElseTextField, '< $ >');
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(hearingArrangementsContent.fields.selection.anythingElse.language.error.invalid).first()).toBeVisible();
  });
});
