const language = 'cy';
const commonContent = require('../../../commonContent')[language];
const selectors = require('../../../steps/check-your-appeal/selectors');
const paths = require('../../../paths');

const whatYouDisagreeWithField = '#item\\.whatYouDisagreeWith';
const reasonForAppealingField = '#item\\.reasonForAppealing';
const reasons = require('../data.en').reasonsForAppealing.reasons;
const testData = require('../data.en');

const twoReasons = [reasons[0], reasons[1]];
const evidenceUploadEnabled = require('config').get('features.evidenceUpload.enabled');

const reasonForAppealing = selectors[language].reasonsForAppealing.reasons;
const reasonForAppealingChange = `${reasonForAppealing}-1 ${selectors.change}`;

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../page-objects/session/createSession');
const { endTheSession } = require('../page-objects/session/endSession');
const { addAReasonForAppealing, addAReasonForAppealingAndThenClickAddAnother } = require('../page-objects/reasons-for-appealing/reasonForAppealingOnePageForm');
const { confirmDetailsArePresent, enterDetailsFromStartToNINO } = require('../page-objects/cya/checkYourAppeal');
const { readYouHaveChosenNotToAttendTheHearingNoticeAndContinue, enterDoYouWantToAttendTheHearing } = require('../page-objects/hearing/theHearing');
const { enterDescription } = require('../page-objects/upload-evidence/evidenceDescription');
const { uploadAPieceOfEvidence } = require('../page-objects/upload-evidence/uploadEvidencePage');
const { selectAreYouProvidingEvidenceAndContinue } = require('../page-objects/upload-evidence/evidenceProvide');
const { readSendingEvidenceAndContinue } = require('../page-objects/reasons-for-appealing/sendingEvidence');
const { enterAnythingElseAndContinue } = require('../page-objects/reasons-for-appealing/reasonsForAppealing');
const { selectDoYouHaveARepresentativeAndContinue } = require('../page-objects/representative/representative');
const { selectDoYouWantToReceiveTextMessageReminders } = require('../page-objects/sms-notify/textReminders');
const { enterAppellantContactDetailsAndContinue } = require('../page-objects/identity/appellantDetails');

