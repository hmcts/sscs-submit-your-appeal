'use strict';

const {
    CheckYourAnswers: CYA,
    section
} = require('@hmcts/one-per-page/checkYourAnswers');

const { goTo } = require('@hmcts/one-per-page');
const paths = require('paths');

class CheckYourAppeal extends CYA {

    static get path() {

        return paths.checkYourAppeal
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

        return goTo(this.journey.Confirmation);
    }
}

module.exports = CheckYourAppeal;
