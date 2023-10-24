const language = 'cy';
const commonContent = require('commonContent')[language];
const hearingArrangementsContent = require(`steps/hearing/arrangements/content.${language}`);
const paths = require('paths');

const languageInterpreterTextField = 'input[id="selection.interpreterLanguage.language"]';
const signLanguageTextField = 'input[id="selection.signLanguage.language"]';
const anythingElseTextField = 'textarea[name="selection.anythingElse.language"]';

Feature(`${language.toUpperCase()} - Hearing arrangements @batch-08`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.hearing.hearingArrangements);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - I do not select any checkboxes and continue to see errors`, ({ I }) => {
  I.click(commonContent.continue);
  I.see(hearingArrangementsContent.fields.selection.error.required);
  I.seeInCurrentUrl(paths.hearing.hearingArrangements);
});

Scenario(`${language.toUpperCase()} - I select language interpreter and see the interpreter language type field`, ({ I }) => {
  I.dontSeeElement(languageInterpreterTextField);
  I.click(hearingArrangementsContent.fields.selection.languageInterpreter.requested.label);
  I.seeElement(languageInterpreterTextField);
});

Scenario(`${language.toUpperCase()} - I select sign language interpreter and see the sign language type field`, ({ I }) => {
  I.dontSeeElement(signLanguageTextField);
  I.click(hearingArrangementsContent.fields.selection.signLanguage.requested.label);
  I.seeElement(signLanguageTextField);
});

Scenario(`${language.toUpperCase()} - I select other and see the anything else field`, ({ I }) => {
  I.dontSeeElement(anythingElseTextField);
  I.click(hearingArrangementsContent.fields.selection.anythingElse.requested.label);
  I.seeElement(anythingElseTextField);
});

Scenario(`${language.toUpperCase()} - I select language interpreter and do not enter any language I see errors`, ({ I }) => {
  I.click(hearingArrangementsContent.fields.selection.languageInterpreter.requested.label);
  I.click(commonContent.continue);
  I.see(hearingArrangementsContent.fields.selection.languageInterpreter.language.error.required);
});

Scenario(`${language.toUpperCase()} - I select a language interpreter, enter a non-existent list language, I see errors`, ({ I }) => {
  I.click(hearingArrangementsContent.fields.selection.languageInterpreter.requested.label);
  I.fillField(languageInterpreterTextField, 'Invalid language');
  I.click(commonContent.continue);
  I.see(hearingArrangementsContent.fields.selection.languageInterpreter.language.error.invalid);
});

Scenario(`${language.toUpperCase()} - I select sign language and do not enter any language I see errors`, ({ I }) => {
  I.click(hearingArrangementsContent.fields.selection.signLanguage.requested.label);
  I.click(commonContent.continue);
  I.see(hearingArrangementsContent.fields.selection.signLanguage.language.error.required);
});

Scenario(`${language.toUpperCase()} - Select sign language and enter a language that is not on the list I see errors`, ({ I }) => {
  I.click(hearingArrangementsContent.fields.selection.signLanguage.requested.label);
  I.fillField(signLanguageTextField, 'Invalid language');
  I.click(commonContent.continue);
  I.see(hearingArrangementsContent.fields.selection.signLanguage.language.error.invalid);
});

Scenario(`${language.toUpperCase()} - I select anything else and don't enter any thing into the field I see errors`, ({ I }) => {
  I.click(hearingArrangementsContent.fields.selection.anythingElse.requested.label);
  I.click(commonContent.continue);
  I.see(hearingArrangementsContent.fields.selection.anythingElse.language.error.required);
});

Scenario(`${language.toUpperCase()} - I select anything else and enter illegal characters in the field I see errors`, ({ I }) => {
  I.click(hearingArrangementsContent.fields.selection.anythingElse.requested.label);
  I.fillField(anythingElseTextField, '< $ >');
  I.click(commonContent.continue);
  I.see(hearingArrangementsContent.fields.selection.anythingElse.language.error.invalid);
});
