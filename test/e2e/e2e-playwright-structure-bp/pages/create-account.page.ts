import { expect } from '@playwright/test';
import { BasePage } from './ibca-base.page';

export class CreateAccountPage extends BasePage {
  defaultPageContent: any = {
    "heading": "Do you want to be able to save this appeal later?",
    "bodyContents": [
      "You need to create an account now if you want to save your appeal application later. For example, if you need to take a break or gather information.",
      "If you decide not to create an account now, and leave an appeal part-way through, you will have to start over when you decide to complete an appeal. If you think you will want to save part-way through, then select I want to be able to save this appeal later."
    ]
  };

  async newSignInFlow(username: string, password: string): Promise<void> {
    const newUsername = this.page.locator('#email').first();
    const newPassword = this.page.locator('#password').first();
    const continueButton = this.page
      .locator("//*[@id='main-content']/div/div/form/div[@class='govuk-button-group']/button")
      .first();

    await this.page.locator("//a[@href='/enter-email']").first().click();
    await newUsername.fill(username);
    await continueButton.click();

    await expect(newPassword).toBeVisible({ timeout: 5000 });
    await newPassword.fill(password);
    await continueButton.click();
  }

  async oldSignInFlow(username: string, password: string): Promise<void> {
    await this.page.locator('#username').first().fill(username);
    await this.page.locator('#password').first().fill(password);
    await this.page.locator("[name='save']").first().click();
  }


  async isNewLoginPresent(): Promise<boolean> {
    try {
      await expect(this.page.getByText('You may already have an account if you have used an HMCTS service before').first()).toBeVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }
  
  async loginJourney(username: string, password: string): Promise<void> {
    const newLoginPresent = await this.isNewLoginPresent();
    console.log('signIn: newLoginPresent=', newLoginPresent);

    const loginFlow = newLoginPresent ? this.newSignInFlow : this.oldSignInFlow;
    await loginFlow.call(this, username, password);
  }
    

  async saveForLater(saveOption: boolean, credentials: any = {}) {
    if (saveOption) {
      await this.page.getByText('I want to be able to save this appeal later', { exact: true }).click();
      await this.submitPage();
      
      await this.loginJourney(credentials.username, credentials.password);

      await this.page.locator('.govuk-button:has-text("Continue your application")').isVisible();
      await this.page.locator('.govuk-button:has-text("Continue your application")').click();
    } else {
      await this.page.getByText('I do not want to be able to save this appeal later').click();
      await this.submitPage();
    }
  }
}
