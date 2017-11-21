const router = require('express').Router();
const paths = require('paths');
const termsAndConditionsContent = require('terms-and-conditions-page/content.en.json');

router.get(paths.termsAndConditions, (req, res) => {
    res.render('template.html', termsAndConditionsContent);
});

module.exports = router;
