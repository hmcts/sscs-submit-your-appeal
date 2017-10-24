'use strict';

const fields = require('steps/hearing/hearing-arrangements/content.en.json').fields;
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
    I.fillField('#HearingArrangements_anythingElse', '< $ >');
    I.click(Continue);
    I.seeInCurrentUrl(paths.hearing.hearingArrangements);
    I.see(fields.anythingElse.error.required);
});

Scenario('I select all checkboxes and continue', (I) => {
    I.checkOption(fields.selection.languageInterpreter);
    I.checkOption(fields.selection.signLanguageInterpreter);
    I.checkOption(fields.selection.hearingLoop);
    I.checkOption(fields.selection.disabledAccess);
    I.click(Continue);
    I.seeInCurrentUrl(paths.hearing.hearingAvailability);
});
