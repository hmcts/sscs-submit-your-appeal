const content = require('content.en');
const paths = require('paths');

Feature('Error Pages @batch-08');

Before(I => {
  I.createTheSession();
});

After(I => {
  I.endTheSession();
});

Scenario('When I go to a path that /does-not-exist I see an error message', I => {
  I.amOnPage(paths.errors.doesNotExist);
  I.see(content.errors.notFound.title);
});

Scenario('When I go to /internal-server-error I see an error message', I => {
  I.amOnPage(paths.errors.internalServerError);
  I.see(content.errors.serverError.title);
});
