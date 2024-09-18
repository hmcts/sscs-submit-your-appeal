const paths = require('paths');

const language = 'en';
const cookieContent = require('./cookie-content');

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - Cookie banner UI tests @fullFunctional`, () => {
  Before(async ({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.start.benefitType);
  });

  After(async ({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - PIP verify cookies banner Element`, ({ page }) => {
    await page.waitForTimeout(1);
    expect(page.getByText(cookieContent.bannerTitle)).toBeVisible();
    page.seeElement('.govuk-cookie-banner');

    expect(page.getByText(cookieContent.acceptCookie)).toBeVisible();
    expect(page.getByText(cookieContent.rejectCookie)).toBeVisible();

    await page.click(cookieContent.viewPolicy);
    expect(page.getByText(cookieContent.policy.title)).toBeVisible();
    expect(page.getByText(cookieContent.policy.selectCookieOptions)).toBeVisible();
  });

  test(`${language.toUpperCase()} - PIP accept additional cookies`, ({ page }) => {
    await page.waitForTimeout(1);
    await page.click(cookieContent.acceptCookie);
    expect(page.getByText(cookieContent.hideAfterAccept)).toBeVisible();
    expect(page.getByText(cookieContent.hideMessage)).toBeVisible();
    page.refreshPage();
    await page.waitForTimeout(1);
    page.seeCookie('_ga');
    page.seeCookie('_gid');
    page.seeCookie('_gat_UA-91309785-5');
  });

  test(`${language.toUpperCase()} - PIP reject additional cookies`, ({ page }) => {
    await page.waitForTimeout(1);
    await page.click(cookieContent.rejectCookie);
    expect(page.getByText(cookieContent.hideAfterReject)).toBeVisible();
    expect(page.getByText(cookieContent.hideMessage)).toBeVisible();
    page.refreshPage();
    await page.waitForTimeout(2);
  });

  test(`${language.toUpperCase()} - PIP accept cookies using the new cookie policy page`, ({ page }) => {
    await page.waitForTimeout(1);
    await page.click(cookieContent.acceptCookie);
    expect(page.getByText(cookieContent.hideAfterAccept)).toBeVisible();
    expect(page.getByText(cookieContent.hideMessage)).toBeVisible();
    page.refreshPage();

    page.seeCookie('_ga');
    page.seeCookie('_gid');
    page.seeCookie('_gat_UA-91309785-5');

    page.goto(paths.policy.cookies);
    page.seeElement('input#radio-analytics-on:checked');
    await page.waitForTimeout(1);
    await page.click('input#radio-analytics-off');
    await page.click('Save');

    page.goto(paths.start.benefitType);
    page.refreshPage();
    await page.waitForTimeout(2);
  });
});
