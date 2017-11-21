'use strict';

const {
    CheckYourAnswers: CYA,
    section
} = require('@hmcts/one-per-page/checkYourAnswers');

const benefitTypeTitle = require('steps/start/content.en.json').cya.title;
const mrnDateTitle = require('steps/compliance/mrn-date/content.en.json').cya.title;
const checkMRNTitle = require('steps/compliance/check-mrn/content.en.json').cya.title;
const mrnOver13MonthsLateTitle = require('steps/compliance/mrn-over-thirteen-months-late/content.en.json').cya.title;
const mrnOverOneMonthLateTitle = require('steps/compliance/mrn-over-month-late/content.en.json').cya.title;
const appointeeTitle = require('steps/identity/appointee/content.en.json').cya.title;
const arrangementTitle = require('steps/hearing/arrangement/content.en.json').cya.title;
const availabilityTitle = require('steps/hearing/availability/content.en.json').cya.title;

const { goTo } = require('@hmcts/one-per-page');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');

class CheckYourAppeal extends CYA {

    get url() {

        return paths.checkYourAppeal
    }

    sections() {

        return [
            section(sections.start.benefitType,                     { title: benefitTypeTitle }),
            section(sections.compliance.mrnDate,                    { title: mrnDateTitle }),
            section(sections.compliance.checkMRN,                   { title: checkMRNTitle }),
            section(sections.compliance.mrnOverThirteenMonthsLate,  { title: mrnOver13MonthsLateTitle }),
            section(sections.compliance.mrnOverOneMonthLate,        { title: mrnOverOneMonthLateTitle }),
            section(sections.identity.appointee,                    { title: appointeeTitle }),
            section(sections.hearing.arrangements,                  { title: arrangementTitle }),
            section(sections.hearing.availability,                  { title: availabilityTitle })
        ];
    }

    next() {

        return goTo(this.journey.Confirmation);
    }
}

module.exports = CheckYourAppeal;
