/* eslint-disable no-unneeded-ternary, no-confusing-arrow, no-undefined */

const { whitelist } = require('utils/regex');
const languages = require('steps/hearing/arrangements/languages');
const signLanguages = require('steps/hearing/arrangements/signLanguages');

const Joi = require('joi');

const optionSelected = options => {
  const optionValues = Object.values(options);
  let valueSet = false;

  optionValues.forEach(arrangement => {
    valueSet = valueSet ? valueSet : arrangement.requested;
  });

  return valueSet;
};

const languageInList = value => value.requested ? languages.includes(value.language) : true;
const signLanguageInList = value => value.requested ? signLanguages.includes(value.language) : true;
const emptyLanguageFieldValidation = value => !(value.requested && !value.language);

const validCharacters = value => {
  let validated = null;

  if (value.requested) {
    const schema = Joi.string().pattern(whitelist);
    const { error } = schema.validate(value.language);
    validated = error === undefined;
  } else {
    validated = true;
  }

  return validated;
};


module.exports = {
  optionSelected,
  languageInList,
  signLanguageInList,
  emptyLanguageFieldValidation,
  validCharacters
};
