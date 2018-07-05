const paths = require('paths');

Feature('Health');

xScenario('The API is up and responding to requests to /health @smoke', I => {
  I.amOnPage(paths.health);
  I.see('"status":"UP"');
});
