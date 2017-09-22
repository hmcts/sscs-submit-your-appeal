const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const { regex } = require('utils/Validators');
const { whitelist, mobileNumber } = require('utils/regex');
const content = require('./content');

class EnterMobile extends Question {

    get url() {
        return '/enter-mobile';
    }

    get template() {
        return 'sms-notify/enter-mobile/template';
    }

    get i18NextContent() {
        return content;
    }

    get form() {

        const fields = this.content.fields;

        return form(
            field('mobileNumber')
                .validate(regex(mobileNumber, fields.mobileNumber))
                .content(fields.mobileNumber)
        );
    }

    next() {
        return goTo(this.journey.SmsConfirmation);
    }
}

module.exports = EnterMobile;
