const paths = require('paths');

Feature('Health');

Scenario('The API is up, healthy and responding to requests to /health @smoke', I => {
  I.amOnPage(paths.health);
  I.see('"status":"UP"');
});
