const paths = require('paths');
const content = require('steps/reasons-for-appealing/reason-for-appealing/content.en');
const reasons = require('test/e2e/data').reasonsForAppealing.reasons;

const whatYouDisagreeWithField = '#item\\.whatYouDisagreeWith';
const reasonForAppealingField = '#item\\.reasonForAppealing';

Feature('Reason For Appealing One Page Form @batch-10');

Before(I => {
  I.createTheSession();
  I.amOnPage(paths.reasonsForAppealing.reasonForAppealing);
  I.waitForElement('#items-0');
});
After(I => {
  I.endTheSession();
});

Scenario('When I go to the page I see two input fields', I => {
  I.seeElement(`#items-0 ${whatYouDisagreeWithField}-0`);
  I.seeElement(`#items-0 ${reasonForAppealingField}-0`);
});

Scenario('When I click Continue without adding a reason, I see errors', I => {
  I.click('Continue');
  I.see(content.listError);
});

Scenario('When I click add Another I see new fields', I => {
  I.click('Add reason');
  I.seeElement(`#items-1 ${whatYouDisagreeWithField}-1`);
  I.seeElement(`#items-1 ${reasonForAppealingField}-1`);
});

Scenario('When I enter one character in each field and click Continue, I see errors', I => {
  I.addAReasonForAppealing(`${whatYouDisagreeWithField}-0`, `${reasonForAppealingField}-0`, {
    whatYouDisagreeWith: 'a',
    reasonForAppealing: 'a'
  });
  I.click('Continue');
  I.see(content.fields.whatYouDisagreeWith.error.notEnough);
  I.see(content.fields.reasonForAppealing.error.notEnough);
});

Scenario('When I enter special chars then I see no errors', I => {
  I.addAReasonForAppealing(`${whatYouDisagreeWithField}-0`, `${reasonForAppealingField}-0`, {
    whatYouDisagreeWith: 'aaaa&$%^&%!~$^&&&*',
    reasonForAppealing: 'aaaa&$%^&%!~$^&&&*'
  });
  I.click('Continue');
  I.seeInCurrentUrl(paths.reasonsForAppealing.otherReasonForAppealing);
});

Scenario('When I add multiple reasons and click Continue I am taken to /other-reason-for-appealing',
  I => {
    I.addAReasonForAppealingAndThenClickAddAnother(
      `#items-0 ${whatYouDisagreeWithField}-0`,
      `#items-0 ${reasonForAppealingField}-0`,
      reasons[0]
    );
    I.addAReasonForAppealingAndThenClickAddAnother(
      `#items-1 ${whatYouDisagreeWithField}-1`,
      `#items-1 ${reasonForAppealingField}-1`,
      reasons[1]
    );
    I.addAReasonForAppealing(
      `#items-2 ${whatYouDisagreeWithField}-2`,
      `#items-2 ${reasonForAppealingField}-2`,
      reasons[2]
    );
    I.click('Continue');
    I.seeInCurrentUrl(paths.reasonsForAppealing.otherReasonForAppealing);
  });

Scenario(`When I go to add another reason and then click Continue without entering any data, 
I see no errors and am taken to /other-reason-for-appealing`, I => {
  I.addAReasonForAppealing(
    `#items-0 ${whatYouDisagreeWithField}-0`,
    `#items-0 ${reasonForAppealingField}-0`,
    reasons[0]
  );
  I.click('Add reason');
  I.click('Continue');
  I.seeInCurrentUrl(paths.reasonsForAppealing.otherReasonForAppealing);
});


Scenario(`When I click add Reason multiple times and click Continue without entering any data, 
I see an error in the error summary`, async I => {
  for (let i = 1; i < 5; i++) {
    I.click('Add reason');
  }
  I.click('Continue');
  I.seeElement('.error-summary-list');
  await I.seeNumberOfElements('.error-summary-list li', 1);
  I.see(content.listError);
});

// this test is not passing.
// Ticket was raised to fix it https://tools.hmcts.net/jira/browse/SSCS-3929
xScenario(`When I add a reasons then click the add another reason button and enter the least amount 
of data, I see error`, async I => {
  I.addAReasonForAppealing(
    `#items-0 ${whatYouDisagreeWithField}-0`,
    `#items-0 ${reasonForAppealingField}-0`,
    reasons[0]
  );
  I.click('Add reason');
  I.addAReasonForAppealing(
    `#items-1 ${whatYouDisagreeWithField}-1`,
    `#items-1 ${reasonForAppealingField}-1`,
    {
      whatYouDisagreeWith: 'a',
      reasonForAppealing: 'a'
    }
  );
  I.click('Continue');
  await I.hasErrorClass('#items-1');
  I.see(content.fields.whatYouDisagreeWith.error.notEnough);
  I.see(content.fields.reasonForAppealing.error.notEnough);
});
