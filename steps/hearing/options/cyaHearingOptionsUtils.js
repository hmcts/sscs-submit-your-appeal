/* eslint-disable no-undefined  */

const i18next = require('i18next');

const setCYAValue = (arrangementValue, hiddenFieldValue) => {
  const sessionLanguage = i18next.language || 'en';

  const requireContent = require('utils/requireContent');

  const cyaContent = requireContent.requireLocalized(
    './content',
    sessionLanguage
  ).cya;

  let cyaValue = null;

  if (
    arrangementValue === cyaContent.requested &&
    hiddenFieldValue !== undefined &&
    hiddenFieldValue !== ''
  ) {
    cyaValue = hiddenFieldValue;
  } else {
    cyaValue = arrangementValue;
  }

  return cyaValue;
};

module.exports = { setCYAValue };
