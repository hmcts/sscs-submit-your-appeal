/* eslint-disable no-await-in-loop */
const language = 'cy';
const commonContent = require('commonContent')[language];
const reasonForAppealingContent = require(`steps/reasons-for-appealing/reason-for-appealing/content.${language}`);
const paths = require('paths');
const reasons = require('test/e2e/data.en').reasonsForAppealing.reasons;

const assert = require('assert');

const whatYouDisagreeWithField = '#item\\.whatYouDisagreeWith';
const reasonForAppealingField = '#item\\.reasonForAppealing';

const { test, expect } = require('@playwright/test');
const { createTheSession } = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const { addAReasonForAppealing, addAReasonForAppealingAndThenClickAddAnother } = require('../../page-objects/reasons-for-appealing/reasonForAppealingOnePageForm');

test.describe(`${language.toUpperCase()} - Reason For Appealing One Page Form`, { tag: '@batch-10' }, () => {
  test.beforeEach('Create session', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.reasonsForAppealing.reasonForAppealing);
    await expect(page.locator('#items-0')).toBeVisible();
  });

  test.afterEach('End session', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When page go to the page page see two input fields`, async({ page }) => {
    await expect(page.locator(`#items-0 ${whatYouDisagreeWithField}-0`).first()).toBeVisible();
    await expect(page.locator(`#items-0 ${reasonForAppealingField}-0`).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When page click Continue without adding a reason, page see errors`, async({ page }) => {
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(reasonForAppealingContent.listError).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When page click add Another page see new fields`, async({ page }) => {
    await page.getByText('Add reason').first().click();
    await expect(page.locator(`#items-1 ${whatYouDisagreeWithField}-1`).first()).toBeVisible();
    await expect(page.locator(`#items-1 ${reasonForAppealingField}-1`).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When page enter one character in each field and click Continue, page see errors`, async({ page }) => {
    await addAReasonForAppealing(page, language, `${whatYouDisagreeWithField}-0`, `${reasonForAppealingField}-0`, {
      whatYouDisagreeWith: 'a',
      reasonForAppealing: 'a'
    });
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.getByText(reasonForAppealingContent.fields.whatYouDisagreeWith.error.notEnough).first()).toBeVisible();
    await expect(page.getByText(reasonForAppealingContent.fields.reasonForAppealing.error.notEnough).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When page enter special chars then page see no errors`, async({ page }) => {
    await addAReasonForAppealing(page, language, `${whatYouDisagreeWithField}-0`, `${reasonForAppealingField}-0`, {
      whatYouDisagreeWith: 'aaaa&$%^&%!~$^&&&*',
      reasonForAppealing: 'aaaa&$%^&%!~$^&&&*'
    });
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await page.waitForURL(`**${paths.reasonsForAppealing.otherReasonForAppealing}`);
  });

  test(`${language.toUpperCase()} - When page add multiple reasons and click Continue page am taken to /other-reason-for-appealing`, async({ page }) => {
    await addAReasonForAppealingAndThenClickAddAnother(page,
      `#items-0 ${whatYouDisagreeWithField}-0`,
      `#items-0 ${reasonForAppealingField}-0`,
      reasons[0]
    );
    await addAReasonForAppealingAndThenClickAddAnother(page,
      `#items-1 ${whatYouDisagreeWithField}-1`,
      `#items-1 ${reasonForAppealingField}-1`,
      reasons[1]
    );
    await addAReasonForAppealing(page,
      language,
      `#items-2 ${whatYouDisagreeWithField}-2`,
      `#items-2 ${reasonForAppealingField}-2`,
      reasons[2]
    );
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await page.waitForURL(`**${paths.reasonsForAppealing.otherReasonForAppealing}`);
  });

  test(`${language.toUpperCase()} - When page go to add another reason and then click Continue without entering any data, page see no errors and am taken to /other-reason-for-appealing`,
    async({ page }) => {
      await addAReasonForAppealing(
        page,
        language,
        `#items-0 ${whatYouDisagreeWithField}-0`,
        `#items-0 ${reasonForAppealingField}-0`,
        reasons[0]
      );
      await page.getByText('Add reason').first().click();
      await page.getByRole('button', { name: commonContent.continue }).first().click();
      await page.waitForURL(`**${paths.reasonsForAppealing.otherReasonForAppealing}`);
    });

  test(`${language.toUpperCase()} - When page click add Reason multiple times and click Continue without entering any data, page see an error in the error summary`, async({ page }) => {
    for (let count = 1; count < 5; count++) {
      await page.getByText('Add reason').first().click();
    }
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await expect(page.locator('.govuk-error-summary__list').first()).toBeVisible();
    assert((await page.locator('.govuk-error-summary__list li').all()).length === 1);
    await expect(page.getByText(reasonForAppealingContent.listError).first()).toBeVisible();
  });

  test(`${language.toUpperCase()} - When page add a reasons then click the add another reason button and enter the least amount of data, page see error`, async({ page }) => {
    await addAReasonForAppealing(page,
      language,
      `#items-0 ${whatYouDisagreeWithField}-0`,
      `#items-0 ${reasonForAppealingField}-0`,
      reasons[0]
    );
    await page.getByText('Add reason').first().click();
    await addAReasonForAppealing(page,
      language,
      `#items-1 ${whatYouDisagreeWithField}-1`,
      `#items-1 ${reasonForAppealingField}-1`,
      {
        whatYouDisagreeWith: 'a',
        reasonForAppealing: 'a'
      }
    );
    await page.getByRole('button', { name: commonContent.continue }).first().click();
    await page.hasErrorClass('#items-1');
    await expect(page.getByText(reasonForAppealingContent.fields.whatYouDisagreeWith.error.notEnough).first()).toBeVisible();
    await expect(page.getByText(reasonForAppealingContent.fields.reasonForAppealing.error.notEnough).first()).toBeVisible();
  });
});
