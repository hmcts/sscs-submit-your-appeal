import { test, expect } from '@playwright/test';
import { PageFactory } from '../../factory/pageFactory';
import { getJsonFromFile } from '../../utils/JsonUtil';
import { getDayMonthYear } from '../../utils/DateUtil';

async function runAssertions(ibcaPageObject: any) {
  await expect(ibcaPageObject.page.locator(ibcaPageObject.heading).first()).toContainText(ibcaPageObject.defaultPageContent.heading);
  ibcaPageObject.defaultPageContent.bodyContents.forEach((bodyContent: string[]) => expect(ibcaPageObject.page.locator(ibcaPageObject.body)).toContainText(bodyContent));
}

[
  { refNumPredatedBy: 1, saveForLater: false },
  { refNumPredatedBy: 13, saveForLater: false },
  { refNumPredatedBy: 1, saveForLater: true },
  { refNumPredatedBy: 13, saveForLater: true },
].forEach(({ refNumPredatedBy, saveForLater }) => {
  test(`testing end to end ibca journey for ref. num predated by ${refNumPredatedBy} month(s) and saveForLater set to ${saveForLater} scenario`, { tag: '@fullFunctional' }, async ({ page }) => {
    // eslint-disable-next-line no-process-env
    process.env.LANGUAGE_TO_TEST = 'en';
    // eslint-disable-next-line no-process-env
    const testData = await getJsonFromFile(`test/e2e/data.ibca.${process.env.LANGUAGE_TO_TEST}.json`);
    const ibcaPages = await PageFactory.getAllPages(page);

    testData.sidamCredentials.username = process.env.USEREMAIL_1;

    await ibcaPages.languagePreferencePage.goto();

    // Choose Language
    await runAssertions(ibcaPages.languagePreferencePage);
    await ibcaPages.languagePreferencePage.chooseLanguage(testData.language);

    // Agree to independent tribunal
    await runAssertions(ibcaPages.independencePage);
    await ibcaPages.independencePage.submitPage();

    // Create account page
    await runAssertions(ibcaPages.createAccountPage);
    await ibcaPages.createAccountPage.saveForLater(saveForLater, testData.sidamCredentials);

    // Agree to independent tribunal - Repeat only if saveForLater set to true
    if (saveForLater) {
      await runAssertions(ibcaPages.independencePage);
      await ibcaPages.independencePage.submitPage();
    }


    // Review decision notice page
    await runAssertions(ibcaPages.reviewDecisionNoticePage);
    await ibcaPages.reviewDecisionNoticePage.reviewDecisionNotice(testData.reviewDecisionNotice);

    // Enter RefNum
    await runAssertions(ibcaPages.ibcaRefNumPage);
    await ibcaPages.ibcaRefNumPage.enterReferenceNumber(testData.ibcaRefNum);

    // Enter RefDate
    await runAssertions(ibcaPages.ibcaReferenceDatePage);
    const date = new Date();
    date.setMonth(date.getMonth() - refNumPredatedBy)
    await ibcaPages.ibcaReferenceDatePage.enterDate(...getDayMonthYear(date));

    if (refNumPredatedBy > 0) {
      await ibcaPages.ibcaReferenceLateDatePage.isDateRight(true);
      await ibcaPages.ibcaReferenceLateDateReasonPage.lateAppealReasons('test reason');
    }
    // Enter Appellant data
    await runAssertions(ibcaPages.enterAppellantRolePage);
    await ibcaPages.enterAppellantRolePage.appellantRole(testData.appellantRole);

    // Enter Appellant name
    await runAssertions(ibcaPages.enterAppellantNamePage);
    await ibcaPages.enterAppellantNamePage.appellantName(testData.appellant.firstName, testData.appellant.lastName);

    // Enter Appellant DoB
    await runAssertions(ibcaPages.appellantDobPage);
    await ibcaPages.appellantDobPage.enterDate(
      testData.appellant.dob.day,
      testData.appellant.dob.month,
      testData.appellant.dob.year
    );

    // Enter Appellant Address Region
    await runAssertions(ibcaPages.appellantInMainlandUkPage);
    await ibcaPages.appellantInMainlandUkPage.isInCountry(testData.appellant.isInCountry);

    // Enter Appellant Contact Details
    await runAssertions(ibcaPages.appellantContactDetailsPage);
    await ibcaPages.appellantContactDetailsPage.enterAddressAndContactDetailsManual(testData.appellant.contactDetails);

    // SMS Notifications
    await runAssertions(ibcaPages.appellantTextRemindersPage);
    await ibcaPages.appellantTextRemindersPage.receiveTextMessageNotifications(testData.smsNotify);

    await expect(page.locator('h1')).toContainText('Do you want to register a representative?');
    await ibcaPages.representativePage.requireLegalRep(testData.hasRepresentative);

    // LR Notifications
    // await runAssertions(ibcaPages.representativePage);
    await ibcaPages.representativePage.enterLegalRepContactDetailsManual(testData.representative);

    // Reasons for Appeal
    await runAssertions(ibcaPages.reasonsForAppealPage);
    await ibcaPages.reasonsForAppealPage.reasonsForAppealInfo(
      testData.reasonsForAppealing.reasons[0].whatYouDisagreeWith,
      testData.reasonsForAppealing.reasons[0].reasonForAppealing
    );

    // Reasons for Appeal
    await runAssertions(ibcaPages.otherReasonsForAppealPage);
    await ibcaPages.otherReasonsForAppealPage.otherReasons(testData.reasonsForAppealing.otherReasons);

    // Evidence Provide
    await runAssertions(ibcaPages.evidenceProvidePage);
    await ibcaPages.evidenceProvidePage.isEvidenceRequired(testData.isEvidenceRequired);

    // Hearing Page
    await runAssertions(ibcaPages.theHearingPage);
    await ibcaPages.theHearingPage.preferHearing(testData.hearing.wantsToAttend);

    // CYA page
    await ibcaPages.checkYourAppealPage.signAndSubmitYourAppeal(testData.signAndSubmit.signer);

    //  Confirmation page
    await runAssertions(ibcaPages.confirmationPage);

    // Go back to home page
    if (saveForLater) {
      await ibcaPages.languagePreferencePage.goto();
      await runAssertions(ibcaPages.draftAppealsPage);

      // Edit appeal and check if landing page is cya
      await ibcaPages.draftAppealsPage.editAppeal();
      await runAssertions(ibcaPages.checkYourAppealPage);
    }
  });
});
