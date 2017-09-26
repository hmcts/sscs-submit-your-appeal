const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const { multiRegex } = require('utils/Validators');
const { whitelist, mobileNumber } = require('utils/regex');
const content = require('./content');
const urls = require('urls');

class EnterMobile extends Question {

    get url() {
        return urls.smsNotify.enterMobile;
    }

    get template() {
        return 'sms-notify/enter-mobile/template';
    }

    get i18NextContent() {
        return content;
    }

    get form() {

        const fields = this.content.fields;
        const validation = [{
            regex: whitelist,
            msg: 'emptyField'
        }, {
            regex: mobileNumber,
            msg: 'invalidNumber'
        }];

        return form(
            field('mobileNumber')
                .validate(multiRegex(validation, fields.mobileNumber))
                .content(fields.mobileNumber)
        );
    }

    next() {
        return goTo(this.journey.SmsConfirmation);
    }
}

module.exports = EnterMobile;
