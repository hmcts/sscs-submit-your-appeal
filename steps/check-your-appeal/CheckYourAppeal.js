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
            section('benefit-type', { title: 'Benefit' }),
            section('mrn-date',     { title: 'Mandatory Reconsideration Notice (MRN)' }),
            section('appointee',    { title: 'Appointee' })
        ];
    }

    next() {
        return goTo(this.journey.Confirmation);
    }
}

module.exports = CheckYourAppeal;
