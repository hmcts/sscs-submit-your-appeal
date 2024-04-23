const stillCanAppealContentEn = require('steps/compliance/still-can-appeal/content.en');
const stillCanAppealContentCy = require('steps/compliance/still-can-appeal/content.cy');

function continueFromStillCanAppeal(language) {
  const I = this;
  const stillCanAppealContent = language === 'en' ? stillCanAppealContentEn : stillCanAppealContentCy;

  I.waitForText(stillCanAppealContent.title);
  I.click(stillCanAppealContent.continueButton);
}

module.exports = { continueFromStillCanAppeal };
