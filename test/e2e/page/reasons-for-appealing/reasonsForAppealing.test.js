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

Scenario('I have a csrf token', I => {
  I.seeElementInDOM('form input[name="_csrf"]');
});
