'use strict';

const {
    CheckYourAnswers: CYA,
    section
} = require('@hmcts/one-per-page/checkYourAnswers');

const { goTo, action } = require('@hmcts/one-per-page/flow');
const request = require('request-promise-native');
const paths = require('paths');

class CheckYourAppeal extends CYA {

    constructor(...args) {
        super(...args);
        this.sendToAPI = this.sendToAPI.bind(this);
    }

    static get path() {

        return paths.checkYourAppeal
    }

    sendToAPI() {
        const apiUrl = this.journey.settings.apiUrl;
        const json = this.journey.values;
        return request.post(apiUrl, { json });
    }

    sections() {

        return [
            section('benefit-type',                     { title: this.content.benefitType }),
            section('mrn-date',                         { title: this.content.compliance.mrnDate }),
            section('no-mrn',                           { title: this.content.compliance.noMRN }),
            section('appellant-details',                { title: this.content.appellantDetails }),
            section('text-msg-reminders',               { title: this.content.smsNotify.textMsgReminders }),
            section('representative',                   { title: this.content.representative }),
            section('reasons-for-appealing',            { title: this.content.reasonsForAppealing }),
            section('the-hearing',                      { title: this.content.hearing.theHearing }),
            section('hearing-arrangements',             { title: this.content.hearing.arrangements })
        ];
    }

    next() {

        return action(this.sendToAPI)
            .then(goTo(this.journey.steps.Confirmation))
            .onFailure(goTo(this.journey.steps.Error));
    }
}

module.exports = CheckYourAppeal;
