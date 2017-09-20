const config = require('config');
const express = require('express');
const path = require('path');
const { journey } = require('@hmcts/one-per-page');
const lookAndFeel = require('@hmcts/look-and-feel');

const app = express();

const baseUrl = `http://localhost:${config.port}`;

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

// Creates a session then redirects to /benefits-type
const Entry = require('steps/entry/Entry');

// Exits a session
const Exit = require('steps/exit/Exit');

// View session data (e.g. /sessions)
const Sessions = require('steps/session/Sessions');

// Start
const BenefitsType = require('steps/start/BenefitsType');

// Compliance
const MRNDate = require('steps/compliance/mrn-date/MRNDate');

// Identity
const Appointee = require('steps/identity/appointee/Appointee');
const AppointeeDetails = require('steps/identity/appointee-details/AppointeeDetails');
const AppellantDetails = require('steps/identity/appellant-details/AppellantDetails');

// Appellant SMS notifications
const TextReminders = require('steps/sms-notify/text-reminders/TextReminders');
const SendToNumber = require('steps/sms-notify/send-to-number/SendToNumber');

// Representative
const Representative = require('steps/representative/representative/Representative');

journey(app, {
    baseUrl,
    steps: [
        new Entry(),
        new Exit(),
        new Sessions(),
        new BenefitsType(),
        new MRNDate(),
        new Appointee(),
        new AppointeeDetails(),
        new AppellantDetails(),
        new TextReminders(),
        new SendToNumber(),
        new Representative()
    ],
    session: {
        redis: { url: config.redisUrl },
        cookie: { secure: false }
    }
});

app.listen(config.port);

console.log(`SYA started on port:${config.port}`);
