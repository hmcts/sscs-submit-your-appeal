'use strict';

const {
    CheckYourAnswers: CYA,
    section
} = require('@hmcts/one-per-page/checkYourAnswers');

const { goTo, action } = require('@hmcts/one-per-page/flow');
const sections = require('steps/check-your-appeal/sections');
const request = require('superagent');
const paths = require('paths');
const {form, textField} = require('@hmcts/one-per-page/forms');
const Joi = require('joi');
const { whitelist } = require('utils/regex');

class CheckYourAppeal extends CYA {

    constructor(...args) {

        super(...args);
        this.sendToAPI = this.sendToAPI.bind(this);
    }

    static get path() {
        return paths.checkYourAppeal
    }

    get debugObj() {
        console.log(`Appeal:`);
        console.log(`\t incomplete: ${this.incomplete}`);
        console.log(`\t complete: ${this.complete}`);
        console.log(`\nSections:`);
        this._sections.forEach( section => {
                console.log(`\tsection.id: ${section.id}`);
                console.log(`\t\t incomplete: ${section.incomplete}`);
                console.log(`\t\t answers:`);
                section.answers.forEach(answer => {
                        console.log(`\t\t\t id: ${answer.id}`);
                        console.log(`\t\t\t\t complete: ${answer.complete}`);
                        console.log(`\t\t\t\t answer: ${answer.answer}`);
                    })
            });
        return true
        }

    sendToAPI() {
        // Temporary
        console.log(JSON.stringify(this.journey.values, null, 2));
        console.log(this.journey.settings.apiUrl);
        return request.post(this.journey.settings.apiUrl).send(this.journey.values);
    }

    sections() {

        return [
            section(sections.benefitType,           { title: this.content.benefitType }),
            section(sections.mrnDate,               { title: this.content.compliance.mrnDate }),
            section(sections.noMRN,                 { title: this.content.compliance.noMRN }),
            section(sections.appellantDetails,      { title: this.content.appellantDetails }),
            section(sections.textMsgReminders,      { title: this.content.smsNotify.textMsgReminders }),
            section(sections.representative,        { title: this.content.representative }),
            section(sections.reasonsForAppealing,   { title: this.content.reasonsForAppealing }),
            section(sections.theHearing,            { title: this.content.hearing.theHearing }),
            section(sections.hearingArrangements,   { title: this.content.hearing.arrangements })
        ];
    }

    get form() {

        return form(

            textField('signer').joi(
                this.content.fields.signer.error.required,
                Joi.string().regex(whitelist))
        );
    }

    values() {

        return {
            signAndSubmit: {
                signer: this.fields.signer.value
            }
        };
    }

    next() {
        return action(this.sendToAPI)
            .then(goTo(this.journey.steps.Confirmation))
    }
}

module.exports = CheckYourAppeal;
