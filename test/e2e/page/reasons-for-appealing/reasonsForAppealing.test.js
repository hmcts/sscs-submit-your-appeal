const content = require('commonContent');
const reasonsForAppealingContentEn = require('steps/reasons-for-appealing/reason-for-appealing/content.en');
const reasonsForAppealingContentCy = require('steps/reasons-for-appealing/reason-for-appealing/content.cy');
const paths = require('paths');
const reasons = require('test/e2e/data').reasonsForAppealing.reasons;

const languages = ['en', 'cy'];

Feature('Reason For Appealing @batch-10');

languages.forEach(language => {
  Before(async I => {
    I.createTheSession(language);
    I.amOnPage(paths.reasonsForAppealing.reasonForAppealing);
    await I.turnOffJsAndReloadThePage();
  });

  After(I => {
    I.endTheSession();
  });

  const commonContent = content[language];
  const reasonsForAppealingContent = language === 'en' ? reasonsForAppealingContentEn : reasonsForAppealingContentCy;

  Scenario(`${language.toUpperCase()} - When I do not add enough what you disagree with it, I see errors`, I => {
    I.click(reasonsForAppealingContent.links.add);
    I.fillField('textarea[name="item.reasonForAppealing"]', reasons[0].reasonForAppealing);
    I.fillField('input[name="item.whatYouDisagreeWith"]', reasons[3].whatYouDisagreeWith);
    I.click(commonContent.continue);
    I.see(reasonsForAppealingContent.fields.whatYouDisagreeWith.error.notEnough);
  });

  Scenario(`${language.toUpperCase()} - When I do not add enough reason for appealing, I see errors`, I => {
    I.click(reasonsForAppealingContent.links.add);
    I.fillField('textarea[name="item.reasonForAppealing"]', reasons[3].reasonForAppealing);
    I.fillField('input[name="item.whatYouDisagreeWith"]', reasons[0].whatYouDisagreeWith);
    I.click(commonContent.continue);
    I.see(reasonsForAppealingContent.fields.reasonForAppealing.error.notEnough);
  });

  Scenario(`${language.toUpperCase()} - When I use whitespace to pad out what you disagree with it, I see errors`, I => {
    I.click(reasonsForAppealingContent.links.add);
    I.fillField('textarea[name="item.reasonForAppealing"]', reasons[0].reasonForAppealing);
    I.fillField('input[name="item.whatYouDisagreeWith"]', reasons[4].whatYouDisagreeWith);
    I.click(commonContent.continue);
    I.see(reasonsForAppealingContent.fields.whatYouDisagreeWith.error.notEnough);
  });

  Scenario(`${language.toUpperCase()} - When I use whitespace to pad out reason for appealing, I see errors`, I => {
    I.click(reasonsForAppealingContent.links.add);
    I.fillField('textarea[name="item.reasonForAppealing"]', reasons[4].reasonForAppealing);
    I.fillField('input[name="item.whatYouDisagreeWith"]', reasons[0].whatYouDisagreeWith);
    I.click(commonContent.continue);
    I.see(reasonsForAppealingContent.fields.reasonForAppealing.error.notEnough);
  });

  Scenario(`${language.toUpperCase()} - I have a csrf token`, I => {
    I.seeElementInDOM('form input[name="_csrf"]');
  });
});
