const content = require('commonContent');
const theHearingContentEn = require('steps/hearing/the-hearing/content.en');
const theHearingContentCy = require('steps/hearing/the-hearing/content.cy');
const evidenceDescriptionContentEn = require('steps/reasons-for-appealing/evidence-description/content.en');
const evidenceDescriptionContentCy = require('steps/reasons-for-appealing/evidence-description/content.cy');
const paths = require('paths');

const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

const languages = ['en', 'cy'];

Feature('Evidence description page @evidence-upload @batch-10');

if (evidenceUploadEnabled) {
  languages.forEach(language => {
    Before(I => {
      I.createTheSession(language);
      I.amOnPage(paths.reasonsForAppealing.evidenceDescription);
    });

    After(I => {
      I.endTheSession();
    });

    const commonContent = content[language];
    const theHearingContent = language === 'en' ? theHearingContentEn : theHearingContentCy;
    const evidenceDescriptionContent = language === 'en' ? evidenceDescriptionContentEn : evidenceDescriptionContentCy;

    Scenario(`${language.toUpperCase()} - When I select continue, I am taken to the hearing page`, I => {
      I.click(commonContent.continue);
      I.seeInCurrentUrl(paths.hearing.theHearing);
      I.see(theHearingContent.title);
    });

    Scenario(`${language.toUpperCase()} - When I enter special characters and select continue, I see errors`, I => {
      I.enterDescription('Description with special characters |');
      I.seeInCurrentUrl(paths.reasonsForAppealing.evidenceDescription);
      I.see(evidenceDescriptionContent.title);
      I.see(evidenceDescriptionContent.fields.describeTheEvidence.error.invalid);
    });

    Scenario(`${language.toUpperCase()} - When I enter too sort description and select continue, I see errors`, I => {
      I.enterDescription('one');
      I.seeInCurrentUrl(paths.reasonsForAppealing.evidenceDescription);
      I.see(evidenceDescriptionContent.title);
      I.see(evidenceDescriptionContent.fields.describeTheEvidence.error.tooShort);
    });

    Scenario(`${language.toUpperCase()} - I have a csrf token`, I => {
      I.seeElementInDOM('form input[name="_csrf"]');
    });
  });
}
