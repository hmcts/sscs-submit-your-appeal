const stillCanAppealContentEn = require('steps/compliance/still-can-appeal/content.en');
const stillCanAppealContentCy = require('steps/compliance/still-can-appeal/content.cy');

function continueFromStillCanAppeal(language) {
  
  const stillCanAppealContent = language === 'en' ? stillCanAppealContentEn : stillCanAppealContentCy;

  await expect(page.getByText(stillCanAppealContent.title)).toBeVisible({ timeout: 45000 })
  await page.click(stillCanAppealContent.continueButton);
}

module.exports = { continueFromStillCanAppeal };
