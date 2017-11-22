'use strict';

const {
    CheckYourAnswers: CYA,
    section
} = require('@hmcts/one-per-page/checkYourAnswers');

const { goTo } = require('@hmcts/one-per-page');
const paths = require('paths');

class CheckYourAppeal extends CYA {

    get url() {

        return paths.checkYourAppeal
    }

    sections() {

        return [
            section('benefit-type',                     { title: this.content.start.benefitType }),
            section('mrn-date',                         { title: this.content.compliance.mrnDate }),
            section('check-mrn',                        { title: this.content.compliance.checkMRNDate }),
            section('mrn-over-thirteen-months-late',    { title: this.content.compliance.mrnOverThirteenMonthsLate }),
            section('mrn-over-month-late',              { title: this.content.compliance.mrnOverMonthLate }),
            section('no-mrn',                           { title: this.content.compliance.noMRN }),
            section('appointee',                        { title: this.content.identity.appointee }),
            section('hearing-support',                  { title: this.content.hearing.support }),
            section('dates-you-cant-attend',            { title: this.content.hearing.datesCantAttend }),
            section('appellant-details',                { title: this.content.identity.appellantDetails }),
            section('text-msg-reminders',               { title: this.content.smsNotify.textMsgReminders })
        ];
    }

    next() {

        return goTo(this.journey.Confirmation);
    }
}

module.exports = CheckYourAppeal;
