'use strict';

const fields = require('steps/hearing/arrangements/content.en.json').fields;
const paths = require('paths');
const Continue = 'Continue';

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

Scenario('I enter illegal characters < $ > to see errors', (I) => {
    I.click(fields.selection.other);
    I.fillField('#anythingElse', '< $ >');
    I.click(Continue);
    I.seeInCurrentUrl(paths.hearing.hearingArrangements);
    I.see(fields.anythingElse.error.required);
});

Scenario('I select all checkboxes and continue', (I) => {
    I.checkOption(fields.selection.languageInterpreter);
    I.checkOption(fields.selection.signLanguageInterpreter);
    I.checkOption(fields.selection.hearingLoop);
    I.checkOption(fields.selection.accessibleHearingRoom);
    I.click(Continue);
    I.seeInCurrentUrl(paths.hearing.hearingAvailability);
});

Scenario('I select language interpreter and see the interpreter language type field', (I) => {
    I.dontSeeElement('#interpreterLanguageType');
    I.click(fields.selection.languageInterpreter);
    I.seeElement('#interpreterLanguageType');
});

Scenario('I select sign language interpreter and see the sign language type field', (I) => {
    I.dontSeeElement('#signLanguageType');
    I.click(fields.selection.signLanguageInterpreter);
    I.seeElement('#signLanguageType');
});

Scenario('I select other and see the anything else field', (I) => {
    I.dontSeeElement('#anythingElse');
    I.click(fields.selection.other);
    I.seeElement('#anythingElse');
});

Scenario('When I select language interpreter and enter illegal characters into language type field I see errors', (I) => {
    I.click(fields.selection.languageInterpreter);
    I.fillField('#interpreterLanguageType', '< $ >');
    I.click(Continue);
    I.see(fields.interpreterLanguageType.error.invalid);
});

Scenario('When I select sign language interpreter and enter illegal characters into the language type field I see errors', (I) => {
    I.click(fields.selection.signLanguageInterpreter);
    I.fillField('#signLanguageType', '< $ >');
    I.click(Continue);
    I.see(fields.signLanguageType.error.invalid);
});

Scenario('When I select other and enter illegal characters into the anything else field I see errors', (I) => {
    I.click(fields.selection.other);
    I.fillField('#anythingElse', '< $ >');
    I.click(Continue);
    I.see(fields.anythingElse.error.required);
});
