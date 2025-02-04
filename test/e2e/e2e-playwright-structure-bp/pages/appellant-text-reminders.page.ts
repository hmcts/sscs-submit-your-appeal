import { BasePage } from './ibca-base.page';

export class AppellantTextRemindersPage extends BasePage {
	defaultPageContent: any = {
		"heading": "Do you want to receive text message notifications?",
		"bodyContents": [
			"You’ll only get them when something important happens on your appeal. You won’t be charged to receive them."
		]
	};

	async receiveTextMessageNotifications(smsNotify: any) {
		if (smsNotify.wantsSMSNotifications) {
			await this.page.locator("#doYouWantTextMsgReminders-yes").click()
			await this.submitPage();
			await this.page.getByRole('radio', { name: 'No, send them to a different' }).check();
			await this.submitPage();
			await this.page.getByRole('textbox', { name: 'Mobile number' }).fill(smsNotify.smsNumber);
			await this.submitPage();

		} else {
			await this.page.locator("#doYouWantTextMsgReminders-no").click()
		}
		await this.submitPage();
	}
}
