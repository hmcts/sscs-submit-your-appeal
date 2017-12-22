'use strict';

const { Question, goTo, branch } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');

class HaveContactedDWP extends Question {

    static get path() {

        return paths.compliance.haveContactedDWP;
    }

    get form() {

        return form(

            textField('haveContactedDWP').joi(
                this.content.fields.haveContactedDWP.error.required,
                Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
            )
        );
    }

    answers() {

        return answer(this, { hide: true });
    }

    values() {

        return {};
    }


    next() {

        const hasContactDWP = this.fields.haveContactedDWP.value === userAnswer.YES;

        return branch(
            goTo(this.journey.steps.NoMRN).if(hasContactDWP),
            goTo(this.journey.steps.ContactDWP)
        );
    }
}

module.exports = HaveContactedDWP;
