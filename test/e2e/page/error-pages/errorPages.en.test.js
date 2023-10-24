const language = 'en';
const commonContent = require('commonContent')[language];
const paths = require('paths');

Feature(`${language.toUpperCase()} - Error Pages @batch-08`);

Before(({ I }) => {
  I.createTheSession(language);
});

After(({ I }) => {
  I.endTheSession();
});

Scenario(`${language.toUpperCase()} - When I go to a path that /does-not-exist I see an error message`, ({ I }) => {
  I.amOnPage(paths.errors.doesNotExist);
  I.see(commonContent.errors.notFound.title);
});

Scenario(`${language.toUpperCase()} - When I go to /internal-server-error I see an error message`, ({ I }) => {
  I.amOnPage(paths.errors.internalServerError);
  I.see(commonContent.errors.serverError.title);
});
