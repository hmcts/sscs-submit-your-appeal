const { concat } = require('lodash');
const Entry = require('steps/entry/Entry');
const Exit = require('steps/exit/Exit');
const Sessions = require('steps/session/Sessions');
const BenefitsType = require('steps/start/BenefitsType');
const MRNDate = require('steps/compliance/mrn-date/MRNDate');
const Appointee = require('steps/identity/appointee/Appointee');
const AppointeeDetails = require('steps/identity/appointee-details/AppointeeDetails');
const AppellantDetails = require('steps/identity/appellant-details/AppellantDetails');
const TextReminders = require('steps/sms-notify/text-reminders/TextReminders');
const SendToNumber = require('steps/sms-notify/send-to-number/SendToNumber');
const Representative = require('steps/representative/representative/Representative');

const init = [
    new Entry(),
    new Exit(),
    new Sessions(),
];

const startAnAppeal = [
    new BenefitsType()
];

const compliance = [
    new MRNDate()
];

const identity = [
    new Appointee(),
    new AppointeeDetails(),
    new AppellantDetails()
];

const smsNotify = [
    new TextReminders(),
    new SendToNumber()
];

const representative = [
    new Representative()
];

module.exports = concat(
    init,
    startAnAppeal,
    compliance,
    identity,
    smsNotify,
    representative
);
