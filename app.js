const config = require('config');
const express = require('express');
const path = require('path');
const { journey } = require('@hmcts/one-per-page');
const lookAndFeel = require('@hmcts/look-and-feel');
const healthcheck = require('@hmcts/nodejs-healthcheck');
const steps = require('steps');
const urls = require('urls');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const app = express();

const baseUrl = `${config.node.host.url}:${config.node.port}`;
const useSSL = config.security.useSSL === 'true';


lookAndFeel.configure(app, {
    baseUrl,
    express: { views: [
        path.resolve(__dirname, 'steps'),
        path.resolve(__dirname, 'views/compliance'),
    ] },
    webpack: {
        entry: [
            path.resolve(__dirname, 'assets/scss/main.scss'),
            path.resolve(__dirname, 'assets/js/main.js'),
        ]
    },
    plugins: [
        new CopyWebpackPlugin([{
            from: path.resolve(__dirname, 'assets/images'),
            to: 'images'
        }])
    ]
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
            secure: useSSL
        },
        secret: config.redis.secret
    }
});

app.use(urls.health, healthcheck.configure({
    "checks": {
        "submit-your-appeal-api": healthcheck.web(`${config.api.url}/health`)
    }
}));

app.listen(config.node.port);

console.log(`SYA started on port:${config.node.port}`);
