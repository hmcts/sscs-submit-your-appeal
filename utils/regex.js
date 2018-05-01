/* eslint-disable max-len */
const postCode = /^((([A-Za-z][0-9]{1,2})|(([A-Za-z][A-Ha-hJ-Yj-y][0-9]{1,2})|(([A-Za-z][0-9][A-Za-z])|([A-Za-z][A-Ha-hJ-Yj-y][0-9]?[A-Za-z])|([Gg][Ii][Rr]))))\s?([0-9][A-Za-z]{2})|(0[Aa]{2}))$/;
const inwardPostcode = /\d[a-z]{2}$/i;
const niNumber = /^(?!BG)(?!GB)(?!NK)(?!KN)(?!TN)(?!NT)(?!ZZ)\s?(?:[A-CEGHJ-PR-TW-Z]\s?[A-CEGHJ-NPR-TW-Z])\s?(?:\d\s?){6}([A-D]|\s)\s?$/i;
const title = /^[a-zA-Z /&]{2,}$/;
const firstName = /^([a-zA-z]+([-][a-zA-Z]+)*){2,}$/;
const lastName = /^([a-zA-z]+([ '-][a-zA-Z]+)*){2,}$/;
const whitelist = /^[a-zA-Z0-9 \r\n.",'?![\]()/£:\\_+\-%&;]{2,}$/;
const numbers = /^[0-9]+$/;
const phoneNumber = /^[0-9\-+ ]{10,17}$/;
const benefitType = /^[a-zA-Z ()]+$/;
const mobileNumber = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
const internationalMobileNumber = /^(?:00|\+|07|\(\d+\))[0-9\s./-]{7,}$/;

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
