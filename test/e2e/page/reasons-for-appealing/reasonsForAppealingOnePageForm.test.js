const paths = require('paths');
const content = require('steps/reasons-for-appealing/reason-for-appealing/content.en');
const reasons = require('test/e2e/data').reasonsForAppealing.reasons;

const whatYouDisagreeWithField = '#item\\.whatYouDisagreeWith';
const reasonForAppealingField = '#item\\.reasonForAppealing';

Feature('Reason For Appealing');

Before(I => {
  I.createTheSession();
  I.amOnPage(paths.reasonsForAppealing.reasonForAppealing);
  I.waitForElement('#items-0');
});
After(I => {
  I.endTheSession();
});

Scenario('When I go to the page I see two input fields', I => {
  I.seeElement(`#items-0 ${whatYouDisagreeWithField}`);
  I.seeElement(`#items-0 ${reasonForAppealingField}`);
});

Scenario('When I click Continue without adding a reason, I see errors', I => {
  I.click('Continue');
  I.see(content.fields.whatYouDisagreeWith.error.required);
  I.see(content.fields.reasonForAppealing.error.required);
});

Scenario('When I click add Another I see new fields', I => {
  I.click('Add reason');
  I.seeElement(`#items-1 ${whatYouDisagreeWithField}`);
  I.seeElement(`#items-1 ${reasonForAppealingField}`);
});

Scenario('When I enter one character in each field and click Continue, I see errors', I => {
  I.addAReasonForAppealing(whatYouDisagreeWithField, reasonForAppealingField, {
    whatYouDisagreeWith: 'a',
    reasonForAppealing: 'a'
  });
  I.click('Continue');
  I.see(content.fields.whatYouDisagreeWith.error.notEnough);
  I.see(content.fields.reasonForAppealing.error.notEnough);
});

Scenario('When omitting what you disagree with it and continuing I see errors', I => {
  I.fillField(reasonForAppealingField, reasons[0].reasonForAppealing);
  I.click('Continue');
  I.see(content.fields.whatYouDisagreeWith.error.required);
});

Scenario('When omitting why you disagree with it and continuing I see errors', I => {
  I.fillField(whatYouDisagreeWithField, reasons[0].whatYouDisagreeWith);
  I.click('Continue');
  I.see(content.fields.reasonForAppealing.error.required);
});

Scenario('When I add multiple reasons and click Continue I am taken to /other-reason-for-appealing',
  I => {
    I.addAReasonForAppealingAndThenClickAddAnother(
      `#items-0 ${whatYouDisagreeWithField}`,
      `#items-0 ${reasonForAppealingField}`,
      reasons[0]
    );
    I.addAReasonForAppealingAndThenClickAddAnother(
      `#items-1 ${whatYouDisagreeWithField}`,
      `#items-1 ${reasonForAppealingField}`,
      reasons[1]
    );
    I.addAReasonForAppealing(
      `#items-2 ${whatYouDisagreeWithField}`,
      `#items-2 ${reasonForAppealingField}`,
      reasons[2]
    );
    I.click('Continue');
    I.seeInCurrentUrl(paths.reasonsForAppealing.otherReasonForAppealing);
});

Scenario(`When I go to add another reason and then click Continue without entering any data, 
I see an error around that field`, async I => {
  I.addAReasonForAppealing(
    `#items-0 ${whatYouDisagreeWithField}`,
    `#items-0 ${reasonForAppealingField}`,
    reasons[0]
  );
  I.click('Add reason');
  I.click('Continue');
  await I.hasErrorClass('#items-1');
});


Scenario(`When I click add Reason multiple times and click Continue without entering any data,
 I see a list of errors`, async I => {
  const numberOfReasons = 5;
  for (let i = 1; i < numberOfReasons; i++) {
    I.click('Add reason');
  }
  I.click('Continue');
  I.seeElement('.error-summary-list');
  await I.seeNumberOfElements('.error-summary-list li', numberOfReasons * 2);
});

// WRITE TEST TO CHANGE ANSWERS
// MORE CYA VALIDATION

// SOMEONE HAS CHANGED THE JOURNEY
