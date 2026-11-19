import { BasePage } from './ibca-base.page';

export class ConfirmationPage extends BasePage {
  defaultPageContent: any = {
    heading: 'Your appeal has been submitted',
    bodyContents: [
      'IBCA will be notified that you want to appeal against their decision. You’ll be told the next steps when IBCA have responded',
      'If you’ve signed up for emails or SMS and have chosen to attend a hearing, then you’ll get a message within 3 working days with a link so you can track your appeal online.'
    ]
  };
}
