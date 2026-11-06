import { BasePage } from './ibca-base.page';

export class IbcaReferenceDatePage extends BasePage {
  defaultPageContent: any = {
    heading: 'When is your Review Decision Notice dated?',
    bodyContents: [
      'Enter the date from the top right of your Review Decision Notice'
    ]
  };
}
