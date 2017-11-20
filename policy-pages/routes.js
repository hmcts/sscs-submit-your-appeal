const router = require('express').Router();
const paths = require('paths');
const cookiePolicyContent = require('policy-pages/cookie-policy/content.en.json');

router.get(paths.policy.cookiePolicy, (req, res) => {
    res.render('cookie-policy/template.html', cookiePolicyContent);
});

module.exports = router;
