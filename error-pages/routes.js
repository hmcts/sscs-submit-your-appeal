const router = require('express').Router();
const paths = require('paths');
const pageNotFoundContent = require('./404/content.en.json');
const pageTimeOutContent = require('./timed-out/content.en.json');
const technicalIssueContent = require('./500/content.en.json');

router.get(paths.errorPages.pageNotFound, (req, res) => {
    res.render('404/template.html', pageNotFoundContent);
});

router.get(paths.errorPages.timedOut, (req, res) => {
    res.render('timed-out/template.html', pageTimeOutContent);
});

router.get(paths.errorPages.technicalIssue, (req, res) => {
    res.render('500/template.html', technicalIssueContent);
});

module.exports = router;
