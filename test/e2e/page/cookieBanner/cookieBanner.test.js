const paths = require('paths');
const assert = require('assert');

const language = 'en';
const cookieContent = require('./cookie-content');

const { test, expect } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(`${language.toUpperCase()} - Cookie banner UI tests @fullFunctional`, () => {
  test.beforeEach('Create session', async ({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.start.benefitType);
  });

  test.afterEach('End session', async ({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - PIP verify cookies banner Element`, async ({
    page
  }) => {
    await expect(
      page.getByText(cookieContent.bannerTitle).first()
    ).toBeVisible();
    await expect(page.locator('.govuk-cookie-banner').first()).toBeVisible();

    await expect(
      page.getByText(cookieContent.acceptCookie).first()
    ).toBeVisible();
    await expect(
      page.getByText(cookieContent.rejectCookie).first()
    ).toBeVisible();

    await page.getByText(cookieContent.viewPolicy).first().click();
    await expect(
      page.getByText(cookieContent.policy.title).first()
    ).toBeVisible();
    await expect(
      page.getByText(cookieContent.policy.selectCookieOptions).first()
    ).toBeVisible();
  });

  test(`${language.toUpperCase()} - PIP accept additional cookies`, async ({
    page,
    browser
  }) => {
    await page.getByText(cookieContent.acceptCookie).first().click();
    await expect(
      page.getByText(cookieContent.hideAfterAccept).first()
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: cookieContent.hideMessage }).first()
    ).toBeVisible();
    await page.reload();
    const cookies = await browser.contexts()[0].cookies();
    const cookieNames = cookies.map((cookie) => cookie.name);
    assert(cookieNames.includes('_ga'));
    assert(!cookieNames.includes('_gid'));
    assert(!cookieNames.includes('_gat_UA-91309785-5'));
  });

  test(`${language.toUpperCase()} - PIP reject additional cookies`, async ({
    page
  }) => {
    await page.getByText(cookieContent.rejectCookie).first().click();
    await expect(
      page.getByText(cookieContent.hideAfterReject).first()
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: cookieContent.hideMessage }).first()
    ).toBeVisible();
  });

  test(`${language.toUpperCase()} - PIP accept cookies using the new cookie policy page`, async ({
    page,
    browser
  }) => {
    await page.getByText(cookieContent.acceptCookie).first().click();
    await expect(
      page.getByText(cookieContent.hideAfterAccept).first()
    ).toBeVisible();
    await expect(
      page.getByRole('button', { name: cookieContent.hideMessage }).first()
    ).toBeVisible();
    await page.reload();

    const cookies = await browser.contexts()[0].cookies();
    const cookieNames = cookies.map((cookie) => cookie.name);
    assert(cookieNames.includes('_ga'));
    assert(!cookieNames.includes('_gid'));
    assert(!cookieNames.includes('_gat_UA-91309785-5'));

    await page.goto(paths.policy.cookies);
    await expect(
      page.locator('input#radio-analytics-on:checked').first()
    ).toBeVisible();
    await page.locator('input#radio-analytics-off').first().click();
    await page.getByRole('button', { name: 'Save' }).first().click();

    await page.goto(paths.start.benefitType);
    await page.reload();
  });
});
