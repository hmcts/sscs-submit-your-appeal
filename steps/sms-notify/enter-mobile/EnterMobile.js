const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const { internationalMobileNumber } = require('utils/regex');
const Joi = require('joi');
const urls = require('urls');

class EnterMobile extends Question {

    get url() {
        return urls.smsNotify.enterMobile;
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
                    Joi.string().regex(internationalMobileNumber).required()
                )
        );
    }

    next() {
        return goTo(this.journey.SmsConfirmation);
    }
}

module.exports = EnterMobile;
