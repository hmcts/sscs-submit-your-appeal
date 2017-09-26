const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const { regex } = require('utils/Validators');
const { whitelist } = require('utils/regex');
const content = require('./content');
const urls = require('urls');

class SendToNumber extends Question {

    get url() {
        return urls.smsNotify.sendToNumber;
    }

    get form() {
        return form(
            field('useSameNumber')
                .validate(regex(whitelist, this.content.fields.useSameNumber))
                .content(this.content.fields.useSameNumber)
        );
    }

    get template() {
        return `sms-notify/send-to-number/template`;
    }

    get i18NextContent() {
        return content;
    }

    next() {
        if(this.fields.get('useSameNumber').value === 'yes') {
            return goTo(this.journey.SmsConfirmation);
        } else {
            return goTo(this.journey.EnterMobile);
        }
    }
}

module.exports = SendToNumber;
