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
const AppellantContactDetails = require('steps/identity/appellant-contact-details/AppellantContactDetails');
const AppellantName = require('steps/identity/appellant-name/AppellantName');
const AppellantDOB = require('steps/identity/appellant-dob/AppellantDOB');
const AppellantNINO = require('steps/identity/appellant-nino/AppellantNINO');
const AppointeeFormDownload = require('steps/identity/appointee-form-download/AppointeeFormDownload');
const TextReminders = require('steps/sms-notify/text-reminders/TextReminders');
const SendToNumber = require('steps/sms-notify/send-to-number/SendToNumber');
const EnterMobile = require('steps/sms-notify/enter-mobile/EnterMobile');
const SmsConfirmation = require('steps/sms-notify/sms-confirmation/SmsConfirmation');
const Representative = require('steps/representative/representative/Representative');
const RepresentativeDetails = require('steps/representative/representative-details/RepresentativeDetails');
const NoRepresentativeDetails = require('steps/representative/no-representative-details/NoRepresentativeDetails');
const ReasonForAppealing = require('steps/reasons-for-appealing/reason-for-appealing/ReasonForAppealing');
const OtherReasonForAppealing = require('steps/reasons-for-appealing/other-reasons-for-appealing/OtherReasonForAppealing');
const SendingEvidence = require('steps/reasons-for-appealing/sending-evidence/SendingEvidence');
const HearingSupport = require('steps/hearing/support/HearingSupport');
const HearingArrangements = require('steps/hearing/hearing-arrangements/HearingArrangements');
const HearingAvailability = require('steps/hearing/availability/HearingAvailibility');
const CheckYourAppeal = require('steps/check-your-appeal/CheckYourAppeal');
const Confirmation = require('steps/confirmation/Confirmation');

const init = [
    Entry,
    Exit,
    Sessions,
    Error404,
    Error500
];

const startAnAppeal = [
    BenefitType
];

const compliance = [
    CantAppeal,
    CheckMRN,
    ContactDWP,
    MRNDate,
    NoMRN,
    MRNOverOneMonthLate,
    MRNOverThirteenMonthsLate
];

const identity = [
    AppellantContactDetails,
    AppellantDOB,
    AppellantName,
    AppellantNINO,
    Appointee,
    AppointeeFormDownload
];

const smsNotify = [
    TextReminders,
    SendToNumber,
    EnterMobile,
    SmsConfirmation
];

const representative = [
    Representative,
    RepresentativeDetails,
    NoRepresentativeDetails
];

const reasonsForAppealing = [
    ReasonForAppealing,
    OtherReasonForAppealing,
    SendingEvidence
];

const hearing = [
    HearingSupport,
    HearingArrangements,
    HearingAvailability
 ];

const checkYourAppeal = [
    CheckYourAppeal
];

const confirmation = [
    Confirmation
];

module.exports = concat(
    init,
    startAnAppeal,
    compliance,
    identity,
    smsNotify,
    representative,
    reasonsForAppealing,
    hearing,
    checkYourAppeal,
    confirmation
);
