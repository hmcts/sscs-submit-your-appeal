'use strict';

function signAndSubmit(name) {

    const I = this;

    I.fillField('#signer', name);
    I.click('Submit');
}

module.exports = { signAndSubmit };
