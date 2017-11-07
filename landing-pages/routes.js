const router = require('express').Router();
const paths = require('paths');
const overviewContent = require('landing-pages/overview/content.en.json');
const beforeYouAppealContent = require('landing-pages/before-you-appeal/content.en.json');

router.get(paths.landingPages.overview, (req, res) => {
    res.render('overview/template.html', overviewContent);
});

router.get(paths.landingPages.beforeYouAppeal, (req, res) => {
    res.render('before-you-appeal/template.html', beforeYouAppealContent);
});

router.get(paths.landingPages.helpWithAppeal, (req, res) => {
    res.render('help-with-appeal/template.html');
});

router.get(paths.landingPages.startAnAppeal, (req, res) => {
    res.render('start-an-appeal/template.html');
});

router.get(paths.landingPages.afterYouAppeal, (req, res) => {
    res.render('after-you-appeal/template.html');
});

module.exports = router;
