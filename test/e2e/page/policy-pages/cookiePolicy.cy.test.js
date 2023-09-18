const language = 'cy';
const cookiePolicyContent = require(`steps/policy-pages/cookie-policy/content.${language}`);
const paths = require('paths');

Feature(`${language.toUpperCase()} - Cookie policy @batch-10`);

Scenario(`${language.toUpperCase()} - When I go to the cookie policy page, I see the page heading`, ({ I }) => {
  I.amOnPage(paths.policy.cookiePolicy);
  I.see(cookiePolicyContent.cookies.title);
});
