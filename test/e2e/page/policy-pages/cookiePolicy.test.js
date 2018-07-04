const paths = require('paths');
const content = require('policy-pages/cookie-policy/content.en.json');

Feature('Cookie policy @batch-10');

Scenario('When I go to the cookie policy page, I see the page heading', I => {
  I.amOnPage(paths.policy.cookiePolicy);
  I.see(content.cookies.title);
});
