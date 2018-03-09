'use strict';

const { Question } = require('@hmcts/one-per-page/steps');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { internationalMobileNumber } = require('utils/regex');
const Joi = require('joi');
const paths = require('paths');

class EnterMobile extends Question {

    static get path() {

        return paths.smsNotify.enterMobile;
    }

    get form() {

        return form({

            enterMobile: text
                .joi(
                    this.content.fields.enterMobile.error.emptyField,
                    Joi.string().required()
                ).joi(
                    this.content.fields.enterMobile.error.invalidNumber,
                    Joi.string().regex(internationalMobileNumber).required()
                )
        });
    }

    answers() {

        return answer(this, { hide: true });
    }

    values() {

        return {
            smsNotify: {
                smsNumber: this.fields.enterMobile.value
            }
        };
    }

    next() {

        return redirectTo(this.journey.steps.SmsConfirmation);
    }
}

module.exports = EnterMobile;
