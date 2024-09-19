const paths = require('paths');

const language = 'en';
const cookieContent = require('./cookie-content');
const assert = require('assert');
const { test, expect } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');

test.describe(`${language.toUpperCase()} - Cookie banner UI tests @fullFunctional`, () => {
  test.beforeEach('Initial navigation', async({ page }) => {
    await createTheSession(page, language);
    await page.goto(paths.start.benefitType);
  });

  test.afterEach('Close down', async({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - PIP verify cookies banner Element`, async({
    page
  }) => {
    await page.waitForTimeout(1000);
    await expect(page.getByText(cookieContent.bannerTitle).first()).toBeVisible();
    await expect(page.locator('.govuk-cookie-banner').first()).toBeVisible();

    await expect(page.getByText(cookieContent.acceptCookie).first()).toBeVisible();
    await expect(page.getByText(cookieContent.rejectCookie).first()).toBeVisible();

    await page.getByText(cookieContent.viewPolicy).first().click();
    await expect(page.getByText(cookieContent.policy.title).first()).toBeVisible();
    await expect(
      page.getByText(cookieContent.policy.selectCookieOptions)
    ).toBeVisible();
  });

  test(`${language.toUpperCase()} - PIP accept additional cookies`, async({
    page
  }) => {
    await page.waitForTimeout(1000);
    await page.getByText(cookieContent.acceptCookie).first().click();
    await expect(page.getByText(cookieContent.hideAfterAccept).first()).toBeVisible();
    await expect(page.getByText(cookieContent.hideMessage).first()).toBeVisible();
    await page.reload();
    await page.waitForTimeout(1000);
    let cookies = await page.context().cookies();
    cookies = cookies.map(cookie => cookie.name);
    assert(cookies.includes('_ga'));
    assert(cookies.includes('_gid'));
    assert(cookies.includes('_gat_UA-91309785-5'));
  });

  test(`${language.toUpperCase()} - PIP reject additional cookies`, async({
    page
  }) => {
    await page.waitForTimeout(1000);
    await page.getByText(cookieContent.rejectCookie).first().click();
    await expect(page.getByText(cookieContent.hideAfterReject).first()).toBeVisible();
    await expect(page.getByText(cookieContent.hideMessage).first()).toBeVisible();
    await page.reload();
    await page.waitForTimeout(2000);
  });

  test(`${language.toUpperCase()} - PIP accept cookies using the new cookie policy page`, async({
    page
  }) => {
    await page.waitForTimeout(1000);
    await page.getByText(cookieContent.acceptCookie).first().click();
    await expect(page.getByText(cookieContent.hideAfterAccept).first()).toBeVisible();
    await expect(page.getByText(cookieContent.hideMessage).first()).toBeVisible();
    await page.reload();

    let cookies = await page.context().cookies();
    cookies = cookies.map(cookie => cookie.name);
    assert(cookies.includes('_ga'));
    assert(cookies.includes('_gid'));
    assert(cookies.includes('_gat_UA-91309785-5'));

    await page.goto(paths.policy.cookies);
    await expect(
      page.locator('input#radio-analytics-on:checked').first()
    ).toBeVisible();
    await page.waitForTimeout(1000);
    await page.getByText('input#radio-analytics-off').first().click();
    await page.getByText('Save').first().click();

    await page.goto(paths.start.benefitType);
    await page.reload();
    await page.waitForTimeout(2000);
  });
});
