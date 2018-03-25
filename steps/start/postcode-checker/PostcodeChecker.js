'use strict';

const { Question, branch, goTo } = require('@hmcts/one-per-page');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { postCode, inwardPostcode } = require('utils/regex');
const postcodeList = require('steps/start/postcode-checker/validPostcodeList');
const Joi = require('joi');
const paths = require('paths');

class PostcodeChecker extends Question {

    static get path() {

        return paths.start.postcodeCheck;
    }

    get form() {

        return form({

            postcode: text
                .joi(
                    this.content.fields.postcode.error.emptyField,
                    Joi.string().required()
                ).joi(
                    this.content.fields.postcode.error.invalid,
                    Joi.string().trim().regex(postCode)
                )
        });
    }

    answers() {

        return answer(this, {hide: true});
    }

    values() {

        return {
            postCodeCheck: this.fields.postcode.value
        };
    }

    next() {

        const postcode = this.fields.postcode.value;
        const outcode = postcode.replace(inwardPostcode, "").replace(/\s+/, "");
        const isPostcodeOnList = () => postcodeList.includes(outcode.toUpperCase());

        return branch(
            goTo(this.journey.steps.Appointee).if(isPostcodeOnList),
            goTo(this.journey.steps.InvalidPostcode)
        );
    }
}

module.exports = PostcodeChecker;
