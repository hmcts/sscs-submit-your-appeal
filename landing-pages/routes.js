/* eslint-disable new-cap */
const router = require('express').Router();
const paths = require('paths');
const overviewContent = require('landing-pages/overview/content.en.json');
const beforeYouAppealContent = require('landing-pages/before-you-appeal/content.en.json');
const helpWithAppealContent = require('landing-pages/help-with-appeal/content.en.json');
const afterYouAppealContent = require('landing-pages/after-you-appeal/content.en.json');
const startAnAppealContent = require('landing-pages/start-an-appeal/content.en.json');

/*router.get(paths.landingPages.overview, (req, res) => {
  res.render('overview/template.html', overviewContent);
});

router.get(paths.landingPages.beforeYouAppeal, (req, res) => {
  res.render('before-you-appeal/template.html', beforeYouAppealContent);
});

router.get(paths.landingPages.helpWithAppeal, (req, res) => {
  res.render('help-with-appeal/template.html', helpWithAppealContent);
});

router.get(paths.landingPages.startAnAppeal, (req, res) => {
  res.render('start-an-appeal/template.html', startAnAppealContent);
});

router.get(paths.landingPages.afterYouAppeal, (req, res) => {
  res.render('after-you-appeal/template.html', afterYouAppealContent);
});*/

module.exports = router;
