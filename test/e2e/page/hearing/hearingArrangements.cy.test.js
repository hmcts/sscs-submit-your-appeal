const language = 'cy';
const commonContent = require('commonContent')[language];
const hearingArrangementsContent = require(`steps/hearing/arrangements/content.${language}`);
const paths = require('paths');

const languageInterpreterTextField = 'input[id="selection.interpreterLanguage.language"]';
const signLanguageTextField = 'input[id="selection.signLanguage.language"]';
const anythingElseTextField = 'textarea[name="selection.anythingElse.language"]';

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - Hearing arrangements @batch-08`, () => {
  Before(async ({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.hearing.hearingArrangements);
  });

  After(async ({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - I do not select any checkboxes and continue to see errors`, ({ page }) => {
    await page.click(commonContent.continue);
    expect(page.getByText(hearingArrangementsContent.fields.selection.error.required)).toBeVisible();
    page.seeInCurrentUrl(paths.hearing.hearingArrangements);
  });

  test(`${language.toUpperCase()} - I select language interpreter and see the interpreter language type field`, ({
    page,
  }) => {
    page.dontSeeElement(languageInterpreterTextField);
    await page.click(hearingArrangementsContent.fields.selection.languageInterpreter.requested.label);
    page.seeElement(languageInterpreterTextField);
  });

  test(`${language.toUpperCase()} - I select sign language interpreter and see the sign language type field`, ({
    page,
  }) => {
    page.dontSeeElement(signLanguageTextField);
    await page.click(hearingArrangementsContent.fields.selection.signLanguage.requested.label);
    page.seeElement(signLanguageTextField);
  });

  test(`${language.toUpperCase()} - I select other and see the anything else field`, ({ page }) => {
    page.dontSeeElement(anythingElseTextField);
    await page.click(hearingArrangementsContent.fields.selection.anythingElse.requested.label);
    page.seeElement(anythingElseTextField);
  });

  test(`${language.toUpperCase()} - I select language interpreter and do not enter any language I see errors`, ({
    page,
  }) => {
    await page.click(hearingArrangementsContent.fields.selection.languageInterpreter.requested.label);
    await page.click(commonContent.continue);
    expect(page.getByText(hearingArrangementsContent.fields.selection.languageInterpreter.language.error.required)).toBeVisible();
  });

  test(`${language.toUpperCase()} - I select a language interpreter, enter a non-existent list language, I see errors`, ({
    page,
  }) => {
    await page.click(hearingArrangementsContent.fields.selection.languageInterpreter.requested.label);
    await page.fill(languageInterpreterTextField, 'Invalid language');
    await page.click(commonContent.continue);
    expect(page.getByText(hearingArrangementsContent.fields.selection.languageInterpreter.language.error.invalid)).toBeVisible();
  });

  test(`${language.toUpperCase()} - I select sign language and do not enter any language I see errors`, ({ page }) => {
    await page.click(hearingArrangementsContent.fields.selection.signLanguage.requested.label);
    await page.click(commonContent.continue);
    expect(page.getByText(hearingArrangementsContent.fields.selection.signLanguage.language.error.required)).toBeVisible();
  });

  test(`${language.toUpperCase()} - Select sign language and enter a language that is not on the list I see errors`, ({
    page,
  }) => {
    await page.click(hearingArrangementsContent.fields.selection.signLanguage.requested.label);
    await page.fill(signLanguageTextField, 'Invalid language');
    await page.click(commonContent.continue);
    expect(page.getByText(hearingArrangementsContent.fields.selection.signLanguage.language.error.invalid)).toBeVisible();
  });

  test(`${language.toUpperCase()} - I select anything else and don't enter any thing into the field I see errors`, ({
    page,
  }) => {
    await page.click(hearingArrangementsContent.fields.selection.anythingElse.requested.label);
    await page.click(commonContent.continue);
    expect(page.getByText(hearingArrangementsContent.fields.selection.anythingElse.language.error.required)).toBeVisible();
  });

  test(`${language.toUpperCase()} - I select anything else and enter illegal characters in the field I see errors`, ({
    page,
  }) => {
    await page.click(hearingArrangementsContent.fields.selection.anythingElse.requested.label);
    await page.fill(anythingElseTextField, '< $ >');
    await page.click(commonContent.continue);
    expect(page.getByText(hearingArrangementsContent.fields.selection.anythingElse.language.error.invalid)).toBeVisible();
  });
});
