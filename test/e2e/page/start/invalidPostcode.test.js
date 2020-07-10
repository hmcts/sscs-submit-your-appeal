const invalidPostcodeContentEn = require('steps/start/invalid-postcode/content.en');
const invalidPostcodeContentCy = require('steps/start/invalid-postcode/content.cy');
const paths = require('paths');

const languages = ['en', 'cy'];

Feature('Invalid postcode @batch-12');

languages.forEach(language => {
  Before(I => {
    I.amOnPage(paths.start.invalidPostcode);
  });

  const invalidPostcodeContent = language === 'en' ? invalidPostcodeContentEn : invalidPostcodeContentCy;

  Scenario(`${language.toUpperCase()} - When I go to the invalid postcode page I see the page heading`, I => {
    I.see(invalidPostcodeContent.title);
  });
});
