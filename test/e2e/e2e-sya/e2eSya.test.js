const content = require('commonContent');
const paths = require('paths');
const supportDataEn = require('test/e2e/data.en');
const supportDataCy = require('test/e2e/data.cy');


const languages = ['en', 'cy'];

Feature('E2E SYA- Full Journey...');

languages.forEach(language => {
    Scenario(`${language.toUpperCase()} - E2E SYA Journey @functional`, I => {
        const testData = language === 'en' ? supportDataEn : supportDataCy;
        const commonContent = content[language];

        I.amOnPage(`${paths.session.root}?lng=${language}`);
        I.wait(2);
        I.enterDetailsFromStartToNINO(commonContent, language);
        I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, language, '07411222222');
        I.checkOptionAndContinue(commonContent, '#doYouWantTextMsgReminders-yes');
        I.checkOptionAndContinue(commonContent, '#useSameNumber-yes');
        I.readSMSConfirmationAndContinue(commonContent);
        I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent);
        I.enterDoYouWantToAttendTheHearing(commonContent, '#attendHearing-yes');
        I.selectDoYouNeedSupportAndContinue(commonContent, '#arrangements-no');
        I.selectHearingAvailabilityAndContinue(commonContent, '#scheduleHearing-no');
        I.checkYourAppealToConfirmationPage(language, testData.signAndSubmit.signer);
    }).retry(1);
});
