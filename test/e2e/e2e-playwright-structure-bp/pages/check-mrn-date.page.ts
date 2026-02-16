import { BasePage } from './ibca-base.page';
import { expect } from '@playwright/test';

export class IbcaReferenceLateDatePage extends BasePage {
  defaultPageContent: any = {
    heading: 'Double check the date you entered',
    bodyContents: [
      'Your appeal may be late. Just check you entered the date from the top right of your Review Decision Notice.',
      'Did you enter the date from the top right of your Review Decision Notice?'
    ]
  };

  async isDateRight(option: boolean) {
    option
      ? await this.page
          .getByText(
            'Yes, I entered the date from the top right of my Review Decision Notice'
          )
          .click()
      : await this.page.getByText('No, I entered a different date').click();
    await this.submitPage();
  }
}

export class IbcaReferenceLateDateReasonPage extends BasePage {
  predatedOneMonthPageContent: any = {
    heading: 'Tell us why your appeal is late',
    bodyContents: [
      'Appeals should be made within one month of the Review Decision Notice being sent.',
      'Your appeal may still go ahead if there’s a reason why it’s late.'
    ]
  };
  predatedThirteenMonthsPageContent: any = {
    heading: 'Tell us why your appeal is late',
    bodyContents: [
      'Your appeal is over one year late. That usually means you can’t appeal.',
      'Your appeal may still be able to go ahead but only if there’s a good reason for it being late. Your reason will be reviewed before your appeal is accepted.'
    ]
  };

  async lateAppealReasons(reasons: string) {
    await this.page
      .getByRole('textbox', { name: 'Reason for being late' })
      .fill(reasons);
    await this.submitPage();
  }

  async checkPageContent(refNumPredatedBy: number) {
    if (refNumPredatedBy > 12) {
      await expect(this.page.locator(this.heading).first()).toContainText(
        this.predatedThirteenMonthsPageContent.heading
      );
      await Promise.all(
        this.predatedThirteenMonthsPageContent.bodyContents.map(
          (bodyContent: string[]) =>
            expect(this.page.locator(this.body)).toContainText(bodyContent)
        )
      );
    } else {
      await expect(this.page.locator(this.heading).first()).toContainText(
        this.predatedOneMonthPageContent.heading
      );
      await Promise.all(
        this.predatedOneMonthPageContent.bodyContents.map(
          (bodyContent: string[]) =>
            expect(this.page.locator(this.body)).toContainText(bodyContent)
        )
      );
    }
  }
}
