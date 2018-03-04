'use strict';

const fields = require('steps/hearing/arrangements/content.en.json').fields;
const paths = require('paths');
const Continue = 'Continue';

const languageInterpreterTextField = 'input[id="selection.interpreterLanguage.language"]';
const signLanguageTextField = 'input[id="selection.signLanguage.language"]';
const anythingElseTextField = 'textarea[name="selection.anythingElse.language"]';

Feature('Hearing arrangements');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.hearing.hearingArrangements)
});

After((I) => {
    I.endTheSession();
});

Scenario('I do not select any checkboxes and continue to see errors', (I) => {
    I.click(Continue);
    I.see(fields.selection.error.required);
    I.seeInCurrentUrl(paths.hearing.hearingArrangements);
});

Scenario('I select language interpreter and see the interpreter language type field', (I) => {
    I.dontSeeElement(languageInterpreterTextField);
    I.click(fields.selection.languageInterpreter.requested.label);
    I.seeElement(languageInterpreterTextField);
});

Scenario('I select sign language interpreter and see the sign language type field', (I) => {
    I.dontSeeElement(signLanguageTextField);
    I.click(fields.selection.signLanguage.requested.label);
    I.seeElement(signLanguageTextField);
});

Scenario('I select other and see the anything else field', (I) => {
    I.dontSeeElement(anythingElseTextField);
    I.click(fields.selection.anythingElse.requested.label);
    I.seeElement(anythingElseTextField);
});

Scenario('When I select language interpreter and don\'t enter any language I see errors', (I) => {
    I.click(fields.selection.languageInterpreter.requested.label);
    I.click(Continue);
    I.see(fields.selection.languageInterpreter.language.error.required);
});

Scenario('When I select language interpreter and enter a language that isn\'t on the list I see errors', (I) => {
    I.click(fields.selection.languageInterpreter.requested.label);
    I.fillField(languageInterpreterTextField, 'Invalid language');
    I.click(Continue);
    I.see(fields.selection.languageInterpreter.language.error.invalid);
});

Scenario('When I select sign language and don\'t enter any language I see errors', (I) => {
    I.click(fields.selection.signLanguage.requested.label);
    I.click(Continue);
    I.see(fields.selection.signLanguage.language.error.required);
});

Scenario('When I select sign language and enter a language that isn\'t on the list I see errors', (I) => {
    I.click(fields.selection.signLanguage.requested.label);
    I.fillField(signLanguageTextField, 'Invalid language');
    I.click(Continue);
    I.see(fields.selection.signLanguage.language.error.invalid);
});

Scenario('When I select anything else and don\'t enter any thing into the field I see errors', (I) => {
    I.click(fields.selection.anythingElse.requested.label);
    I.click(Continue);
    I.see(fields.selection.anythingElse.language.error.required);
});

Scenario('When I select anything else and enter illegal characters in the field I see errors', (I) => {
    I.click(fields.selection.anythingElse.requested.label);
    I.fillField(anythingElseTextField, '< $ >');
    I.click(Continue);
    I.see(fields.selection.anythingElse.language.error.invalid);
});
