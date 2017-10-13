const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const { whitelist } = require('utils/regex');
const Joi = require('joi');
const urls = require('urls');

class HearingArrangements extends Question {

    get url() {
        return urls.hearing.hearingArrangements;
    }

    get form() {

        const answers = [
            'languageInterpreter',
            'signLanguageInterpreter',
            'hearingLoop',
            'disabledAccess',
        ];

        return form(

            field('selection')
                .joi(
                    this.content.fields.selection.error.required,
                    Joi.array().items(Joi.string().valid(answers)).single()
                ),

            field('anythingElse')
                .joi(
                    this.content.fields.anythingElse.error.required,
                    Joi.string().regex(whitelist).required().allow('')
                )
        );
    }

    next() {
        return goTo(this.journey.HearingAvailibility);
    }
}

module.exports = HearingArrangements;
