const content = require('commonContent');
const paths = require('paths');
const mockData = require('test/e2e/data');

const appellant = mockData.appellant;
const signer = mockData.signAndSubmit.signer;
const languages = ['en', 'cy'];

Feature(`E2E SYA- Full Journey`);

languages.forEach(language => {
    Scenario(`${language.toUpperCase()} - E2E SYA Journey`, I => {
        const commonContent = content[language];
        I.amOnPage(`${paths.session.root}?lng=${language}`);
        I.wait(2);
        I.enterDetailsFromStartToNINO(commonContent, language);
        I.enterAppellantContactDetailsWithMobileAndContinue(commonContent, language, appellant.contactDetails.phoneNumber);
        I.checkOptionAndContinue(commonContent, '#doYouWantTextMsgReminders-yes');
        I.checkOptionAndContinue(commonContent, '#useSameNumber-yes');
        I.readSMSConfirmationAndContinue(commonContent);
        I.enterDetailsFromNoRepresentativeToUploadingEvidence(commonContent);
        I.enterDoYouWantToAttendTheHearing(commonContent, '#attendHearing-yes');
        I.selectDoYouNeedSupportAndContinue(commonContent, '#arrangements-no');
        I.selectHearingAvailabilityAndContinue(commonContent, '#scheduleHearing-no');
        I.checkYourAppealToConfirmationPage(language,  signer);
    }).retry(1).tag('@functional');
});



