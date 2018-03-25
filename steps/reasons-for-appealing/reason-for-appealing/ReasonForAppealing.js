'use strict';

const { AddAnother } = require('@hmcts/one-per-page/steps');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { text, object } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { errorFor } = require('@hmcts/one-per-page/src/forms/validator');
const sections = require('steps/check-your-appeal/sections');
const content = require('steps/reasons-for-appealing/reason-for-appealing/content.en');
const paths = require('paths');

const emptyStringValidation = value => value !== undefined;
const isMoreOrEqualToFiveCharacters = value => value.length > 4;

class ReasonForAppealing extends AddAnother {

    static get path() {

        return paths.reasonsForAppealing.reasonForAppealing;
    }

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
            errorFor('whatYouDisagreeWith', content.fields.whatYouDisagreeWith.error.notEnough),
            value => isMoreOrEqualToFiveCharacters(value.whatYouDisagreeWith)
        ).check(
            errorFor('reasonForAppealing', content.fields.reasonForAppealing.error.required),
            value => emptyStringValidation(value.reasonForAppealing)
        ).check(
            errorFor('reasonForAppealing', content.fields.reasonForAppealing.error.notEnough),
            value => isMoreOrEqualToFiveCharacters(value.reasonForAppealing)
        )
    }

    validateList(list) {

        return list.check(content.listError, arr => arr.length > 0);
    }

    answers() {

        return [

            answer(this, {
                section: sections.reasonsForAppealing,
                template: 'answer.html'
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

        return redirectTo(this.journey.steps.OtherReasonForAppealing);
    }
}

module.exports = ReasonForAppealing;
