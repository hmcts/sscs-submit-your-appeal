const paths = require('paths');

Feature('Health');

Scenario('The API is up, healthy and responding to requests to /health @smoke', I => {
  I.amOnPage(paths.health);
  I.retry({
    retries: 3,
    minTimeout: 3000
  }).see('"status":"UP"');
});