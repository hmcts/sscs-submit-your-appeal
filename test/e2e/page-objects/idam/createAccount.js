const createAccountContentEn = require('steps/start/create-account/content.en');
const createAccountContentCy = require('steps/start/create-account/content.cy');

function selectIfYouWantToCreateAccount(language, commonContent, option) {
  const I = this;
  const createAccountContent = language === 'en' ? createAccountContentEn : createAccountContentCy;

  I.waitForText(createAccountContent.title);
  I.checkOption(option);
  // I.scrollPageToBottom();
  I.click(commonContent.continue);
}

module.exports = { selectIfYouWantToCreateAccount };
