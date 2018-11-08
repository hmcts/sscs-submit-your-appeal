const { Question } = require('@hmcts/one-per-page/steps');
const { goTo, branch, redirectTo } = require('@hmcts/one-per-page/flow');
const { form, date, convert } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { get } = require('lodash');
const sections = require('steps/check-your-appeal/sections');
const DateUtils = require('utils/DateUtils');
const paths = require('paths');
const benefitTypes = require('steps/start/benefit-type/types');

class MRNDate extends Question {
  static get path() {
    return paths.compliance.mrnDate;
  }

  get form() {
    const fields = this.content.fields;

    return form({
      mrnDate: convert(
        d => DateUtils.createMoment(d.day, DateUtils.getMonthValue(d), d.year),
        date.required({
          allRequired: fields.date.error.allRequired,
          dayRequired: fields.date.error.dayRequired,
          monthRequired: fields.date.error.monthRequired,
          yearRequired: fields.date.error.yearRequired
        })
      ).check(
        fields.date.error.invalid,
        value => DateUtils.isDateValid(value)
      ).check(
        fields.date.error.future,
        value => DateUtils.isDateInPast(value)
      ).check(
        fields.date.error.dateSameAsImage,
        value => !DateUtils.mrnDateSameAsImage(value)
      )

    });
  }

  answers() {
    return [
      answer(this, {
        question: this.content.cya.mrnDate.question,
        section: sections.mrnDate,
        answer: this.fields.mrnDate.value.format('DD MMMM YYYY')
      })
    ];
  }

  values() {
    return {
      mrn: {
        date: this.fields.mrnDate.value.format('DD-MM-YYYY'),
        dateAppealSubmitted: DateUtils.getCurrentDate()
      }
    };
  }

  next() {
    const mrnDate = this.fields.mrnDate.value;
    const isLessThanOrEqualToAMonth = DateUtils.isLessThanOrEqualToAMonth(mrnDate);
    const useDWPOfficeESA = [benefitTypes.employmentAndSupportAllowance];
    const benefitType = get(this, 'journey.req.session.BenefitType.benefitType');

    const isDWPOfficeESA = () => useDWPOfficeESA.indexOf(benefitType) !== -1;

    return branch(
      redirectTo(this.journey.steps.CheckMRN).if(!isLessThanOrEqualToAMonth),
      goTo(this.journey.steps.DWPIssuingOfficeEsa).if(isDWPOfficeESA),
      goTo(this.journey.steps.DWPIssuingOffice)
    );
  }
}

module.exports = MRNDate;
