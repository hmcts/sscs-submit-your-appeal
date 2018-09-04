const paths = require('paths');
const content = require('steps/reasons-for-appealing/reason-for-appealing/content.en');
const reasons = require('test/e2e/data').reasonsForAppealing.reasons;

Feature('Reason For Appealing @batch-10');

Before(async I => {
  I.createTheSession();
  I.amOnPage(paths.reasonsForAppealing.reasonForAppealing);
  await I.turnOffJsAndReloadThePage();
});
After(I => {
  I.endTheSession();
});

xScenario('When I go to the page and there are no reasons I see the Add reason link', I => {
  I.see(content.noReasons);
  I.see(content.links.add);
});

xScenario('When I click the Add reason link I am taken to /reason-for-appealing/item-0', I => {
  I.see(content.noReasons);
  I.click(content.links.add);
  I.see(content.titleEdit);
  I.seeElement('input[name="item.whatYouDisagreeWith"]');
  I.seeElement('textarea[name="item.reasonForAppealing"]');
});

xScenario('When I add a reason I see the reason in the list', I => {
  I.enterReasonForAppealAndContinue(reasons[0], content.links.add);
  I.see(reasons[0].whatYouDisagreeWith);
});

xScenario('When I add a reason I see the add another reason link', I => {
  I.enterReasonForAppealAndContinue(reasons[0], content.links.add);
  I.see(content.links.addAnother);
});

xScenario('When I add multiple reasons, I see them in the list', I => {
  I.enterReasonForAppealAndContinue(reasons[0], content.links.add);
  I.enterReasonForAppealAndContinue(reasons[1], content.links.addAnother);
  I.see(reasons[0].whatYouDisagreeWith);
  I.see(reasons[1].whatYouDisagreeWith);
});

xScenario('When I add a reason and click the delete link, the reason is removed', I => {
  I.enterReasonForAppealAndContinue(reasons[0], content.links.add);
  I.see(reasons[0].whatYouDisagreeWith);
  I.click('Delete');
  I.dontSee(reasons[0].whatYouDisagreeWith);
});

xScenario('When adding a single reason, then remove it, I see Add reason', I => {
  I.enterReasonForAppealAndContinue(reasons[0], content.links.add);
  I.see(content.links.addAnother);
  I.click('Delete');
  I.dontSee(content.links.addAnother);
  I.see(content.links.add);
});

xScenario('When I click Continue without adding a reason, I see errors', I => {
  I.click('Continue');
  I.see(content.listError);
});

xScenario('When I add a reason and the edit it, I see the new reason', I => {
  I.enterReasonForAppealAndContinue(reasons[0], content.links.add);
  I.see(reasons[0].whatYouDisagreeWith);
  I.enterReasonForAppealAndContinue(reasons[1], 'Edit');
  I.dontSee(reasons[0].whatYouDisagreeWith);
  I.see(reasons[1].whatYouDisagreeWith);
});

Scenario('When I do not add enough what you disagree with it, I see errors', I => {
  I.click(content.links.add);
  I.fillField('textarea[name="item.reasonForAppealing"]', reasons[0].reasonForAppealing);
  I.fillField('input[name="item.whatYouDisagreeWith"]', reasons[3].whatYouDisagreeWith);
  I.click('Continue');
  I.see(content.fields.whatYouDisagreeWith.error.notEnough);
});

Scenario('When I do not add enough reason for appealing, I see errors', I => {
  I.click(content.links.add);
  I.fillField('textarea[name="item.reasonForAppealing"]', reasons[3].reasonForAppealing);
  I.fillField('input[name="item.whatYouDisagreeWith"]', reasons[0].whatYouDisagreeWith);
  I.click('Continue');
  I.see(content.fields.reasonForAppealing.error.notEnough);
});

Scenario('When I use whitespace to pad out what you disagree with it, I see errors', I => {
  I.click(content.links.add);
  I.fillField('textarea[name="item.reasonForAppealing"]', reasons[0].reasonForAppealing);
  I.fillField('input[name="item.whatYouDisagreeWith"]', reasons[4].whatYouDisagreeWith);
  I.click('Continue');
  I.see(content.fields.whatYouDisagreeWith.error.notEnough);
});

Scenario('When I use whitespace to pad out reason for appealing, I see errors', I => {
  I.click(content.links.add);
  I.fillField('textarea[name="item.reasonForAppealing"]', reasons[4].reasonForAppealing);
  I.fillField('input[name="item.whatYouDisagreeWith"]', reasons[0].whatYouDisagreeWith);
  I.click('Continue');
  I.see(content.fields.reasonForAppealing.error.notEnough);
});