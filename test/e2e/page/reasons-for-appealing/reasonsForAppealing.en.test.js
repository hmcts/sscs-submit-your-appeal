const language = 'en';
const commonContent = require('commonContent')[language];
const reasonsForAppealingContent = require(`steps/reasons-for-appealing/reason-for-appealing/content.${language}`);
const paths = require('paths');
const reasons = require('test/e2e/data.en').reasonsForAppealing.reasons;

Feature(`${language.toUpperCase()} - Reason For Appealing @batch-10`);

Before(async({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.reasonsForAppealing.reasonForAppealing);
  await I.turnOffJsAndReloadThePage();
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - When I do not add enough what you disagree with it, I see errors`, ({ I }) => {
  I.click(reasonsForAppealingContent.links.add);
  I.fillField('textarea[name="item.reasonForAppealing"]', reasons[0].reasonForAppealing);
  I.fillField('input[name="item.whatYouDisagreeWith"]', reasons[3].whatYouDisagreeWith);
  I.click(commonContent.continue);
  I.see(reasonsForAppealingContent.fields.whatYouDisagreeWith.error.notEnough);
});

Scenario(`${language.toUpperCase()} - When I do not add enough reason for appealing, I see errors`, ({ I }) => {
  I.click(reasonsForAppealingContent.links.add);
  I.fillField('textarea[name="item.reasonForAppealing"]', reasons[3].reasonForAppealing);
  I.fillField('input[name="item.whatYouDisagreeWith"]', reasons[0].whatYouDisagreeWith);
  I.click(commonContent.continue);
  I.see(reasonsForAppealingContent.fields.reasonForAppealing.error.notEnough);
});

Scenario(`${language.toUpperCase()} - When I use whitespace to pad out what you disagree with it, I see errors`, ({ I }) => {
  I.click(reasonsForAppealingContent.links.add);
  I.fillField('textarea[name="item.reasonForAppealing"]', reasons[0].reasonForAppealing);
  I.fillField('input[name="item.whatYouDisagreeWith"]', reasons[4].whatYouDisagreeWith);
  I.click(commonContent.continue);
  I.see(reasonsForAppealingContent.fields.whatYouDisagreeWith.error.notEnough);
});

Scenario(`${language.toUpperCase()} - When I use whitespace to pad out reason for appealing, I see errors`, ({ I }) => {
  I.click(reasonsForAppealingContent.links.add);
  I.fillField('textarea[name="item.reasonForAppealing"]', reasons[4].reasonForAppealing);
  I.fillField('input[name="item.whatYouDisagreeWith"]', reasons[0].whatYouDisagreeWith);
  I.click(commonContent.continue);
  I.see(reasonsForAppealingContent.fields.reasonForAppealing.error.notEnough);
});

Scenario(`${language.toUpperCase()} - I have a csrf token`, ({ I }) => {
  I.seeElementInDOM('form input[name="_csrf"]');
});
