const stillCanAppealContentEn = require('steps/compliance/still-can-appeal/content.en.json');
const stillCanAppealContentCy = require('steps/compliance/still-can-appeal/content.en.json');

function continueFromStillCanAppeal(language) {
  const I = this;
  const stillCanAppealContent = language === 'en' ? stillCanAppealContentEn : stillCanAppealContentCy;

  I.click(stillCanAppealContent.continueButton);
}

module.exports = { continueFromStillCanAppeal };
