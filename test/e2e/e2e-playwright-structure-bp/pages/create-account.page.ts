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


  // async verifySuccessfulLoginForUser(
  //   user: { email: string; password?: string },
  //   clearCacheFlag?: boolean
  // ): Promise<void> {
  //   if (clearCacheFlag) {
  //     await this.page.context().clearCookies();
  //   }

  //   const isLocalhost = this.page.url().includes('localhost');
  //   if (isLocalhost) {
  //     await this.localLogin(user);
  //     return;
  //   }

  //   let newLoginPresent = false;
  //   try {
  //     await expect(this.newUsernameField).toBeVisible({ timeout: 5000 });
  //     newLoginPresent = true;
  //   } catch {
  //     newLoginPresent = false;
  //   }

  //   console.log('verifySuccessfulLoginForUser: newLoginPresent=', newLoginPresent);
    
  //   await(newLoginPresent
  //     ? this.verifyNewSuccessfulLoginForUser(user)
  //     : this.verifyOldSuccessfulLoginForUser(user)
  //   );
  
  //   await expect(this.signOutBtn).toBeVisible({ timeout: 15000 });
  // }

  // async verifyOldSuccessfulLoginForUser(
  //   user: { email: string; password?: string }
  // ): Promise<void> { 
  //     await this.oldUsernameField.fill(user.email);
  //     await this.oldPasswordField.fill(user.password ?? '');

  //     await expect(this.signInButton).toBeVisible();
  //     await expect(this.signInButton).toBeEnabled();

  //     await this.signInButton.click();

  //     // verifySuccessfulSignIn may return early on success
  //     await this.verifySuccessfulSignIn();
  // }

  // async verifyNewSuccessfulLoginForUser(
  //   user: { email: string; password?: string }
  // ): Promise<void> {
  //     await this.newUsernameField.fill(user.email);

  //     // ensure the continue button is visible and clickable
  //     await expect(this.continueButton).toBeVisible();
  //     await expect(this.continueButton).toBeEnabled();
  //     await this.continueButton.click();

  //     // wait for password step to appear before filling
  //     await expect(this.newPasswordField).toBeVisible({ timeout: 5000 });
  //     await this.newPasswordField.fill(user.password ?? '');

  //     // re-use continue button for the second step (may be same locator)
  //     await expect(this.continueButton).toBeVisible();
  //     await expect(this.continueButton).toBeEnabled();
  //     await this.continueButton.click();

  //     // verifySuccessfulSignIn may return early on success
  //     await this.verifySuccessfulSignIn();
  // }

  // async verifySuccessfulSignIn(): Promise<void> {
  //   const signedIn = await this.signOutBtn
  //     .isVisible({ timeout: 15000 })
  //     .catch(() => false);
  // }

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
      await expect(this.page.getByText('Sign in or create an account').first()).toBeVisible({ timeout: 5000 });
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
      
      // await this.page.getByRole('textbox', { name: 'Email address' }).fill(credentials.username);
      // await this.page.getByRole('textbox', { name: 'Password' }).fill(credentials.password);
      // await this.submitPage('Sign in');
      await this.loginJourney(credentials.username, credentials.password);

      await this.page.locator('.govuk-button:has-text("Continue your application")').isVisible();
      await this.page.locator('.govuk-button:has-text("Continue your application")').click();
    } else {
      await this.page.getByText('I do not want to be able to save this appeal later').click();
      await this.submitPage();
    }
  }
}
