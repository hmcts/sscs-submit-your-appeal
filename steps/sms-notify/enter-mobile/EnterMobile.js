const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const { mobileNumber } = require('utils/regex');
const Joi = require('joi');
const content = require('./content');
const urls = require('urls');

class EnterMobile extends Question {

    get url() {
        return urls.smsNotify.enterMobile;
    }

    get template() {
        return 'sms-notify/enter-mobile/template';
    }

    get form() {

        return form(
            field('mobileNumber')
                .joi(
                    this.content.fields.mobileNumber.error.emptyField,
                    Joi.string().required()
                )
                .joi(
                    this.content.fields.mobileNumber.error.invalidNumber,
                    Joi.string().regex(mobileNumber).required()
                )
        );
    }

    get i18NextContent() {
        return content;
    }

    next() {
        return goTo(this.journey.SmsConfirmation);
    }
}

module.exports = EnterMobile;
