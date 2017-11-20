'use strict';

const {
    CheckYourAnswers: CYA,
    section
} = require('@hmcts/one-per-page/checkYourAnswers');

const { goTo } = require('@hmcts/one-per-page');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');

class CheckYourAppeal extends CYA {

    get url() {

        return paths.checkYourAppeal
    }

    sections() {

        return [
            section(sections.benefitType.id,                { title: sections.benefitType.title }),
            section(sections.mrnDate.id,                    { title: sections.mrnDate.title }),
            section(sections.appointee.id,                  { title: sections.appointee.title }),
            section(sections.mrnOverThirteenMonthsLate.id,  { title: sections.mrnOverThirteenMonthsLate.title }),
            section(sections.mrnOverOneMonthLate.id,        { title: sections.mrnOverOneMonthLate.title })
        ];
    }

    next() {

        return goTo(this.journey.Confirmation);
    }
}

module.exports = CheckYourAppeal;
