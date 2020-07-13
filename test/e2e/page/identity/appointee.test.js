const independenceContentEn = require('steps/start/independence/content.en');
const independenceContentCy = require('steps/start/independence/content.cy');
const appealFormDownloadContentEn = require('steps/appeal-form-download/content.en');
const appealFormDownloadContentCy = require('steps/appeal-form-download/content.cy');
const appointeeContentEn = require('steps/identity/appointee/content.en');
const appointeeContentCy = require('steps/identity/appointee/content.cy');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('Appointee form @batch-09');

languages.forEach(language => {
  const independenceContent = language === 'en' ? independenceContentEn : independenceContentCy;
  const appealFormDownloadContent = language === 'en' ? appealFormDownloadContentEn : appealFormDownloadContentCy;
  const appointeeContent = language === 'en' ? appointeeContentEn : appointeeContentCy;

  Before(I => {
    I.createTheSession();
    I.amOnPage(paths.identity.areYouAnAppointee);
  });

  After(I => {
    I.endTheSession();
  });

  Scenario(`${language.toUpperCase()} - When I select Yes, I am taken to the download appointee form page`, I => {
    I.selectAreYouAnAppointeeAndContinue(appointeeContent.fields.isAppointee.yes);
    I.seeInCurrentUrl(paths.appealFormDownload);
    I.see(appealFormDownloadContent.title);
  });

  Scenario(`${language.toUpperCase()} - When I select No, I am taken to the independence page`, I => {
    I.selectAreYouAnAppointeeAndContinue(appointeeContent.fields.isAppointee.no);
    I.seeInCurrentUrl(paths.start.independence);
    I.see(independenceContent.title);
  });
});
