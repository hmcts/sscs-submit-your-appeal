const config = require('config');

function completeEqualityAndDiversity() {
    if (config.features.equalityAndDiversity.enabled) {
        const I = this;
        I.wait(2);
        // This will need to be changed to 'I don\'t want to answer these questions' once the PCQ side of SSCS is merged.
        I.click('Continue');
    }
}

module.exports = { completeEqualityAndDiversity };
