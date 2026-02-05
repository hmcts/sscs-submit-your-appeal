const language = 'cy';
const commonContent = require('commonContent')[language];
const datesCantAttendContent = require(
  `steps/hearing/dates-cant-attend/content.${language}`
);
const paths = require('paths');
const moment = require('moment');
const DateUtils = require('utils/DateUtils');

moment().locale(language);
const validDate = DateUtils.getRandomWeekDayFromDate(moment().add(5, 'weeks'));
const additionalValidDate = DateUtils.getRandomWeekDayFromDate(
  moment().add(10, 'weeks')
);

const { test, expect } = require('@playwright/test');
const {
  createTheSession
} = require('../../page-objects/session/createSession');
const { endTheSession } = require('../../page-objects/session/endSession');
const {
  enterDateCantAttendAndContinue,
  seeFormattedDate,
  dontSeeFormattedDate
} = require('../../page-objects/hearing/datesCantAttend');
const { enterADateAndContinue } = require('../../page-objects/controls/date');

test.describe(
  `${language.toUpperCase()} - Dates can't attend`,
  { tag: '@batch-08' },
  () => {
    test.beforeEach(async ({ page }) => {
      await createTheSession(page, language);
      await page.goto(paths.hearing.datesCantAttend);
      await page.turnOffJsAndReloadThePage();
    });

    test.afterEach('End session', async ({ page }) => {
      await endTheSession(page);
    });

    test(`${language.toUpperCase()} - When page go to the page and there are no dates page see the Add date link`, async ({
      page
    }) => {
      await expect(
        page.getByText(datesCantAttendContent.noDates).first()
      ).toBeVisible();
      await expect(
        page.getByText(datesCantAttendContent.links.add).first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page click the Add date link, page go to the page where page can enter dates`, async ({
      page
    }) => {
      await expect(
        page.getByText(datesCantAttendContent.noDates).first()
      ).toBeVisible();
      await page.getByText(datesCantAttendContent.links.add).first().click();
      await expect(
        page
          .getByText(datesCantAttendContent.fields.cantAttendDate.legend)
          .first()
      ).toBeVisible();
      await expect(page.locator('input[name*="day"]').first()).toBeVisible();
      await expect(page.locator('input[name*="month"]').first()).toBeVisible();
      await expect(page.locator('input[name*="year"]').first()).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page add a date page see the date in the list`, async ({
      page
    }) => {
      await enterDateCantAttendAndContinue(
        page,
        commonContent,
        validDate,
        datesCantAttendContent.links.add
      );
      await seeFormattedDate(page, validDate);
    });

    test(`${language.toUpperCase()} - When page add a date page see the add another date link`, async ({
      page
    }) => {
      await enterDateCantAttendAndContinue(
        page,
        commonContent,
        validDate,
        datesCantAttendContent.links.add
      );
      await expect(
        page.getByText(datesCantAttendContent.links.addAnother).first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page add multiple dates, page see them in the list`, async ({
      page
    }) => {
      await enterDateCantAttendAndContinue(
        page,
        commonContent,
        validDate,
        datesCantAttendContent.links.add
      );
      await enterDateCantAttendAndContinue(
        page,
        commonContent,
        additionalValidDate,
        datesCantAttendContent.links.addAnother
      );
      await seeFormattedDate(page, validDate);
      await seeFormattedDate(page, additionalValidDate);
    });

    test(`${language.toUpperCase()} - When page add a date and click the delete link, the date is removed`, async ({
      page
    }) => {
      await enterDateCantAttendAndContinue(
        page,
        commonContent,
        validDate,
        datesCantAttendContent.links.add
      );
      await seeFormattedDate(page, validDate);
      await page.getByText(commonContent.delete).first().click();
      await dontSeeFormattedDate(page, validDate);
    });

    test(`${language.toUpperCase()} - page add a single date, page remove it, page see Add date`, async ({
      page
    }) => {
      await enterDateCantAttendAndContinue(
        page,
        commonContent,
        validDate,
        datesCantAttendContent.links.add
      );
      await expect(
        page.getByText(datesCantAttendContent.links.addAnother).first()
      ).toBeVisible();
      await page.getByText(commonContent.delete).first().click();
      await expect(
        page.getByText(datesCantAttendContent.links.addAnother).first()
      ).toBeHidden();
      await expect(
        page.getByText(datesCantAttendContent.links.add).first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page click Continue without add a date, page see errors`, async ({
      page
    }) => {
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await expect(
        page.getByText(datesCantAttendContent.noDates).first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page add a date and the edit it, page see the new date`, async ({
      page
    }) => {
      await enterDateCantAttendAndContinue(
        page,
        commonContent,
        validDate,
        datesCantAttendContent.links.add
      );
      await seeFormattedDate(page, validDate);
      await enterDateCantAttendAndContinue(
        page,
        commonContent,
        additionalValidDate,
        commonContent.edit
      );
      await dontSeeFormattedDate(page, validDate);
      await seeFormattedDate(page, additionalValidDate);
    });

    test(`${language.toUpperCase()} - When page click Continue without filling in the date fields, page see errors`, async ({
      page
    }) => {
      await page.getByText(datesCantAttendContent.links.add).first().click();
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await expect(
        page
          .getByText(
            datesCantAttendContent.fields.cantAttendDate.error.allRequired
          )
          .first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page click Continue when only entering the day field, page see errors`, async ({
      page
    }) => {
      await page.getByText(datesCantAttendContent.links.add).first().click();
      await page
        .locator('input[name*="day"]')
        .first()
        .fill(validDate.date().toString());
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await expect(
        page
          .getByText(
            datesCantAttendContent.fields.cantAttendDate.error.monthRequired
          )
          .first()
      ).toBeVisible();
      await expect(
        page
          .getByText(
            datesCantAttendContent.fields.cantAttendDate.error.yearRequired
          )
          .first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page click Continue when only entering the month field, page see errors`, async ({
      page
    }) => {
      await page.getByText(datesCantAttendContent.links.add).first().click();
      await page
        .locator('input[name*="month"]')
        .first()
        .fill((validDate.month() + 1).toString());
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await expect(
        page
          .getByText(
            datesCantAttendContent.fields.cantAttendDate.error.dayRequired
          )
          .first()
      ).toBeVisible();
      await expect(
        page
          .getByText(
            datesCantAttendContent.fields.cantAttendDate.error.yearRequired
          )
          .first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page click Continue when only entering the year field, page see errors`, async ({
      page
    }) => {
      await page.getByText(datesCantAttendContent.links.add).first().click();
      await page
        .locator('input[name*="year"]')
        .first()
        .fill(validDate.year().toString());
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await expect(
        page
          .getByText(
            datesCantAttendContent.fields.cantAttendDate.error.dayRequired
          )
          .first()
      ).toBeVisible();
      await expect(
        page
          .getByText(
            datesCantAttendContent.fields.cantAttendDate.error.monthRequired
          )
          .first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page enter a date that is under four weeks from now, page see errors`, async ({
      page
    }) => {
      const dateUnderFourWeeks = moment();
      await enterDateCantAttendAndContinue(
        page,
        commonContent,
        dateUnderFourWeeks,
        datesCantAttendContent.links.add
      );
      await expect(
        page
          .getByText(
            datesCantAttendContent.fields.cantAttendDate.error.underFourWeeks
          )
          .first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - When page enter a date that is over twenty two weeks from now, page see errors`, async ({
      page
    }) => {
      const dateOverTwentyTwoWeeks = moment().add(23, 'weeks');
      await enterDateCantAttendAndContinue(
        page,
        commonContent,
        dateOverTwentyTwoWeeks,
        datesCantAttendContent.links.add
      );
      await expect(
        page
          .getByText(
            datesCantAttendContent.fields.cantAttendDate.error
              .overTwentyTwoWeeks
          )
          .first()
      ).toBeVisible();
    });

    test(`${language.toUpperCase()} - page enter a date page cant attend with the long name of month`, async ({
      page
    }) => {
      const month = DateUtils.formatDate(validDate, 'MMMM');
      await page.getByText(datesCantAttendContent.links.add).first().click();
      await enterADateAndContinue(
        validDate.date().toString(),
        month,
        validDate.year().toString(page)
      );
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await expect(page).toHaveURL(paths.checkYourAppeal);
    });

    test(`${language.toUpperCase()} - page enter a date page cant attend with the short name of month`, async ({
      page
    }) => {
      const month = DateUtils.formatDate(validDate, 'MMM');
      await page.getByText(datesCantAttendContent.links.add).first().click();
      await enterADateAndContinue(
        validDate.date().toString(),
        month,
        validDate.year().toString(page)
      );
      await page
        .getByRole('button', { name: commonContent.continue })
        .first()
        .click();
      await expect(page).toHaveURL(paths.checkYourAppeal);
    });

    test(`${language.toUpperCase()} - page enter a date page cant attend with an invalid name of month`, async ({
      page
    }) => {
      await page.getByText(datesCantAttendContent.links.add).first().click();
      await enterADateAndContinue(
        validDate.date().toString(),
        'invalidMonth',
        validDate.year().toString(page)
      );
      await expect(
        page
          .getByText(datesCantAttendContent.fields.cantAttendDate.error.invalid)
          .first()
      ).toBeVisible();
    });
  }
);
