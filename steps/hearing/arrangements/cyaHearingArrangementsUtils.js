const { includes } = require('lodash');

const getHearingArrangementsAnswer = (fields, arrangement) => {

    const selectionValues = fields.selection.value;
    let answer;

    // if checkbox has hidden field value set then return that value otherwise return Required or Not required.
    if (includes(selectionValues, arrangement)) {
        answer = getHiddenFieldValue(fields, arrangement) !== undefined ? getHiddenFieldValue(fields, arrangement) : 'Required';
    } else {
        answer = 'Not required';
    }

    return answer;

};

const getHiddenFieldValue = (fields, arrangement) => {

    const hiddenFields = {
        languageInterpreter: 'interpreterLanguageType',
        signLanguageInterpreter: 'signLanguageType',
        other: 'anythingElse'
    };

    const field = hiddenFields[arrangement];

    return fields[field] !== undefined ? fields[field].value : undefined;

};

module.exports = { getHearingArrangementsAnswer };
