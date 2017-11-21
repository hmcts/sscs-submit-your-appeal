const router = require('express').Router();
const paths = require('paths');
// const startAnAppealContent = require('landing-pages/start-an-appeal/content.en.json');

router.get(paths.termsAndConditions, (req, res) => {
    res.render('template.html');
});

module.exports = router;
