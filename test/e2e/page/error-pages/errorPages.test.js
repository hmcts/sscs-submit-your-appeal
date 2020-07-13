const content = require('commonContent');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('Error Pages @batch-08');

languages.forEach(language => {
  Before(I => {
    I.createTheSession(language);
  });

  After(I => {
    I.endTheSession();
  });

  const commonContent = content[language];

  Scenario(`${language.toUpperCase()} - When I go to a path that /does-not-exist I see an error message`, I => {
    I.amOnPage(paths.errors.doesNotExist);
    I.see(commonContent.errors.notFound.title);
  });

  Scenario(`${language.toUpperCase()} - When I go to /internal-server-error I see an error message`, I => {
    I.amOnPage(paths.errors.internalServerError);
    I.see(commonContent.errors.serverError.title);
  });
});
