const paths = require('paths');
const config = require('config');

Feature('Uploading Evidence');

if (config.get('features.evidenceUpload.enabled')) {
  Before(I => {
    I.createTheSession();
    I.amOnPage(paths.reasonsForAppealing.sendingEvidence);
  });

  Scenario('I can upload correctly a file', I => {
    I.click('Continue');
    I.attachFile('#uploadEv', 'evidence.txt');
    I.click('.button');
  });
}