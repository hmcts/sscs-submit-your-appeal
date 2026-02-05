const Joi = require('joi');
const { compoundField, errorFor } = require('../compoundField');
const { textField } = require('../simpleFields');

const dateField = (
  name,
  {
    allRequired = 'Enter a valid date',
    dayRequired = 'Enter a valid day',
    monthRequired = 'Enter a valid month',
    yearRequired = 'Enter a valid year',
    invalidDate = 'Entered date is invalid'
  } = {}
) => {
  const dayField = textField('day');
  const monthField = textField('month');
  const yearField = textField('year');
  return compoundField(name, dayField, monthField, yearField)
    .joi(
      errorFor('day', dayRequired),
      Joi.object({
        day: Joi.number().integer()
          .min(1)
          .max(31),
        month: Joi.any(),
        year: Joi.any()
      })
        .with('year', 'day')
        .with('month', 'day')
    )
    .joi(
      errorFor('month', monthRequired),
      Joi.object({
        day: Joi.any(),
        month: Joi.number().integer()
          .min(1)
          .max(12),
        year: Joi.any()
      })
        .with('year', 'month')
        .with('day', 'month')
    )
    .joi(
      errorFor('year', yearRequired),
      Joi.object({
        day: Joi.any(),
        month: Joi.any(),
        year: Joi.number().integer()
          .min(1)
          .max(9999)
      })
        .with('day', 'year')
        .with('month', 'year')
    )
    .joi(
      allRequired,
      Joi.object({
        day: Joi.string().required(),
        month: Joi.string().required(),
        year: Joi.string().required()
      })
    )
    .check(
      invalidDate, isValidDate
    );
};


const isValidDate = date => moment(`${date.year}-${date.month}-${date.day}`, 'YYYY-MM-DD').isValid();

module.exports = dateField;
