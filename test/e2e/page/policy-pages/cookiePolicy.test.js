const cookiePolicyContentEn = require('steps/policy-pages/cookie-policy/content.en');
const cookiePolicyContentCy = require('steps/policy-pages/cookie-policy/content.cy');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('Cookie policy @batch-10');

languages.forEach(language => {
  const cookiePolicyContent = language === 'en' ? cookiePolicyContentEn : cookiePolicyContentCy;

  Scenario(`${language.toUpperCase()} - When I go to the cookie policy page, I see the page heading`, I => {
    I.amOnPage(paths.policy.cookiePolicy);
    I.see(cookiePolicyContent.cookies.title);
  });
});
