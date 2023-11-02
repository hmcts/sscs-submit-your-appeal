const paths = require('paths');

Feature('Health');

Scenario('The API is up, healthy and responding to requests to /health', ({ I }) => {
  I.amOnPage(paths.health);
  I.retry({
    minTimeout: 15000,
    maxTimeout: 15000
  }).see('"status":"UP"');
});
