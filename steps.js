const { concat } = require('lodash');
const Entry = require('steps/entry/Entry');
const Exit = require('steps/exit/Exit');
const Sessions = require('steps/session/Sessions');
const Error404 = require('steps/errors/404');
const Error500 = require('steps/errors/500');
const BenefitType = require('steps/start/BenefitType');
const CantAppeal = require('steps/compliance/cant-appeal/CantAppeal');
const CheckMRN = require('steps/compliance/check-mrn/CheckMRN');
const ContactDWP = require('steps/compliance/contact-dwp/ContactDWP');
const MRNDate = require('steps/compliance/mrn-date/MRNDate');
const NoMRN = require('steps/compliance/no-mrn/NoMRN');
const MRNOverOneMonthLate = require('steps/compliance/mrn-over-month-late/MRNOverOneMonthLate');
const MRNOverThirteenMonthsLate = require('steps/compliance/mrn-over-thirteen-months-late/MRNOverThirteenMonthsLate');
const Appointee = require('steps/identity/appointee/Appointee');
const AppointeeDetails = require('steps/identity/appointee-details/AppointeeDetails');
const AppellantDetails = require('steps/identity/appellant-details/AppellantDetails');
const TextReminders = require('steps/sms-notify/text-reminders/TextReminders');
const SendToNumber = require('steps/sms-notify/send-to-number/SendToNumber');
const EnterMobile = require('steps/sms-notify/enter-mobile/EnterMobile');
const SmsConfirmation = require('steps/sms-notify/sms-confirmation/SmsConfirmation');
const Representative = require('steps/representative/representative/Representative');
const RepresentativeDetails = require('steps/representative/representative-details/RepresentativeDetails');
const NoRepresentativeDetails = require('steps/representative/no-representative-details/NoRepresentativeDetails');
const ReasonForAppealing = require('steps/reasons-for-appealing/reason-for-appealing/ReasonForAppealing');
const Arrangements = require('steps/hearing/arrangement/Arrangements');
const HearingArrangements = require('steps/hearing/hearing-arrangements/HearingArrangements');
const HearingAvailability = require('steps/hearing/availibility/HearingAvailibility');

const init = [
    new Entry(),
    new Exit(),
    new Sessions(),
    new Error404(),
    new Error500()
];

const startAnAppeal = [
    new BenefitType()
];

const compliance = [
    new CantAppeal(),
    new CheckMRN(),
    new ContactDWP(),
    new MRNDate(),
    new NoMRN(),
    new MRNOverOneMonthLate(),
    new MRNOverThirteenMonthsLate()
];

const identity = [
    new Appointee(),
    new AppointeeDetails(),
    new AppellantDetails()
];

const smsNotify = [
    new TextReminders(),
    new SendToNumber(),
    new EnterMobile(),
    new SmsConfirmation()
];

const representative = [
    new Representative(),
    new RepresentativeDetails(),
    new NoRepresentativeDetails()
];

const reasonsForAppealing = [
    new ReasonForAppealing()
];

const hearing = [
  new Arrangements(),
  new HearingArrangements(),
  new HearingAvailability()
];

module.exports = concat(
    init,
    startAnAppeal,
    compliance,
    identity,
    smsNotify,
    representative,
    reasonsForAppealing,
    hearing
);
