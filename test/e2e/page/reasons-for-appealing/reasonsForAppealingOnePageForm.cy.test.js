const language = 'cy';
const commonContent = require('commonContent')[language];
const reasonForAppealingContent = require(`steps/reasons-for-appealing/reason-for-appealing/content.${language}`);
const paths = require('paths');
const reasons = require('test/e2e/data.en').reasonsForAppealing.reasons;

const whatYouDisagreeWithField = '#item\\.whatYouDisagreeWith';
const reasonForAppealingField = '#item\\.reasonForAppealing';

Feature(`${language.toUpperCase()} - Reason For Appealing One Page Form @batch-10`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.reasonsForAppealing.reasonForAppealing);
  I.waitForElement('#items-0');
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - When I go to the page I see two input fields`, ({ I }) => {
  I.seeElement(`#items-0 ${whatYouDisagreeWithField}-0`);
  I.seeElement(`#items-0 ${reasonForAppealingField}-0`);
});

Scenario(`${language.toUpperCase()} - When I click Continue without adding a reason, I see errors`, ({ I }) => {
  I.click(commonContent.continue);
  I.see(reasonForAppealingContent.listError);
});

Scenario(`${language.toUpperCase()} - When I click add Another I see new fields`, ({ I }) => {
  I.click('Add reason');
  I.seeElement(`#items-1 ${whatYouDisagreeWithField}-1`);
  I.seeElement(`#items-1 ${reasonForAppealingField}-1`);
});

Scenario(`${language.toUpperCase()} - When I enter one character in each field and click Continue, I see errors`, ({ I }) => {
  I.addAReasonForAppealing(language, `${whatYouDisagreeWithField}-0`, `${reasonForAppealingField}-0`, {
    whatYouDisagreeWith: 'a',
    reasonForAppealing: 'a'
  });
  I.click(commonContent.continue);
  I.see(reasonForAppealingContent.fields.whatYouDisagreeWith.error.notEnough);
  I.see(reasonForAppealingContent.fields.reasonForAppealing.error.notEnough);
});

Scenario(`${language.toUpperCase()} - When I enter special chars then I see no errors`, ({ I }) => {
  I.addAReasonForAppealing(language, `${whatYouDisagreeWithField}-0`, `${reasonForAppealingField}-0`, {
    whatYouDisagreeWith: 'aaaa&$%^&%!~$^&&&*',
    reasonForAppealing: 'aaaa&$%^&%!~$^&&&*'
  });
  I.click(commonContent.continue);
  I.seeInCurrentUrl(paths.reasonsForAppealing.otherReasonForAppealing);
});

Scenario(`${language.toUpperCase()} - When I add multiple reasons and click Continue I am taken to /other-reason-for-appealing`, ({ I }) => {
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
    language,
    `#items-2 ${whatYouDisagreeWithField}-2`,
    `#items-2 ${reasonForAppealingField}-2`,
    reasons[2]
  );
  I.click(commonContent.continue);
  I.seeInCurrentUrl(paths.reasonsForAppealing.otherReasonForAppealing);
});

Scenario(`${language.toUpperCase()} - When I go to add another reason and then click Continue without entering any data, I see no errors and am taken to /other-reason-for-appealing`, ({ I }) => {
  I.addAReasonForAppealing(
    language,
    `#items-0 ${whatYouDisagreeWithField}-0`,
    `#items-0 ${reasonForAppealingField}-0`,
    reasons[0]
  );
  I.click('Add reason');
  I.click(commonContent.continue);
  I.seeInCurrentUrl(paths.reasonsForAppealing.otherReasonForAppealing);
});

Scenario(`${language.toUpperCase()} - When I click add Reason multiple times and click Continue without entering any data, I see an error in the error summary`, async({ I }) => {
  for (let i = 1; i < 5; i++) {
    I.click('Add reason');
  }
  I.click(commonContent.continue);
  I.seeElement('.govuk-error-summary__list');
  await I.seeNumberOfElements('.govuk-error-summary__list li', 1);
  I.see(reasonForAppealingContent.listError);
});

Scenario(`${language.toUpperCase()} - When I add a reasons then click the add another reason button and enter the least amount of data, I see error`, async({ I }) => {
  I.addAReasonForAppealing(
    language,
    `#items-0 ${whatYouDisagreeWithField}-0`,
    `#items-0 ${reasonForAppealingField}-0`,
    reasons[0]
  );
  I.click('Add reason');
  I.addAReasonForAppealing(
    language,
    `#items-1 ${whatYouDisagreeWithField}-1`,
    `#items-1 ${reasonForAppealingField}-1`,
    {
      whatYouDisagreeWith: 'a',
      reasonForAppealing: 'a'
    }
  );
  I.click(commonContent.continue);
  await I.hasErrorClass('#items-1');
  I.see(reasonForAppealingContent.fields.whatYouDisagreeWith.error.notEnough);
  I.see(reasonForAppealingContent.fields.reasonForAppealing.error.notEnough);
});
