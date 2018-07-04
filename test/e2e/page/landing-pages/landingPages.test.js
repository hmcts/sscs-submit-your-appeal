const paths = require('paths');
const overviewContent = require('landing-pages/overview/content.en.json');
const beforeYouAppealContent = require('landing-pages/before-you-appeal/content.en.json');
const helpWithAppealContent = require('landing-pages/help-with-appeal/content.en.json');
const afterYouAppealContent = require('landing-pages/after-you-appeal/content.en.json');
const startAnAppealContent = require('landing-pages/start-an-appeal/content.en.json');

Feature('Landing Pages @batch-10');

Scenario('When I go to the Overview landing page, I see the page heading', I => {
  I.amOnPage(paths.landingPages.overview);
  I.see(overviewContent.heading);
});

Scenario('When I go to the Before you appeal landing page, I see the page heading', I => {
  I.amOnPage(paths.landingPages.beforeYouAppeal);
  I.see(beforeYouAppealContent.heading);
});

Scenario('When I go to the Help with appeal landing page, I see the page heading', I => {
  I.amOnPage(paths.landingPages.helpWithAppeal);
  I.see(helpWithAppealContent.heading);
});

Scenario('When I go to the after you appeal landing page, I see the page heading', I => {
  I.amOnPage(paths.landingPages.afterYouAppeal);
  I.see(afterYouAppealContent.heading);
});

Scenario('When I go to the start an appeal landing page, I see the page heading', I => {
  I.amOnPage(paths.landingPages.startAnAppeal);
  I.see(startAnAppealContent.heading);
});

Scenario('When I click start appeal, I am taken to the benefits page', I => {
  I.amOnPage(paths.landingPages.startAnAppeal);
  I.click(startAnAppealContent.start);
  I.seeInCurrentUrl(paths.start.benefitType);
});

Scenario('When on the overview page, I click the cookies link, I see url /cookie-policy', I => {
  I.amOnPage(paths.landingPages.overview);
  I.click('Cookies');
  I.seeInCurrentUrl(paths.policy.cookiePolicy);
});

Scenario('When on the overview page, I click the T&Cs link, I see url /terms-and-conditions', I => {
  I.amOnPage(paths.landingPages.overview);
  I.click('Terms and conditions');
  I.seeInCurrentUrl(paths.policy.termsAndConditions);
});
