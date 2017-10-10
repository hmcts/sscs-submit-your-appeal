const { Question, form, field, branch, goTo } = require('@hmcts/one-per-page');
const { whitelist } = require('utils/regex');
const Joi = require('joi');
const urls = require('urls');
const answer = require('utils/answer');

class SendToNumber extends Question {

    get url() {
        return urls.smsNotify.sendToNumber;
    }

    get form() {

        return form(

            field('useSameNumber')
                .joi(
                    this.content.fields.useSameNumber.error.required,
                    Joi.string().regex(whitelist).required()
                )
        );
    }

    next() {

        const useSameNumber = () => this.fields.useSameNumber.value === answer.YES;

        return branch(
            goTo(this.journey.SmsConfirmation).if(useSameNumber),
            goTo(this.journey.EnterMobile)
        );
    }
}

module.exports = SendToNumber;
