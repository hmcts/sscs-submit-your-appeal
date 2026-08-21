const { expect } = require('@playwright/test');
const independenceContentEn = require('steps/start/independence/content.en');
const independenceContentCy = require('steps/start/independence/content.cy');

async function continueFromIndependance(I, commonContent) {

  const enText = independenceContentEn.separate;
  const cyText = independenceContentCy.separate;

  const enLocator = I.getByText(enText).first();
  const cyLocator = I.getByText(cyText).first();

  if(await enLocator.count() > 0) {
    await expect(enLocator).toBeVisible();
  } else {
    await expect(cyLocator).toBeVisible();
  }

  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

module.exports = { continueFromIndependance };
