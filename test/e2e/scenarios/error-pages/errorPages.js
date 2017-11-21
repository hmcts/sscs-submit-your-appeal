'use strict';

const paths = require('paths');
const pageNotFoundContent = require('error-pages/404/content.en.json');
const technicalIssuesContent = require('error-pages/500/content.en.json');
const timedOutContent = require('error-pages/timed-out/content.en.json');

Feature('Error Pages');

Scenario('When I go to page not found error page, I see the page heading', (I) => {

    I.amOnPage(paths.errorPages.pageNotFound);
    I.see(pageNotFoundContent.title);

});

Scenario('When I go to page not found error page, I see the page heading', (I) => {

    I.amOnPage(paths.errorPages.technicalIssue);
    I.see(technicalIssuesContent.title);

});

Scenario('When I go to page not found error page, I see the page heading', (I) => {

    I.amOnPage(paths.errorPages.timedOut);
    I.see(timedOutContent.title);

});


