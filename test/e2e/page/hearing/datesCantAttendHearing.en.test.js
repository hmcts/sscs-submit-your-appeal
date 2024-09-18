const language = 'en';
const commonContent = require('commonContent')[language];
const datesCantAttendContent = require(`steps/hearing/dates-cant-attend/content.${language}`);
const paths = require('paths');
const moment = require('moment');
const DateUtils = require('utils/DateUtils');

moment().locale(language);
const validDate = DateUtils.getRandomWeekDayFromDate(moment().add(5, 'weeks'));
const additionalValidDate = DateUtils.getRandomWeekDayFromDate(moment().add(10, 'weeks'));

const { test } = require('@playwright/test');
test.describe(`${language.toUpperCase()} - Dates can't attend @batch-08`, () => {
  Before(async ({ page }) => {
    await createTheSession(page, language);
    page.goto(paths.hearing.datesCantAttend);
    // await page.turnOffJsAndReloadThePage();
  });

  After(async ({ page }) => {
    await endTheSession(page);
  });

  test(`${language.toUpperCase()} - When I go to the page and there are no dates I see the Add date link`, ({ page }) => {
    expect(page.getByText(datesCantAttendContent.noDates)).toBeVisible();
    expect(page.getByText(datesCantAttendContent.links.add)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click the Add date link, I go to the page where I can enter dates`, ({
    page,
  }) => {
    expect(page.getByText(datesCantAttendContent.noDates)).toBeVisible();
    await page.click(datesCantAttendContent.links.add);
    expect(page.getByText(datesCantAttendContent.fields.cantAttendDate.legend)).toBeVisible();
    page.seeElement('input[name*="day"]');
    page.seeElement('input[name*="month"]');
    page.seeElement('input[name*="year"]');
  });

  test(`${language.toUpperCase()} - When I add a date I see the date in the list`, ({ page }) => {
    enterDateCantAttendAndContinue(page, commonContent, validDate, datesCantAttendContent.links.add);
    page.seeFormattedDate(validDate);
  });

  test(`${language.toUpperCase()} - When I add a date I see the add another date link`, ({ page }) => {
    enterDateCantAttendAndContinue(page, commonContent, validDate, datesCantAttendContent.links.add);
    expect(page.getByText(datesCantAttendContent.links.addAnother)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I add multiple dates, I see them in the list`, ({ page }) => {
    enterDateCantAttendAndContinue(page, commonContent, validDate, datesCantAttendContent.links.add);
    enterDateCantAttendAndContinue(page, commonContent, additionalValidDate, datesCantAttendContent.links.addAnother);
    page.seeFormattedDate(validDate);
    page.seeFormattedDate(additionalValidDate);
  });

  test(`${language.toUpperCase()} - When I add a date and click the delete link, the date is removed`, ({ page }) => {
    enterDateCantAttendAndContinue(page, commonContent, validDate, datesCantAttendContent.links.add);
    page.seeFormattedDate(validDate);
    await page.click(commonContent.delete);
    page.dontSeeFormattedDate(validDate);
  });

  test(`${language.toUpperCase()} - I add a single date, I remove it, I see Add date`, ({ page }) => {
    enterDateCantAttendAndContinue(page, commonContent, validDate, datesCantAttendContent.links.add);
    expect(page.getByText(datesCantAttendContent.links.addAnother)).toBeVisible();
    await page.click(commonContent.delete);
    page.dontSee(datesCantAttendContent.links.addAnother);
    expect(page.getByText(datesCantAttendContent.links.add)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click Continue without add a date, I see errors`, ({ page }) => {
    await page.click(commonContent.continue);
    expect(page.getByText(datesCantAttendContent.noDates)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I add a date and the edit it, I see the new date`, ({ page }) => {
    enterDateCantAttendAndContinue(page, commonContent, validDate, datesCantAttendContent.links.add);
    page.seeFormattedDate(validDate);
    enterDateCantAttendAndContinue(page, commonContent, additionalValidDate, commonContent.edit);
    page.dontSeeFormattedDate(validDate);
    page.seeFormattedDate(additionalValidDate);
  });

  test(`${language.toUpperCase()} - When I click Continue without filling in the date fields, I see errors`, ({
    page,
  }) => {
    await page.click(datesCantAttendContent.links.add);
    await page.click(commonContent.continue);
    expect(page.getByText(datesCantAttendContent.fields.cantAttendDate.error.allRequired)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click Continue when only entering the day field, I see errors`, ({ page }) => {
    await page.click(datesCantAttendContent.links.add);
    await page.fill('input[name*="day"]', validDate.date().toString());
    await page.click(commonContent.continue);
    expect(page.getByText(datesCantAttendContent.fields.cantAttendDate.error.monthRequired)).toBeVisible();
    expect(page.getByText(datesCantAttendContent.fields.cantAttendDate.error.yearRequired)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click Continue when only entering the month field, I see errors`, ({
    page,
  }) => {
    await page.click(datesCantAttendContent.links.add);
    await page.fill('input[name*="month"]', (validDate.month() + 1).toString());
    await page.click(commonContent.continue);
    expect(page.getByText(datesCantAttendContent.fields.cantAttendDate.error.dayRequired)).toBeVisible();
    expect(page.getByText(datesCantAttendContent.fields.cantAttendDate.error.yearRequired)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I click Continue when only entering the year field, I see errors`, ({ page }) => {
    await page.click(datesCantAttendContent.links.add);
    await page.fill('input[name*="year"]', validDate.year().toString());
    await page.click(commonContent.continue);
    expect(page.getByText(datesCantAttendContent.fields.cantAttendDate.error.dayRequired)).toBeVisible();
    expect(page.getByText(datesCantAttendContent.fields.cantAttendDate.error.monthRequired)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I enter a date that is under four weeks from now, I see errors`, ({ page }) => {
    const dateUnderFourWeeks = moment();
    enterDateCantAttendAndContinue(page, commonContent, dateUnderFourWeeks, datesCantAttendContent.links.add);
    expect(page.getByText(datesCantAttendContent.fields.cantAttendDate.error.underFourWeeks)).toBeVisible();
  });

  test(`${language.toUpperCase()} - When I enter a date that is over twenty two weeks from now, I see errors`, ({
    page,
  }) => {
    const dateOverTwentyTwoWeeks = moment().add(23, 'weeks');
    enterDateCantAttendAndContinue(page, commonContent, dateOverTwentyTwoWeeks, datesCantAttendContent.links.add);
    expect(page.getByText(datesCantAttendContent.fields.cantAttendDate.error.overTwentyTwoWeeks)).toBeVisible();
  });

  test(`${language.toUpperCase()} - I enter a date I cant attend with the long name of month`, ({ page }) => {
    const month = DateUtils.formatDate(validDate, 'MMMM');
    await page.click(datesCantAttendContent.links.add);
    enterADateAndContinue(validDate.date().toString(), month, validDate.year().toString(page, ));
    await page.click(commonContent.continue);
    page.seeCurrentUrlEquals(paths.checkYourAppeal);
  });

  test(`${language.toUpperCase()} - I enter a date I cant attend with the short name of month`, ({ page }) => {
    const month = DateUtils.formatDate(validDate, 'MMM');
    await page.click(datesCantAttendContent.links.add);
    enterADateAndContinue(validDate.date().toString(), month, validDate.year().toString(page, ));
    await page.click(commonContent.continue);
    page.seeCurrentUrlEquals(paths.checkYourAppeal);
  });

  test(`${language.toUpperCase()} - I enter a date I cant attend with an invalid name of month`, ({ page }) => {
    await page.click(datesCantAttendContent.links.add);
    enterADateAndContinue(validDate.date().toString(), 'invalidMonth', validDate.year().toString(page, ));
    expect(page.getByText(datesCantAttendContent.fields.cantAttendDate.error.invalid)).toBeVisible();
  });
});
