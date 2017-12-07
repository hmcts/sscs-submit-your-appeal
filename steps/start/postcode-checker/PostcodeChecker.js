'use strict';

const { Question, branch, goTo } = require('@hmcts/one-per-page');
const { form, textField } = require('@hmcts/one-per-page/forms');
const { postCode, inwardPostcode } = require('utils/regex');
const postcodeList = require('steps/start/postcode-checker/validPostcodeList');
const Joi = require('joi');
const paths = require('paths');

class PostcodeChecker extends Question {

    static get path() {

        return paths.start.postcodeCheck;
    }

    get form() {

        return form(

            textField('postcode').joi(
                this.content.fields.postcode.error.emptyField,
                Joi.string().required()).joi(
                this.content.fields.postcode.error.invalid,
                Joi.string().regex(postCode))
        );
    }

    answers() {

        return [];
    }

    next() {

        const postcode = this.fields.postcode.value;
        const outcode = postcode.replace(inwardPostcode, "").replace(/\s+/, "");
        const isPostcodeOnList = () => postcodeList.includes(outcode.toUpperCase());

        return branch(
            goTo(this.journey.steps.Independence).if(isPostcodeOnList),
            goTo(this.journey.steps.InvalidPostcode)
        );
    }
}

module.exports = PostcodeChecker;
