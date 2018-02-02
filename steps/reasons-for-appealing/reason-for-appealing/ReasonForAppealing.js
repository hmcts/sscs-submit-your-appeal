'use strict';

const { AddAnother } = require('@hmcts/one-per-page/steps');
const { goTo } = require('@hmcts/one-per-page');
const { text, object } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const sections = require('steps/check-your-appeal/sections');
const content = require('steps/reasons-for-appealing/reason-for-appealing/content.en');
const { errorFor } = require('@hmcts/one-per-page/src/forms/validator');

const emptyStringValidation = value => value !== undefined;

class ReasonForAppealing extends AddAnother {

    get addAnotherLinkContent() {

        if (this.fields.items !== undefined) {
            return this.fields.items.value.length > 0 ? content.links.addAnother : content.links.add;
        }
        return false;
    }

    get field() {

        return object({
            whatYouDisagreeWith: text,
            reasonForAppealing: text
        }).check(
            errorFor('whatYouDisagreeWith', content.fields.whatYouDisagreeWith.error.required),
            value => emptyStringValidation(value.whatYouDisagreeWith)
        ).check(
            errorFor('reasonForAppealing', content.fields.reasonForAppealing.error.required),
            value => emptyStringValidation(value.reasonForAppealing)
        )
    }

    validateList(list) {

        return list.check(content.listError, arr => arr.length > 0);
    }

    answers() {

        const reasonForAppealing = this.fields.items.value.map(values => {
           return values.reasonForAppealing;
        });

        return [

            answer(this, {
                question: this.content.cya.reasonForAppealing.question,
                section: sections.reasonsForAppealing,
                answer: reasonForAppealing
            })
        ];
    }

    values() {

        return {
            reasonsForAppealing: {
                reasons: this.fields.items.value
            }
        };
    }

    next() {

        return goTo(this.journey.steps.OtherReasonForAppealing);
    }
}

module.exports = ReasonForAppealing;
