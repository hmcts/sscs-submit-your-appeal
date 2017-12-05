'use strict';

const DateUtils = require('utils/DateUtils');
const paths = require('paths');
const oneMonthAgo = DateUtils.oneMonthAgo();

Feature('Appellant PIP, one month ago, does not attend hearing.');

Before((I) => {
    I.createTheSession();
    I.seeCurrentUrlEquals(paths.start.benefitType);
});

After((I) => {
    I.endTheSession();
});

Scenario('Appellant doesn\'t define an optional phone number and doesn\'t sign up for text msg reminders.', (I) => {

    IenterDetailsFromStartToNINO(I);
    I.enterAppellantContactDetailsAndContinue();
    I.selectDoYouWantToReceiveTextMessageReminders('No thanks');
    IenterDetailsFromNoRepresentativeToEnd(I);

    IconfirmDetailsArePresent(I);
});

Scenario('Appellant doesn\'t define an optional phone number, however, enters mobile for text msg reminders.', (I) => {

    IenterDetailsFromStartToNINO(I);
    I.enterAppellantContactDetailsAndContinue();
    I.selectDoYouWantToReceiveTextMessageReminders('Sign up');
    I.enterMobileAndContinue('07455678444');
    I.readSMSConfirmationAndContinue();
    IenterDetailsFromNoRepresentativeToEnd(I);

    IconfirmDetailsArePresent(I);
    ISeeMobileNumberInTxtMsgRemindersSection(I, '07455678444');
});

Scenario('Appellant defines an optional phone number and signs up for text msg reminders using the same number.', (I) => {

    IenterDetailsFromStartToNINO(I);

    I.enterAppellantContactDetailsWithMobileAndContinue('07411738663');
    I.selectDoYouWantToReceiveTextMessageReminders('Sign up');
    I.selectUseSameNumberAndContinue('#useSameNumber-yes');
    I.readSMSConfirmationAndContinue();
    IenterDetailsFromNoRepresentativeToEnd(I);

    IconfirmDetailsArePresent(I);
    ISeePhoneNumberInAppellantDetailsSection(I, '07411738663');
    ISeeMobileNumberInTxtMsgRemindersSection(I, '07411738663');
});

Scenario('Appellant defines an optional phone number, this is overridden by another number for text msg reminders.', (I) => {

    IenterDetailsFromStartToNINO(I);

    I.enterAppellantContactDetailsWithMobileAndContinue('07411738663');
    I.selectDoYouWantToReceiveTextMessageReminders('Sign up');
    I.selectUseSameNumberAndContinue('#useSameNumber-no');
    I.enterMobileAndContinue('07411333333');
    I.readSMSConfirmationAndContinue();
    IenterDetailsFromNoRepresentativeToEnd(I);

    IconfirmDetailsArePresent(I);
    ISeePhoneNumberInAppellantDetailsSection(I, '07411738663');
    ISeeMobileNumberInTxtMsgRemindersSection(I, '07411333333');

});

Scenario('Appellant defines an optional phone number, but doesn\'t sign up for text msg reminders.', (I) => {

    IenterDetailsFromStartToNINO(I);

    I.enterAppellantContactDetailsWithMobileAndContinue('07411738663');
    I.selectDoYouWantToReceiveTextMessageReminders('No thanks');
    IenterDetailsFromNoRepresentativeToEnd(I);

    IconfirmDetailsArePresent(I);
    ISeePhoneNumberInAppellantDetailsSection(I, '07411738663');

});

const IenterDetailsFromStartToNINO = (I) => {

    I.enterBenefitTypeAndContinue('PIP');
    I.enterAnMRNDateAndContinue(oneMonthAgo);
    I.selectAreYouAnAppointeeAndContinue('No, I’m appealing for myself');
    I.enterAppellantNameAndContinue('Mr','Harry','Potter');
    I.enterAppellantDOBAndContinue('25','01','1980');
    I.enterAppellantNINOAndContinue('NX877564C');

};

const IenterDetailsFromNoRepresentativeToEnd = (I) => {

    I.selectDoYouHaveARepresentativeAndContinue('No');
    I.enterReasonForAppealingAndContinue('A reason...');
    I.enterAnythingElseAndContinue('Anything else...');
    I.readSendingEvidenceAndContinue();
    I.enterDoYouWantToAttendTheHearing('No');
    I.readYouHaveChosenNotToAttendTheHearingNoticeAndContinue();
};

const IconfirmDetailsArePresent = (I) => {

    // We are on CYA
    I.seeCurrentUrlEquals('/check-your-appeal');

    // Type of benefit
    I.see('Personal Independence Payment (PIP)');

    // Date of MRN
    I.see(`${oneMonthAgo.date()}/${oneMonthAgo.month()+1}/${oneMonthAgo.year()}`);

    // Appellant name
    I.see('Mr Harry Potter');

    // Appellant DOB
    I.see('25.01.1980');

    // Appellant NINO
    I.see('NX877564C');

    // Appellant address
    I.see('4 Privet Drive');
    I.see('Off Wizards close');
    I.see('Little Whinging');
    I.see('Kent');
    I.see('PA80 5UU');

    // Appellant Reason for appealing
    I.see('A reason...');

    // Anything else the appellant wants to tell the tribunal
    I.see('Anything else...');

    // Shows when the appeal is complete
    I.see('Now send your application');

};

const ISeePhoneNumberInAppellantDetailsSection = (I, phoneNumber) => {

    const section = `<div>
  <dt class="cya-question">
    Phone number
  </dt>
  <dd class="cya-answer">
    
      ${phoneNumber}
    
  </dd>
  <dd class="cya-change">
    <a href="/enter-appellant-contact-details">
      Change<span class="visually-hidden"> Phone number</span>
    </a>
  </dd>
</div>`;

    I.seeInSource(section);
};

const ISeeMobileNumberInTxtMsgRemindersSection = (I, mobileNumber) => {

    const section = `<div>
  <dt class="cya-question">
    Mobile Number
  </dt>
  <dd class="cya-answer">
    
      ${mobileNumber}
    
  </dd>
  <dd class="cya-change">
    <a href="/send-to-number">
      Change<span class="visually-hidden"> Mobile Number</span>
    </a>
  </dd>
</div>`;

    I.seeInSource(section);
};
