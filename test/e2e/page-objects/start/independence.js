const { expect } = require('@playwright/test');
const independenceContentEn = require('steps/start/independence/content.en');
const independenceContentCy = require('steps/start/independence/content.cy');

async function continueFromIndependance(I, language, commonContent) {
  const independenceContent = language === 'en' ? independenceContentEn : independenceContentCy;
  
  await expect(I.getByText(independenceContent.separate).first()).toBeVisible();
  await I.getByRole('button', { name: commonContent.continue }).first().click();
}

module.exports = { continueFromIndependance };
