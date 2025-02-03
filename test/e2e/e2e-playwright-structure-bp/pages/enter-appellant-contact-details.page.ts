const config = require('config');
import { BasePage } from './ibca-base.page';
const postcodeLookupEnabled = config.get('postcodeLookup.enabled').toString() === 'true';

export class AppellantContactDetailsPage extends BasePage {
    defaultPageContent: any = {
        "heading": "Enter your contact details",
        "bodyContents": [
            "These will be used to send you information about your appeal.",
            "Phone number (optional)",
            "This may be used to contact you about your appeal",
            "Email address (optional)",
            "You’ll get updates on your appeal and a link so you can track your appeal online"
        ]
    };
    async enterContactDetails() { //ToDo : Remove Hardcoding
        await this.page.getByRole('textbox', { name: 'Enter a postcode in England,' }).click();
        await this.page.getByRole('textbox', { name: 'Enter a postcode in England,' }).fill('MK56EQ');
        await this.page.getByRole('button', { name: 'Find address' }).click();
        await this.page.waitForLoadState('networkidle');
        await this.page.waitForLoadState('networkidle');
        await this.page.getByLabel('Pick an address').selectOption('25019873');
        await this.page.waitForLoadState('networkidle');
        await this.submitPage();
    }

    async enterAddressAndContactDetailsManual(appellantAddressAndContactDetails: any) {
        if (postcodeLookupEnabled) {
            await this.page.waitForLoadState('networkidle');
            await this.page.getByRole('link', { name: "I can't find my address" }).click();
        }
        await this.page.locator('#addressLine1').fill(appellantAddressAndContactDetails.addressLine1);
        await this.page.locator('#addressLine2').fill(appellantAddressAndContactDetails.addressLine2);
        await this.page.locator('#townCity').fill(appellantAddressAndContactDetails.townCity);
        await this.page.locator('#county').fill(appellantAddressAndContactDetails.county);
        await this.page.locator('#postCode').fill(appellantAddressAndContactDetails.postCode);
        await this.page.getByRole('textbox', { name: 'Phone number (optional)' }).fill(appellantAddressAndContactDetails.phoneNumber);
        await this.page.getByRole('textbox', { name: 'Email address (optional)' }).fill(appellantAddressAndContactDetails.emailAddress);
        await this.submitPage();
    }

    // async enterAddressDetailsPostalLookup(I, postcodeLookupContent) {
    //   if (postcodeLookupEnabled) {
    //     for (let i = 0; i < 5; i++) {
    //       await this.page.locator('#postcodeLookup').fill(appellant.contactDetails.postCode);
    //       await this.page.getByText(postcodeLookupContent.findAddress).click();
    //       await this.page.waitForTimeout(1000);
    //       await this.page.locator('select[name="postcodeAddress"]').selectOption(`${appellant.contactDetails.addressLine1}, ${appellant.contactDetails.townCity}, ${appellant.contactDetails.postCode}`);
    //       await this.page.waitForURL(new RegExp('.*?validate=1'));
    //       try {
    //         await expect(this.page.locator('#addressLine1')).toHaveValue(appellant.contactDetails.addressLine1);
    //         break;
    //       } catch (error) {
    //         if (i === 4) throw new Error(error);
    //         await this.page.goto(paths.identity.enterAppellantContactDetails);
    //         console.log(`Failed attempt ${i + 1}, trying again.`);
    //       }
    //     }
    //   } else {
    //     await enterAddressDetailsManual(I);
    //   }
    // }
}