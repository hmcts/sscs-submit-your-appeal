/* eslint-disable max-len, no-undefined  */

const i18next = require('i18next');

const setCYAValue = (arrangementValue, hiddenFieldValue) => {
  const sessionLanguage = i18next.language;
  const cyaContent = require(`./content.${sessionLanguage}`).cya;

  let cyaValue = null;

  if (arrangementValue === cyaContent.requested && (hiddenFieldValue !== undefined && hiddenFieldValue !== '')) {
    cyaValue = hiddenFieldValue;
  } else {
    cyaValue = arrangementValue;
  }

  return cyaValue;
};

module.exports = { setCYAValue };
