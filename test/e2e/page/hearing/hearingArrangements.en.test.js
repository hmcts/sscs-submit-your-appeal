const language = 'en';
const commonContent = require('commonContent')[language];
const hearingArrangementsContent = require(`steps/hearing/arrangements/content.${language}`);
const paths = require('paths');

const languageInterpreterTextField = 'input[id="selection.interpreterLanguage.language"]';
const signLanguageTextField = 'input[id="selection.signLanguage.language"]';
const anythingElseTextField = 'textarea[name="selection.anythingElse.language"]';

const { test, expect } = require('@playwright/test');
const { endTheSession } = require('../../page-objects/session/endSession');
const { createTheSession } = require('../../page-objects/session/createSession');

test.describe(`${language.toUpperCase()} - Hearing arrangements`, { tag: '@batch-08' }, () => {
  test.beforeEach('Create session', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.hearing.hearingArrangements);
  });

  test.afterEach('End session', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - page do not select any checkboxes and continue to see errors`, async({ page }) => {
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(hearingArrangementsContent.fields.selection.error.required).first()).toBeVisible();
    await page.waitForURL(`**${paths.hearing.hearingArrangements}`);
  });

  test(`${language.toUpperCase()} - page select language interpreter and see the interpreter language type field`, async({ page }) => {
    await expect(page.locator(languageInterpreterTextField)).toBeHidden();
    await page.getByText(hearingArrangementsContent.fields.selection.languageInterpreter.requested.label).first().click();
    await expect(page.locator(languageInterpreterTextField).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - page select sign language interpreter and see the sign language type field`, async({ page }) => {
    await expect(page.locator(signLanguageTextField)).toBeHidden();
    await page.getByText(hearingArrangementsContent.fields.selection.signLanguage.requested.label).first().click();
    await expect(page.locator(signLanguageTextField).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - page select other and see the anything else field`, async({ page }) => {
    await expect(page.locator(anythingElseTextField)).toBeHidden();
    await page.getByText(hearingArrangementsContent.fields.selection.anythingElse.requested.label).first().click();
    await expect(page.locator(anythingElseTextField).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - page select language interpreter and do not enter any language page see errors`, async({ page }) => {
    await page.getByText(hearingArrangementsContent.fields.selection.languageInterpreter.requested.label).first().click();
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(hearingArrangementsContent.fields.selection.languageInterpreter.language.error.required).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - page select a language interpreter, enter a non-existent list language, page see errors`, async({ page }) => {
    await page.getByText(hearingArrangementsContent.fields.selection.languageInterpreter.requested.label).first().click();
    await page.locator(languageInterpreterTextField).first().fill('Invalid language');
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(hearingArrangementsContent.fields.selection.languageInterpreter.language.error.invalid).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - page select sign language and do not enter any language page see errors`, async({ page }) => {
    await page.getByText(hearingArrangementsContent.fields.selection.signLanguage.requested.label).first().click();
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(hearingArrangementsContent.fields.selection.signLanguage.language.error.required).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - Select sign language and enter a language that is not on the list page see errors`, async({ page }) => {
    await page.getByText(hearingArrangementsContent.fields.selection.signLanguage.requested.label).first().click();
    await page.locator(signLanguageTextField).first().fill('Invalid language');
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(hearingArrangementsContent.fields.selection.signLanguage.language.error.invalid).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - page select anything else and don't enter any thing into the field page see errors`, async({ page }) => {
    await page.getByText(hearingArrangementsContent.fields.selection.anythingElse.requested.label).first().click();
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(hearingArrangementsContent.fields.selection.anythingElse.language.error.required).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - page select anything else and enter illegal characters in the field page see errors`, async({ page }) => {
    await page.getByText(hearingArrangementsContent.fields.selection.anythingElse.requested.label).first().click();
    await page.locator(anythingElseTextField).first().fill('< $ >');
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(hearingArrangementsContent.fields.selection.anythingElse.language.error.invalid).first()).toBeVisible();
  });
});
