const postCode  = /^([Gg][Ii][Rr] 0[Aa]{2})|((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z]))))\s?[0-9][A-Za-z]{2})$/;
const inwardPostcode = /\d[a-z]{2}$/i;
const niNumber  = /^\s*[a-zA-Z]{1}\s*[a-zA-Z]{1}\s*(?:\s*\d\s*){6}[a-zA-Z]{1}\s*$/;
const title = /^[a-zA-Z /&]{2,}$/;
const firstName = /^[a-zA-z]+([-][a-zA-Z]+)*$/;
const lastName  = /^[a-zA-z]+([ '-][a-zA-Z]+)*$/;
const whitelist = /^[a-zA-Z0-9 .",'?!()£:-]{2,}$/;
const numbers  = /^[0-9]+$/;
const phoneNumber  = /^[0-9\-\+ ]{10,17}$/;
const benefitType   = /^[a-zA-Z ()]+$/;
const mobileNumber = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
const internationalMobileNumber = /^(?:00|\+|07|\(\d+\))[0-9\s.\/-]{7,}$/;

module.exports = {
    postCode,
    inwardPostcode,
    niNumber,
    title,
    firstName,
    lastName,
    whitelist,
    numbers,
    phoneNumber,
    benefitType,
    mobileNumber,
    internationalMobileNumber
};