test.describe(`${language.toUpperCase()} - Appellant PIP, one month ago, attends hearing with reasons for appealing one page form`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - Adds reasons for appealing and sees them in check your answers`, async({ page }) => {
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsAndContinue(page, commonContent, language);
    await selectDoYouWantToReceiveTextMessageReminders(page, commonContent, '#doYouWantTextMsgReminders-no');
    await selectDoYouHaveARepresentativeAndContinue(page, commonContent, '#hasRepresentative-no');
    await addAReasonForAppealingAndThenClickAddAnother(page, `#items-0 ${whatYouDisagreeWithField}-0`, `#items-0 ${reasonForAppealingField}-0`, reasons[0]);
    await addAReasonForAppealing(page, language, `#items-1 ${whatYouDisagreeWithField}-1`, `#items-1 ${reasonForAppealingField}-1`, reasons[1]);
    await page.getByText(commonContent.continue).first().click();
    await enterAnythingElseAndContinue(page, language, commonContent, testData.reasonsForAppealing.otherReasons);
    if (!evidenceUploadEnabled) {
      await readSendingEvidenceAndContinue(page, commonContent);
    }
    if (evidenceUploadEnabled) {
      await selectAreYouProvidingEvidenceAndContinue(page, language, commonContent, '#evidenceProvide-yes');
      await uploadAPieceOfEvidence(page);
      await enterDescription(page, commonContent, 'Some description of the evidence');
    }
    await enterDoYouWantToAttendTheHearing(page, language, commonContent, '#attendHearing-no');
    await readYouHaveChosenNotToAttendTheHearingNoticeAndContinue(page, commonContent);
    await confirmDetailsArePresent(page, language);
    await Promise.all(twoReasons.map(reason => expect(page.getByText(reason.whatYouDisagreeWith)).toBeVisible()));
    await Promise.all(twoReasons.map(reason => expect(page.getByText(reason.reasonForAppealing)).toBeVisible()));
  });

  test(`${language.toUpperCase()} - Enters a reason for appealing, then edits the reason`, async({ page }) => {
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsAndContinue(page, commonContent, language);
    await selectDoYouWantToReceiveTextMessageReminders(page, commonContent, '#doYouWantTextMsgReminders-no');
    await selectDoYouHaveARepresentativeAndContinue(page, commonContent, '#hasRepresentative-no');
    await addAReasonForAppealingAndThenClickAddAnother(page, `#items-0 ${whatYouDisagreeWithField}-0`, `#items-0 ${reasonForAppealingField}-0`, reasons[0]);
    await addAReasonForAppealing(page, language, `#items-1 ${whatYouDisagreeWithField}-1`, `#items-1 ${reasonForAppealingField}-1`, reasons[1]);
    await page.getByText(commonContent.continue).first().click();
    await enterAnythingElseAndContinue(page, language, commonContent, testData.reasonsForAppealing.otherReasons);
    if (!evidenceUploadEnabled) {
      await readSendingEvidenceAndContinue(page, commonContent);
    }
    if (evidenceUploadEnabled) {
      await selectAreYouProvidingEvidenceAndContinue(page, language, commonContent, '#evidenceProvide-yes');
      await uploadAPieceOfEvidence(page);
      await enterDescription(page, commonContent, 'Some description of the evidence');
    }
    await enterDoYouWantToAttendTheHearing(page, language, commonContent, '#attendHearing-no');
    await readYouHaveChosenNotToAttendTheHearingNoticeAndContinue(page, commonContent);
    await confirmDetailsArePresent(page, language);
    await Promise.all(twoReasons.map(reason => expect(page.getByText(reason.whatYouDisagreeWith)).toBeVisible()));
    await Promise.all(twoReasons.map(reason => expect(page.getByText(reason.reasonForAppealing)).toBeVisible()));

    // Now Change the reason a different answer.
    await page.getByText(reasonForAppealingChange).first().click();
    await page.waitForURL(`**/${paths.reasonsForAppealing.reasonForAppealing}`);
    await expect(page.locator('#items-0').first()).toBeVisible();

    await addAReasonForAppealing(page, language, `#items-0 ${whatYouDisagreeWithField}-0`, `#items-0 ${reasonForAppealingField}-0`, reasons[2]);
    await page.getByText(commonContent.continue).first().click();
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(reasons[0].whatYouDisagreeWith)).not.toBeVisible();
    await expect(page.getByText(reasons[0].reasonForAppealing)).not.toBeVisible();
    await expect(page.getByText(reasons[2].whatYouDisagreeWith).first()).toBeVisible();
    await expect(page.getByText(reasons[2].reasonForAppealing).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - Enters a reason for appealing, then removes the reason and sees errors`, async({ page }) => {
    await enterDetailsFromStartToNINO(page, commonContent, language);
    await enterAppellantContactDetailsAndContinue(page, commonContent, language);
    await selectDoYouWantToReceiveTextMessageReminders(page, commonContent, '#doYouWantTextMsgReminders-no');
    await selectDoYouHaveARepresentativeAndContinue(page, commonContent, '#hasRepresentative-no');
    await addAReasonForAppealingAndThenClickAddAnother(page, `#items-0 ${whatYouDisagreeWithField}-0`, `#items-0 ${reasonForAppealingField}-0`, reasons[0]);
    await page.getByText(commonContent.continue).first().click();
    await enterAnythingElseAndContinue(page, language, commonContent, testData.reasonsForAppealing.otherReasons);
    if (!evidenceUploadEnabled) {
      await readSendingEvidenceAndContinue(page, commonContent);
    }
    if (evidenceUploadEnabled) {
      await selectAreYouProvidingEvidenceAndContinue(page, language, commonContent, '#evidenceProvide-yes');
      await uploadAPieceOfEvidence(page);
      await enterDescription(page, commonContent, 'Some description of the evidence');
    }
    await enterDoYouWantToAttendTheHearing(page, language, commonContent, '#attendHearing-no');
    await readYouHaveChosenNotToAttendTheHearingNoticeAndContinue(page, commonContent);
    await confirmDetailsArePresent(page, language);
    await expect(page.getByText(reasons[0].whatYouDisagreeWith).first()).toBeVisible();
    await expect(page.getByText(reasons[0].reasonForAppealing).first()).toBeVisible();

    // Now Change the reason a different answer.
    await page.getByText(reasonForAppealingChange).first().click();
    await page.waitForURL(`**/${paths.reasonsForAppealing.reasonForAppealing}`);
    await expect(page.locator('#items-0').first()).toBeVisible();

    await addAReasonForAppealing(page, language, `#items-0 ${whatYouDisagreeWithField}-0`, `#items-0 ${reasonForAppealingField}-0`, {
      whatYouDisagreeWith: '',
      reasonForAppealing: ''
    });
    await page.getByText(commonContent.continue).first().click();
    await expect(page.locator('#error-summary-title').first()).toBeVisible();
    await addAReasonForAppealing(page, language, `#items-0 ${whatYouDisagreeWithField}-0`, `#items-0 ${reasonForAppealingField}-0`, reasons[2]);
    await page.getByText(commonContent.continue).first().click();
    await page.getByText(commonContent.continue).first().click();
    await expect(page.getByText(reasons[0].whatYouDisagreeWith)).not.toBeVisible();
    await expect(page.getByText(reasons[0].reasonForAppealing)).not.toBeVisible();
    await expect(page.getByText(reasons[2].whatYouDisagreeWith).first()).toBeVisible();
    await expect(page.getByText(reasons[2].reasonForAppealing).first()).toBeVisible();
  });
});
