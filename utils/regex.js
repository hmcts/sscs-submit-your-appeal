const postCode  = /^([A-PR-UWYZ0-9][A-HK-Y0-9][AEHMNPRTVXY0-9]?[ABEHMNPRVWXY0-9]? {1,2}[0-9][ABD-HJLN-UW-Z]{2}|GIR 0AA)$/;
const niNumber  = /^([A-CEGHJ-PR-TW-Z]){1}([A-CEGHJ-NPR-TW-Z]){1}([0-9]){2}([0-9]){2}([0-9]){2}([A-D ]){1}?$/;
const firstName = /^[a-zA-z]+([-][a-zA-Z]+)*$/;
const lastName  = /^[a-zA-z]+([ '-][a-zA-Z]+)*$/;
const whitelist = /^[a-zA-Z0-9 .",'?!()£:-]+$/;
const numbers  = /^[0-9]+$/;
const phoneNumber  = /^[0-9\-\+ ]{10,17}$/;
const benefitType   = /^[a-zA-Z ()]+$/;
const mobileNumber = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;

module.exports = {
    postCode,
    niNumber,
    firstName,
    lastName,
    whitelist,
    numbers,
    phoneNumber,
    benefitType,
    mobileNumber
};
