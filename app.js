const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
const { journey } = require('@hmcts/one-per-page');
const lookAndFeel = require('@hmcts/look-and-feel');
const healthcheck = require('@hmcts/nodejs-healthcheck');
const steps = require('steps');
const paths = require('paths');
const landingPages = require('landing-pages/routes');
const errorPages = require('error-pages/routes');
const policyPages = require('policy-pages/routes');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const content = require('content.en.json');
const urls = require('urls');

const app = express();

const protocol = config.node.protocol;
const hostname = config.node.hostname;
const port =     config.node.port;

let baseUrl;
if(process.env.NODE_ENV === 'production') {
    baseUrl = `${protocol}://${hostname}`;
} else if (process.env.NODE_ENV === 'development') {
    baseUrl = `${protocol}://${hostname}:${port}`;
}

console.log('SYA base Url : %s', baseUrl);

lookAndFeel.configure(app, {
    baseUrl,
    express: {
        views: [
            path.resolve(__dirname, 'steps'),
            path.resolve(__dirname, 'landing-pages'),
            path.resolve(__dirname, 'views/compliance'),
            path.resolve(__dirname, 'policy-pages'),
            path.resolve(__dirname, 'error-pages')
        ]
    },
    webpack: {
        entry: [
            path.resolve(__dirname, 'assets/scss/main.scss'),
            path.resolve(__dirname, 'assets/js/main.js')
        ],
        plugins: [
            new CopyWebpackPlugin([{
                from: path.resolve(__dirname, 'assets/images'),
                to: 'images'
            }])
        ]
    },
    nunjucks: {
        globals: {
            phase: 'BETA',
            banner: `${content.phaseBanner.newService}
                    <a href="${urls.phaseBanner}" target="_blank">${content.phaseBanner.reportProblem}</a>
                    ${content.phaseBanner.improve}`,
            isArray(value) {
                return Array.isArray(value);
            }
        }
    },
    development: {
        useWebpackDevMiddleware: true
    }
});

journey(app, {
    baseUrl,
    steps,
    session: {
        redis: {
            url: config.redis.url,
            connect_timeout: 15000,
        },
        cookie: {
            secure: config.redis.useSSL === 'true'
        },
        secret: config.redis.secret
    },
    apiUrl: `${config.api.url}/appeals`
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(paths.health, healthcheck.configure({
    checks: {
        'submit-your-appeal-api': healthcheck.web(`${config.api.url}/health`)
    }
}));

app.use('/', landingPages, policyPages, errorPages);

module.exports = app;
