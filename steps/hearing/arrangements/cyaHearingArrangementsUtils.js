const cyaContent = require('steps/hearing/arrangements/content.en').cya;

const setCYAValue = (arrangementValue, hiddenFieldValue) => {

    let cyaValue;

    if (arrangementValue === cyaContent.required && (hiddenFieldValue !== undefined && hiddenFieldValue !== '')) {
        cyaValue = hiddenFieldValue;
    } else {
        cyaValue = arrangementValue;
    }

    return cyaValue;

};

module.exports = { setCYAValue };
