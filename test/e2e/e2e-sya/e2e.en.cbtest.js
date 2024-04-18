/* eslint-disable no-process-env */


const content = require('commonContent');
// const testData = require('test/e2e/data.en');

Feature('Crossbrowser - PIP E2E SYA - Full Journey @crossbrowser');

Scenario('English - PIP E2E SYA Journey', ({ I }) => {
  const commonContent = content.en;
  const language = 'en';

  I.createTheSession(language);

  I.wait(1);
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.endTheSession();
}).retry(8);


Scenario('Welsh - PIP E2E SYA Journey', ({ I }) => {
  const commonContent = content.cy;
  const language = 'cy';

  I.createTheSession(language);

  I.wait(1);
  I.enterDetailsFromStartToNINO(commonContent, language);
  I.endTheSession();
}).retry(8);
