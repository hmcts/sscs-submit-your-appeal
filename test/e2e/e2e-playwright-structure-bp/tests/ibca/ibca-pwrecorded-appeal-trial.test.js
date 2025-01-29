import { test, expect } from '@playwright/test';
import { PageFactory } from '../../factory/pageFactory';


test('test', { tag: '@ibca-smoke' }, async ({ page }) => {
  const language = 'en';
  const ibcaPages = await PageFactory.getAllPages(page);

  //Choose Language
  await ibcaPages.languagePreferencePage.chooseLanguage('english');

  //Agree to independent tribunal
  await expect(page.locator('h1')).toContainText('Your appeal will be decided by an independent tribunal');
  await expect(page.locator('form')).toContainText('The tribunal is separate from Infected Blood Compensation Authority (IBCA).');
  await ibcaPages.independencePage.submitPage();

  // Create account page
  await expect(page.locator('h1')).toContainText('Do you want to be able to save this appeal later?');
  await ibcaPages.createAccountPage.saveForLater(false);

  //Review decision notice page
  await expect(page.locator('h1')).toContainText('Have you got a Review Decision Notice?');
  await expect(page.locator('form')).toContainText('This is the letter IBCA sent you if you asked them to reconsider their decision about the Infected Blood Compensation.');
  await ibcaPages.reviewDecisionNoticePage.reviewDecisionNotice(true);

  //Enter RefNum
  await expect(page.locator('h1')).toContainText('Enter your IBCA Reference number');
  await expect(page.locator('form')).toContainText('You can find your IBCA Reference number on your Review Decision Notice.');
  await ibcaPages.ibcaRefNumPage.enterReferenceNumber('A12B34');

  //Enter RefDate
  await expect(page.locator('#main-content')).toContainText('When is your Review Decision Notice dated?');
  await ibcaPages.ibcaReferenceDatePage.enterDate(language);

  //Enter Appellant data
  await expect(page.locator('h1')).toContainText('What is your role in this appeal?');
  await ibcaPages.enterAppellantRolePage.appellantRole('I am appealing for myself');

  await expect(page.locator('h1')).toContainText('Enter your name');
  await ibcaPages.enterAppellantNamePage.appellantName('ibcaFirstname', 'ibcaLastname');

  await expect(page.locator('h1')).toContainText('Enter your date of birth');
  await ibcaPages.appellantDobPage.enterDate(language);

  await expect(page.locator('h1')).toContainText('Do you live in England, Scotland or Wales?');
  await ibcaPages.appellantInMainlandUkPage.isInCountry(true);

  //ToDo : Get this into pageobject
  await ibcaPages.appellantContactDetailsPage.enterContactDetails(); //ToDo : Send values

  await expect(page.locator('h1')).toContainText('Do you want to receive text message notifications?');
  await ibcaPages.appellantTextRemindersPage.receiveTextMessageNotifications(false);

  await expect(page.locator('h1')).toContainText('Do you want to register a representative?');
  await ibcaPages.representativePage.requireLegalRep(false);

  await ibcaPages.reasonsForAppealPage.reasonsForAppealInfo('disagreement-ibca', 'reasons to disagree ibca');

  await ibcaPages.otherReasonsForAppealPage.otherReasons('no additional comments');

  await expect(page.locator('h1')).toContainText('Evidence to support your appeal');
  await ibcaPages.evidenceProvidePage.isEvidenceRequired(false);

  await ibcaPages.theHearingPage.preferHearing(false);

  await ibcaPages.checkYourAppealPage.checkYourAppeal('appellant-ibca-firstname-lastname');

  await expect(page.locator('h1')).toContainText('Your appeal has been submitted');
  await expect(page.locator('#main-content')).toContainText('IBCA will be notified that you want to appeal against their decision. You’ll be told the next steps when IBCA have responded.');
  await expect(page.locator('#main-content')).toContainText('If you’ve signed up for emails or SMS and have chosen to attend a hearing, then you’ll get a message within 3 working days with a link so you can track your appeal online.');
});