const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const { regex } = require('utils/Validators');
const { whitelist } = require('utils/regex');
const content = require('./content');

class SendToNumber extends Question {

    get url() {
        return '/send-to-number';
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
        // return goTo(undefined); // To define the next step
    }
}

module.exports = SendToNumber;
