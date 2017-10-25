const config = require('config');
const express = require('express');

//const path = require('path');
// const { journey } = require('@hmcts/one-per-page');
// const lookAndFeel = require('@hmcts/look-and-feel');
// const healthcheck = require('@hmcts/nodejs-healthcheck');
// const steps = require('steps');
// const paths = require('paths');
// const CopyWebpackPlugin = require('copy-webpack-plugin');

const app = express();

const protocol = config.node.protocol;
const hostname = config.node.hostname;
const port     = config.node.port;

//const baseUrl = `${protocol}://${hostname}:${port}`;
//console.log('SYA base Url : %s', baseUrl);

// lookAndFeel.configure(app, {
//     baseUrl,
//     express: {
//         views: [
//             path.resolve(__dirname, 'steps'),
//             path.resolve(__dirname, 'views/compliance')
//         ]
//     },
//     webpack: {
//         entry: [
//             path.resolve(__dirname, 'assets/scss/main.scss'),
//             path.resolve(__dirname, 'assets/js/main.js')
//         ],
//         plugins: [
//             new CopyWebpackPlugin([{
//                 from: path.resolve(__dirname, 'assets/images'),
//                 to: 'images'
//             }])
//         ]
//     }
// });
//
// journey(app, {
//     baseUrl,
//     steps,
//     session: {
//         redis: {
//             url: config.redis.url,
//             connect_timeout: 15000,
//         },
//         cookie: {
//             secure: config.redis.useSSL === 'true'
//         },
//         secret: config.redis.secret
//     }
// });
//
// app.use(paths.health, healthcheck.configure({
//     "checks": {
//         "submit-your-appeal-api": healthcheck.web(`${config.api.url}/health`)
//     }
// }));

// app.listen(config.node.port);
//
// console.log(`SYA started on port:${config.node.port}`);

const http = require('http');

const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Hello World\n');
});

server.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});
