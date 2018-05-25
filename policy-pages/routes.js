/* eslint-disable new-cap */
const router = require('express').Router();
const paths = require('paths');
const cookiePolicyContent = require('policy-pages/cookie-policy/content.en.json');
const termsAndConditionsContent = require('policy-pages/terms-and-conditions/content.en.json');
const privacyPolicyContent = require('policy-pages/privacy-policy/content.en.json');
const contactUsContent = require('policy-pages/contact-us/content.en.json');

router.get(paths.policy.cookiePolicy, (req, res) => {
  res.render('cookie-policy/template.html', cookiePolicyContent);
});

router.get(paths.policy.termsAndConditions, (req, res) => {
  res.render('terms-and-conditions/template.html', termsAndConditionsContent);
});

router.get(paths.policy.privacy, (req, res) => {
  res.render('privacy-policy/template.html', privacyPolicyContent);
});

router.get(paths.policy.contactUs, (req, res) => {
  res.render('contact-us/template.html', contactUsContent);
});

module.exports = router;
