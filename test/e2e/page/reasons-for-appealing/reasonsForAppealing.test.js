'use strict';

const paths = require('paths');
const content = require('steps/reasons-for-appealing/reason-for-appealing/content.en');
const reasons = require('test/e2e/data').reasonsForAppealing.reasons;

Feature('Reason For Appealing');

Before((I) => {
    I.createTheSession();
    I.amOnPage(paths.reasonsForAppealing.reasonForAppealing);
});
After((I) => {
    I.endTheSession();

});

Scenario('When I go to the page and there are no reasons I see the Add reason link', (I) => {

    I.see(content.noReasons);
    I.see(content.links.add);

});

Scenario('When I click the Add reason link, I go to the page where I can enter my reason for appeal', (I) => {

    I.see(content.noReasons);
    I.click(content.links.add);
    I.see(content.titleEdit);
    I.seeElement('input[name="item.whatYouDisagreeWith"]');
    I.seeElement('textarea[name="item.reasonForAppealing"]');

});

Scenario('When I add a reason I see the reason in the list', (I) => {

    I.enterReasonForAppealAndContinue(reasons[0], content.links.add);
    I.see(reasons[0].whatYouDisagreeWith);

});

Scenario('When I add a reason I see the add another reason link', (I) => {

    I.enterReasonForAppealAndContinue(reasons[0], content.links.add);
    I.see(content.links.addAnother);

});

Scenario('When I add multiple reasons, I see them in the list', (I) => {

    I.enterReasonForAppealAndContinue(reasons[0], content.links.add);
    I.enterReasonForAppealAndContinue(reasons[1], content.links.addAnother);
    I.see(reasons[0].whatYouDisagreeWith);
    I.see(reasons[1].whatYouDisagreeWith);

});

Scenario('When I add a reason and click the delete link, the reason is removed', (I) => {

    I.enterReasonForAppealAndContinue(reasons[0], content.links.add);
    I.see(reasons[0].whatYouDisagreeWith);
    I.click('Delete');
    I.dontSee(reasons[0].whatYouDisagreeWith);

});

Scenario('When I add a reason and the remove it, the add another reason link goes back to add reason when only one reason in the list', (I) => {

    I.enterReasonForAppealAndContinue(reasons[0], content.links.add);
    I.see(content.links.addAnother);
    I.click('Delete');
    I.dontSee(content.links.addAnother);
    I.see(content.links.add);

});

Scenario('When I click Continue without adding a reason, I see errors', (I) => {

    I.click('Continue');
    I.see(content.noReasons);

});

Scenario('When I add a reason and the edit it, I see the new reason', (I) => {

    I.enterReasonForAppealAndContinue(reasons[0], content.links.add);
    I.see(reasons[0].whatYouDisagreeWith);
    I.enterReasonForAppealAndContinue(reasons[1], 'Edit');
    I.dontSee(reasons[0].whatYouDisagreeWith);
    I.see(reasons[1].whatYouDisagreeWith);

});

Scenario('When I click Continue without filling in the reason fields, I see errors', (I) => {

    I.click(content.links.add);
    I.click('Continue');
    I.see(content.fields.whatYouDisagreeWith.error.required);
    I.see(content.fields.reasonForAppealing.error.required);

});

Scenario('When I click Continue when only entering the what you disagree with field, I see errors', (I) => {

    I.click(content.links.add);
    I.fillField('input[name="item.whatYouDisagreeWith"]',  reasons[0].whatYouDisagreeWith);
    I.click('Continue');
    I.see(content.fields.reasonForAppealing.error.required);

});

Scenario('When I click Continue when only entering the why you disagree with field, I see errors', (I) => {

    I.click(content.links.add);
    I.fillField('textarea[name="item.reasonForAppealing"]',  reasons[0].reasonForAppealing);
    I.click('Continue');
    I.see(content.fields.whatYouDisagreeWith.error.required);

});
