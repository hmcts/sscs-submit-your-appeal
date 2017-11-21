const router = require('express').Router();
const paths = require('paths');

router.get(paths.termsAndConditions, (req, res) => {
    res.render('template.html');
});

module.exports = router;
