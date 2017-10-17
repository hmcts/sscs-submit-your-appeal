const config = require('config');
const express = require('express');
const path = require('path');
const { journey } = require('@hmcts/one-per-page');
const lookAndFeel = require('@hmcts/look-and-feel');
const healthcheck = require('@hmcts/nodejs-healthcheck');
const steps = require('steps');
const urls = require('urls');

const app = express();

const baseUrl = `http://localhost:${config.port}`;
const useSSL = config.useSSL === 'true';

lookAndFeel.configure(app, {
    baseUrl,
    express: { views: [
        path.resolve(__dirname, 'steps'),
        path.resolve(__dirname, 'views/compliance'),
    ] },
    webpack: { entry: [
        // Styles
        path.resolve(__dirname, 'assets/scss/main.scss'),

        // We need a webpack CSS loader within look-and-feel for this to work.
        //path.resolve(__dirname, 'assets/css/accessible-autocomplete.min.css'),

        // JavaScript
        path.resolve(__dirname, 'assets/js/autocomplete.js'),
        path.resolve(__dirname, 'assets/js/accessible-autocomplete.min.js')
    ] }
});

journey(app, {
    baseUrl,
    steps,
    session: {
        redis: {
            url: config.redisUrl,
            connect_timeout: 15000,
        },
        cookie: {
            secure: useSSL
        },
        secret: config.secret
    }
});

app.use(urls.health, healthcheck.configure({
    "checks": {
        "submit-your-appeal-api": healthcheck.web(`${config.health.url}/health`)
    }
}));

app.listen(config.port);

console.log(`SYA started on port:${config.port}`);
