const router = require('express').Router();
const paths = require('paths');
const cookiePolicyContent = require('policy-pages/cookie-policy/content.en.json');
const termsAndConditionsContent = require('policy-pages/terms-and-conditions/content.en.json');

router.get(paths.policy.cookiePolicy, (req, res) => {
    res.render('cookie-policy/template.html', cookiePolicyContent);
});

router.get(paths.policy.termsAndConditions, (req, res) => {
    res.render('terms-and-conditions/template.html', termsAndConditionsContent);
});

module.exports = router;
