const doYouWantTextMsgRemindersContent = require('steps/sms-notify/text-reminders/content.en');
const haveContactedDWPContent = require('steps/compliance/have-contacted-dwp/content.en');
const haveAMRNContent = require('steps/compliance/have-a-mrn/content.en');
const appointeeContent = require('steps/identity/appointee/content.en');
const contactDWP = require('steps/compliance/contact-dwp/content.en');

const DateUtils = require('utils/DateUtils');
const testData = require('test/e2e/data');
const moment = require('moment');
const paths = require('paths');

const doYouWantTextMsgReminders = doYouWantTextMsgRemindersContent.fields.doYouWantTextMsgReminders;
const haveContactedDWP = haveContactedDWPContent.fields.haveContactedDWP;
const haveAMRN = haveAMRNContent.fields.haveAMRN;
const isAppointee = appointeeContent.fields.isAppointee;
const appellant = testData.appellant;

Feature('Appellant does not have a MRN');

Before(I => {
  I.createTheSession();
  I.seeCurrentUrlEquals(paths.start.benefitType);
});

After(I => {
  I.endTheSession();
});

Scenario('Appellant has contacted DWP', async I => {
  const randomWeekDay = DateUtils.getDateInMilliseconds(
    DateUtils.getRandomWeekDayFromDate(moment().startOf('day').add(5, 'weeks'))
  );

  const hasMRN = false;

  I.enterBenefitTypeAndContinue(testData.benefitType.code);
  I.enterPostcodeAndContinue(appellant.contactDetails.postCode);
  I.checkOptionAndContinue(isAppointee.no);
  I.continueFromIndependance();
  I.checkOptionAndContinue(haveAMRN.no);
  I.checkOptionAndContinue(haveContactedDWP.yes);
  I.enterReasonForNoMRNAndContinue(testData.mrn.reasonForNoMRN);
  I.enterAppellantNameAndContinue(appellant.title, appellant.firstName, appellant.lastName);
  I.enterAppellantDOBAndContinue(appellant.dob.day, appellant.dob.month, appellant.dob.year);
  I.enterAppellantNINOAndContinue(appellant.nino);
  I.enterAppellantContactDetailsAndContinue();
  I.selectDoYouWantToReceiveTextMessageReminders(doYouWantTextMsgReminders.no);
  I.enterDetailsFromNoRepresentativeToSendingEvidence();
  await I.enterDetailsFromAttendingTheHearingDatePickerToEnd(randomWeekDay);
  I.confirmDetailsArePresent(hasMRN);
});

Scenario('Appellant has not contacted DWP and exits the service', I => {
  I.enterBenefitTypeAndContinue(testData.benefitType.code);
  I.enterPostcodeAndContinue(appellant.contactDetails.postCode);
  I.checkOptionAndContinue(isAppointee.no);
  I.continueFromIndependance();
  I.selectHaveYouGotAMRNAndContinue(haveAMRN.no);
  I.checkOptionAndContinue(haveContactedDWP.no);
  I.see(contactDWP.title);
  I.click(contactDWP.govuk);
  I.seeCurrentUrlEquals('https://www.gov.uk/');
});
