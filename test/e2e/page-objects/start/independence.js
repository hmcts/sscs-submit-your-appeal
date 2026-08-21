const { expect } = require('@playwright/test');
const independenceContentEn = require('steps/start/independence/content.en');
const independenceContentCy = require('steps/start/independence/content.cy');

async function continueFromIndependance(I, commonContent) {

  // const enText = independenceContentEn.separate;
  // const cyText = independenceContentCy.separate;

  // const enLocator = I.getByText(enText).first();
  // const cyLocator = I.getByText(cyText).first();

  // if(await enLocator.count() > 0) {
  //   await expect(enLocator).toBeVisible();
  // } else if (await cyLocator.count() > 0) {
  //   await expect(cyLocator).toBeVisible();
  // } else {
  //   //Defaulting to english text if neither locator is found, this should not happen but just in case
  //   await expect(enLocator).toBeVisible();
  // }

  await I.waitForElement('p.govuk-body-l', 10); // Wait for the button to be present
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

module.exports = { continueFromIndependance };
