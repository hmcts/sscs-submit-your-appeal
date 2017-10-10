const { Question, form, field, goTo } = require('@hmcts/one-per-page');
const DateUtils = require('utils/DateUtils');
const { numbers } = require('utils/regex');
const urls = require('urls');
const Joi = require('joi');

class MRNDate extends Question {

    get url() {
        return urls.compliance.mrnDate;
    }

    get form() {
        return form(
            field('day')
                .joi(this.content.fields.day.error.required, Joi.string().regex(numbers).required()),
            field('month')
                .joi(this.content.fields.month.error.required, Joi.string().regex(numbers).required()),
            field('year')
                .joi(this.content.fields.year.error.required, Joi.string().regex(numbers).required())
        );
    }

    next() {
        const mrnDate = DateUtils.createMoment(
            this.fields.day.value,
            this.fields.month.value,
            this.fields.year.value);

        if (DateUtils.isLessThanOrEqualToAMonth(mrnDate)) {
            return goTo(this.journey.Appointee);
        } else {
            return goTo(this.journey.CheckMRN);
        }
    }
}

module.exports = MRNDate;
