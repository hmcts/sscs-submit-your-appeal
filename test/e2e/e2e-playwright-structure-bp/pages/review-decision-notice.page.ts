import { BasePage } from './ibca-base.page';

export class ReviewDecisionNotice extends BasePage {
  defaultPageContent: any = {
    heading: 'Have you got a Review Decision Notice?',
    bodyContents: [
      'This is the letter IBCA sent you if you asked them to reconsider their decision about the Infected Blood Compensation.'
    ]
  };
  async reviewDecisionNotice(option: boolean) {
    option
      ? await this.page
          .getByText('Yes, I have a Review Decision Notice')
          .click()
      : await this.page
          .getByText('No, I don’t have a Review Decision Notice')
          .click();
    await this.submitPage();
  }
}
