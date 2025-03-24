import { BasePage } from './ibca-base.page';

export class IbcaReferenceLateDatePage extends BasePage {
  defaultPageContent: any = {
    "heading": "Double check the date you entered",
    "bodyContents": [
      "Your appeal may be late. Just check you entered the date from the top right of your Review Decision Notice.",
      "Did you enter the date from the top right of your Review Decision Notice?"
    ]
  };

  async isDateRight(option: boolean) {
    (option) ?
      await this.page.getByText('Yes, I entered the date from the top right of my Review Decision Notice').click() :
      await this.page.getByText('No, I entered a different date').click();
    await this.submitPage();
  }
}

export class IbcaReferenceLateDateReasonPage extends BasePage {
  predatedOneMonthPageContent: any = {
    "heading": "Tell us why your appeal is late",
    "bodyContents": [
      "Your appeal may be late. Just check you entered the date from the top right of your Review Decision Notice.",
      "Did you enter the date from the top right of your Review Decision Notice?"
    ]
  };
  predatedThirteenMonthsPageContent: any = {
    "heading": "Tell us why your appeal is late",
    "bodyContents": [
      "Your appeal is over one year late. That usually means you can’t appeal.",
      "Your appeal may still be able to go ahead but only if there’s a good reason for it being late. Your reason will be reviewed before your appeal is accepted."
    ]
  };

  async lateAppealReasons(reasons: string) {
    await this.page.getByRole('textbox', { name: 'Reason for being late' }).fill(reasons);
    await this.submitPage();
  }
}
