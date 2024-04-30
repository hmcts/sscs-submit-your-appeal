const hearingAvailabilityContentEn = require('steps/hearing/availability/content.en');
const hearingAvailabilityContentCy = require('steps/hearing/availability/content.cy');


function selectHearingAvailabilityAndContinue(language, commonContent, option) {
  const I = this;
  const hearingAvailabilityContent = language === 'en' ? hearingAvailabilityContentEn : hearingAvailabilityContentCy;

  I.waitForText(hearingAvailabilityContent.title);
  I.checkOption(option);
  I.click(commonContent.continue);
}

module.exports = { selectHearingAvailabilityAndContinue };
