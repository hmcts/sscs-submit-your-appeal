/* eslint-disable max-len */
const { get, concat } = require('lodash');

const evidenceUploadEnabled = get(require('config'), 'features.evidenceUpload.enabled');

const Entry = require('steps/entry/Entry');
const Exit = require('steps/exit-points/exit/Exit');
const SessionTimeout = require('steps/exit-points/session-timeout/SessionTimeout');
const Sessions = require('steps/session/Sessions');
const Error500 = require('steps/errors/500/Error500');
const BenefitType = require('steps/start/benefit-type/BenefitType');
const PostcodeChecker = require('steps/start/postcode-checker/PostcodeChecker');
const InvalidPostcode = require('steps/start/invalid-postcode/InvalidPostcode');
const Independence = require('steps/start/independence/Independence');
const CantAppeal = require('steps/compliance/cant-appeal/CantAppeal');
const DWPIssuingOffice = require('steps/compliance/dwp-issuing-office/DWPIssuingOffice');
const HaveAMRN = require('steps/compliance/have-a-mrn/HaveAMRN');
const HaveContactedDWP = require('steps/compliance/have-contacted-dwp/HaveContactedDWP');
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
const AppealFormDownload = require('steps/appeal-form-download/AppealFormDownload');
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
const TheHearing = require('steps/hearing/the-hearing/TheHearing');
const HearingArrangements = require('steps/hearing/arrangements/HearingArrangements');
const HearingAvailability = require('steps/hearing/availability/HearingAvailability');
const DatesCantAttend = require('steps/hearing/dates-cant-attend/DatesCantAttend');
const NotAttendingHearing = require('steps/hearing/not-attending/NotAttendingHearing');
const CheckYourAppeal = require('steps/check-your-appeal/CheckYourAppeal');
const Confirmation = require('steps/confirmation/Confirmation');
const EvidenceUpload = require('steps/reasons-for-appealing/evidence-Upload/EvidenceUpload');

const init = [
  Entry,
  Exit,
  Sessions,
  Error500,
  SessionTimeout
];

const startAnAppeal = [
  BenefitType,
  PostcodeChecker,
  InvalidPostcode,
  Independence
];

const compliance = [
  HaveAMRN,
  HaveContactedDWP,
  DWPIssuingOffice,
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
  AppealFormDownload
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

if (evidenceUploadEnabled) {
  reasonsForAppealing.push(EvidenceUpload);
}

const hearing = [
  HearingAvailability,
  HearingSupport,
  HearingArrangements,
  DatesCantAttend,
  NotAttendingHearing,
  TheHearing
];

const checkYourAppeal = [ CheckYourAppeal ];

const confirmation = [ Confirmation ];

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
