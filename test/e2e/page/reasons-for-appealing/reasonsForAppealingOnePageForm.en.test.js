const language = 'en';
const commonContent = require('commonContent')[language];
const reasonForAppealingContent = require(`steps/reasons-for-appealing/reason-for-appealing/content.${language}`);
const paths = require('paths');
const reasons = require('test/e2e/data.en').reasonsForAppealing.reasons;

const whatYouDisagreeWithField = '#item\\.whatYouDisagreeWith';
const reasonForAppealingField = '#item\\.reasonForAppealing';

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - Reason For Appealing One Page Form @batch-10`, () => {

  Before(async ({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.reasonsForAppealing.reasonForAppealing);
    page.waitForElement('#items-0');
  });

  After(async ({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I go to the page I see two input fields`, ({ page }) => {
    page.seeElement(`#items-0 ${whatYouDisagreeWithField}-0`);
    page.seeElement(`#items-0 ${reasonForAppealingField}-0`);
  });

  test(`${language.toUpperCase()} - When I click Continue without adding a reason, I see errors`, ({ page }) => {
    await page.click(commonContent.continue);
    expect(page.getByText(reasonForAppealingContent.listError)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click add Another I see new fields`, ({ page }) => {
    await page.click('Add reason');
    page.seeElement(`#items-1 ${whatYouDisagreeWithField}-1`);
    page.seeElement(`#items-1 ${reasonForAppealingField}-1`);
  });

  test(`${language.toUpperCase()} - When I enter one character in each field and click Continue, I see errors`, ({
                                                                                                                   page,
                                                                                                                 }) => {
    page.addAReasonForAppealing(language, `${whatYouDisagreeWithField}-0`, `${reasonForAppealingField}-0`, {
      whatYouDisagreeWith: 'a',
      reasonForAppealing: 'a',
    });
    await page.click(commonContent.continue);
    expect(page.getByText(reasonForAppealingContent.fields.whatYouDisagreeWith.error.notEnough)).toBeVisible();
    expect(page.getByText(reasonForAppealingContent.fields.reasonForAppealing.error.notEnough)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I enter special chars then I see no errors`, ({ page }) => {
    page.addAReasonForAppealing(language, `${whatYouDisagreeWithField}-0`, `${reasonForAppealingField}-0`, {
      whatYouDisagreeWith: 'aaaa&$%^&%!~$^&&&*',
      reasonForAppealing: 'aaaa&$%^&%!~$^&&&*',
    });
    await page.click(commonContent.continue);
    page.seeInCurrentUrl(paths.reasonsForAppealing.otherReasonForAppealing);
  });

  test(`${language.toUpperCase()} - When I add multiple reasons and click Continue I am taken to /other-reason-for-appealing`, ({
                                                                                                                                  page,
                                                                                                                                }) => {
    addAReasonForAppealingAndThenClickAddAnother(page, 
      `#items-0 ${whatYouDisagreeWithField}-0`,
      `#items-0 ${reasonForAppealingField}-0`,
      reasons[0],
    );
    addAReasonForAppealingAndThenClickAddAnother(page, 
      `#items-1 ${whatYouDisagreeWithField}-1`,
      `#items-1 ${reasonForAppealingField}-1`,
      reasons[1],
    );
    addAReasonForAppealing(page, 
      language,
      `#items-2 ${whatYouDisagreeWithField}-2`,
      `#items-2 ${reasonForAppealingField}-2`,
      reasons[2],
    );
    await page.click(commonContent.continue);
    page.seeInCurrentUrl(paths.reasonsForAppealing.otherReasonForAppealing);
  });

  test(`${language.toUpperCase()} - When I go to add another reason and then click Continue without entering any data, I see no errors and am taken to /other-reason-for-appealing`, ({
                                                                                                                                                                                        page,
                                                                                                                                                                                      }) => {
    addAReasonForAppealing(page, 
      language,
      `#items-0 ${whatYouDisagreeWithField}-0`,
      `#items-0 ${reasonForAppealingField}-0`,
      reasons[0],
    );
    await page.click('Add reason');
    await page.click(commonContent.continue);
    page.seeInCurrentUrl(paths.reasonsForAppealing.otherReasonForAppealing);
  });

  test(`${language.toUpperCase()} - When I click add Reason multiple times and click Continue without entering any data, I see an error in the error summary`, async ({
                                                                                                                                                                        page,
                                                                                                                                                                      }) => {
    for (let i = 1; i < 5; i++) {
      await page.click('Add reason');
    }
    await page.click(commonContent.continue);
    page.seeElement('.govuk-error-summary__list');
    await page.seeNumberOfElements('.govuk-error-summary__list li', 1);
    expect(page.getByText(reasonForAppealingContent.listError)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I add a reasons then click the add another reason button and enter the least amount of data, I see error`, async ({
                                                                                                                                                             page,
                                                                                                                                                           }) => {
    addAReasonForAppealing(page, 
      language,
      `#items-0 ${whatYouDisagreeWithField}-0`,
      `#items-0 ${reasonForAppealingField}-0`,
      reasons[0],
    );
    await page.click('Add reason');
    addAReasonForAppealing(page, 
      language,
      `#items-1 ${whatYouDisagreeWithField}-1`,
      `#items-1 ${reasonForAppealingField}-1`,
      {
        whatYouDisagreeWith: 'a',
        reasonForAppealing: 'a',
      },
    );
    await page.click(commonContent.continue);
    await page.hasErrorClass('#items-1');
    expect(page.getByText(reasonForAppealingContent.fields.whatYouDisagreeWith.error.notEnough)).toBeVisible();
    expect(page.getByText(reasonForAppealingContent.fields.reasonForAppealing.error.notEnough)).toBeVisible();
  });
})