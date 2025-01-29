import { BasePage } from './ibca-base.page';

export class AppellantTextRemindersPage extends BasePage {
    async receiveTextMessageNotifications(option: boolean) {
        (option) ?
            await this.page.locator("#doYouWantTextMsgReminders-yes").click() :
            await this.page.locator("#doYouWantTextMsgReminders-no").click()
        await this.submitPage();
    }
}