const config = require('config');
import { BasePage } from './ibca-base.page';
const postcodeLookupEnabled = config.get('postcodeLookup.enabled').toString() === 'true';
export class RepresentativePage extends BasePage {
  defaultPageContent: any = {
    "heading": "Enter their details",
    "bodyContents": [
      "If you have a professional representative, you can find their contact details on any letter you’ve received from them.",
      "Phone number (optional)",
      "They will receive SMS updates about your appeal if you enter a mobile phone number",
      "Email address (optional)",
      "They will receive email updates about your appeal and a link so they can track your appeal online"
    ]
  };
  async requireLegalRep(option: boolean) {
    (option) ?
      await this.page.getByText('Yes, I want to register a representative').click() :
      await this.page.getByText('No, I don’t want to register a representative').click();
    await this.submitPage();
  }

  async enterLegalRepDetails(lrDetails: any) {
    await this.page.getByRole('textbox', { name: 'First name' }).fill(lrDetails.firstName);
    await this.page.getByRole('textbox', { name: 'Last name(s)' }).fill(lrDetails.lastName);
    await this.page.getByRole('textbox', { name: 'Organisation (if they work' }).fill(lrDetails.organisation);
  }

  async enterLegalRepContactDetailsManual(lrDetails: any) {
    (lrDetails.contactDetails.inCountry) ?
      await this.page.getByText('Yes').click() :
      await this.page.getByText('No').click();
    await this.submitPage();
    await this.enterLegalRepDetails(lrDetails)
    if (postcodeLookupEnabled) {
      await this.page.waitForLoadState('networkidle');
      await this.page.getByRole('link', { name: "I can't find my address" }).click();
    }
    await this.page.locator('#addressLine1').fill(lrDetails.contactDetails.addressLine1);
    await this.page.locator('#addressLine2').fill(lrDetails.contactDetails.addressLine2);
    await this.page.locator('#townCity').fill(lrDetails.contactDetails.townCity);
    await this.page.locator('#county').fill(lrDetails.contactDetails.county);
    await this.page.locator('#postCode').fill(lrDetails.contactDetails.postCode);
    await this.page.getByRole('textbox', { name: 'Phone number (optional)' }).fill(lrDetails.contactDetails.phoneNumber);
    await this.page.getByRole('textbox', { name: 'Email address (optional)' }).fill(lrDetails.contactDetails.emailAddress);
    await this.submitPage();
  }
}
