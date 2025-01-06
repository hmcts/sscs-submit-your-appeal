const language = 'cy';
const independenceContent = require(`steps/start/independence/content.${language}`);
const appealFormDownloadContent = require(`steps/appeal-form-download/content.${language}`);
const appointeeContent = require(`steps/identity/appointee/content.${language}`);
const paths = require('paths');

Feature(`${language.toUpperCase()} - Appointee form @batch-09`);

Before(({ I }) => {
  I.createTheSession(language);
  I.amOnPage(paths.identity.areYouAnAppointee);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - When I select Yes, I am taken to the download appointee form page`, ({ I }) => {
  I.selectAreYouAnAppointeeAndContinue(language, appointeeContent.fields.isAppointee.yes);
  I.seeInCurrentUrl(paths.appealFormDownload);
  I.see(appealFormDownloadContent.title);
});

Scenario(`${language.toUpperCase()} - When I select No, I am taken to the independence page`, ({ I }) => {
  I.selectAreYouAnAppointeeAndContinue(language, appointeeContent.fields.isAppointee.no);
  I.seeInCurrentUrl(paths.start.independence);
  I.see(independenceContent.title);
});
