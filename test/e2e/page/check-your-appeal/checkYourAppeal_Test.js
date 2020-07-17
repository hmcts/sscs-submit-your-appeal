const content = require('commonContent');
const checkYourAppealContentEn = require('steps/check-your-appeal/content.en');
const checkYourAppealContentCy = require('steps/check-your-appeal/content.cy');
const paths = require('paths');

const languages = ['en', 'cy'];

// let languages = new DataTables(())

Feature('Check-your-appeal-Test @functional');

languages.forEach(language => {
    const commonContent = content[language];
    const checkYourAppealContent = language === 'en' ? checkYourAppealContentEn : checkYourAppealContentCy;

    Before(I => {
        I.createTheSession(language);
    });

    After(I => {
        I.endTheSession();
    });

    Scenario(`${language.toUpperCase()} - When I go to the check your appeal page, I don't see the Sign and submit section`, async (I) => {
        await I.enterBenefitTypeAndContinue(commonContent, 'pip');
        I.amOnPage(paths.checkYourAppeal);
        I.dontSee(checkYourAppealContent.header);
    });
});
