const { Logger, Express } = require('@hmcts/nodejs-logging');
const { journey } = require('@hmcts/one-per-page');
const lookAndFeel = require('@hmcts/look-and-feel');
const healthcheck = require('@hmcts/nodejs-healthcheck');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const config = require('config');
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const steps = require('steps');
const paths = require('paths');
const landingPages = require('landing-pages/routes');
const policyPages = require('policy-pages/routes');
const content = require('content.en.json');
const urls = require('urls');

const logger = Logger.getLogger('server.js');
const app = express();

const protocol = config.node.protocol;
const hostname = config.node.hostname;
const port =     config.node.port;

let baseUrl = `${protocol}://${hostname}`;
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
    baseUrl = `${protocol}://${hostname}:${port}`;
}

Logger.config({
    microservice: "submit-your-appeal-frontend",
    team: "sscs",
    environment: process.env.NODE_ENV,
});

logger.info('SYA base Url: ', baseUrl);

// Tests
app.set('portFrom', port);
app.set('portTo', port + 50);

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
    errorPages: {
        notFound: {
            template: 'errors/Error404.html',
            title: content.errors.notFound.title,
            message: content.errors.notFound.message,
            nextSteps: content.errors.notFound.nextSteps
        },
        serverError: {
            template: 'errors/500/Error500.html',
            title: content.errors.serverError.title,
            message: content.errors.serverError.message
        }
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

app.use(Express.accessLogger());
app.use('/', landingPages, policyPages);

module.exports = app;
