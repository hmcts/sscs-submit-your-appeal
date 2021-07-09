/* eslint-disable max-len */
const { concat } = require('lodash');

const config = require('config');

const evidenceUploadEnabled = config.get('features.evidenceUpload.enabled');

const Entry = require('steps/entry/Entry');
const Exit = require('steps/exit-points/exit/Exit');
const Pcq = require('steps/pcq/Pcq');
const SessionTimeout = require('steps/exit-points/session-timeout/SessionTimeout');
const SessionTimeoutRedirect = require('steps/exit-points/SessionTimeoutRedirect');
const Sessions = require('steps/session/Sessions');
const Error500 = require('steps/errors/500/Error500');
const DuplicateError = require('steps/errors/duplicate-error/DuplicateError');
const BenefitType = require('steps/start/benefit-type/BenefitType');
const LanguagePreference = require('steps/start/language-preference/LanguagePreference');
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
const AppointeeName = require('steps/appointee/appointee-name/AppointeeName');
const AppointeeDOB = require('steps/appointee/appointee-dob/AppointeeDOB');
const AppointeeContactDetails = require('steps/appointee/appointee-contact-details/AppointeeContactDetails');
const SameAddress = require('steps/appointee/same-address/SameAddress');
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
const EvidenceProvide = require('steps/reasons-for-appealing/evidence-provide/EvidenceProvide');
const HearingSupport = require('steps/hearing/support/HearingSupport');
const HearingOptions = require('steps/hearing/options/HearingOptions');
const TheHearing = require('steps/hearing/the-hearing/TheHearing');
const HearingArrangements = require('steps/hearing/arrangements/HearingArrangements');
const HearingAvailability = require('steps/hearing/availability/HearingAvailability');
const DatesCantAttend = require('steps/hearing/dates-cant-attend/DatesCantAttend');
const NotAttendingHearing = require('steps/hearing/not-attending/NotAttendingHearing');
const CheckYourAppeal = require('steps/check-your-appeal/CheckYourAppeal');
const DraftAppeals = require('steps/draft-appeals/DraftAppeals');
const EditAppeal = require('steps/edit-appeal/EditAppeal');
const NewAppeal = require('steps/new-appeal/NewAppeal');
const ArchiveAppeal = require('steps/archive-appeal/ArchiveAppeal');
const Confirmation = require('steps/confirmation/Confirmation');
const EvidenceUpload = require('steps/reasons-for-appealing/evidence-upload/EvidenceUpload');
const EvidenceDescription = require('steps/reasons-for-appealing/evidence-description/EvidenceDescription');
const CreateAccount = require('steps/start/create-account/CreateAccount');
const IdamRedirect = require('steps/idam/idam-redirect/IdamRedirect');
const IdamLogin = require('steps/idam/IdamLogin/IdamLogin');
const IdamMockLogin = require('steps/idam/IdamLogin/IdamLogin');
const Authenticated = require('steps/idam/authenticated/Authenticated');
const SignOut = require('steps/idam/sign-out/SignOut');
const SignInBack = require('steps/idam/sign-in-back/SignInBack');
const StillCanAppeal = require('steps/compliance/still-can-appeal/StillCanAppeal');
const Accessibility = require('steps/policy-pages/accessibility/Accessibility');
const ContactUs = require('steps/policy-pages/contact-us/ContactUs');
const CookiePolicy = require('steps/policy-pages/cookie-policy/CookiePolicy');
const Cookies = require('steps/policy-pages/cookie-policy/Cookies');
const PrivacyPolicy = require('steps/policy-pages/privacy-policy/PrivacyPolicy');
const TermsAndConditions = require('steps/policy-pages/terms-and-conditions/TermsAndConditions');

const init = [
  Entry,
  Exit,
  Sessions,
  Error500,
  DuplicateError,
  SessionTimeout,
  SessionTimeoutRedirect
];

const startAnAppeal = [
  BenefitType,
  PostcodeChecker,
  InvalidPostcode,
  Independence,
  CreateAccount,
  IdamRedirect,
  LanguagePreference
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
  MRNOverThirteenMonthsLate,
  StillCanAppeal
];

const identity = [
  AppellantContactDetails,
  AppellantDOB,
  AppellantName,
  AppellantNINO,
  Appointee,
  AppealFormDownload
];

const appointee = [
  AppointeeName,
  AppointeeDOB,
  AppointeeContactDetails,
  SameAddress
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
  OtherReasonForAppealing
];

if (!evidenceUploadEnabled) {
  reasonsForAppealing.push(SendingEvidence);
}

if (evidenceUploadEnabled) {
  reasonsForAppealing.push(EvidenceProvide);
  reasonsForAppealing.push(EvidenceUpload);
  reasonsForAppealing.push(EvidenceDescription);
}

const hearing = [
  HearingAvailability,
  HearingSupport,
  HearingArrangements,
  DatesCantAttend,
  NotAttendingHearing,
  TheHearing,
  HearingOptions
];

const pcq = [ Pcq ];

const checkYourAppeal = [ CheckYourAppeal ];

const draftAppeals = [ DraftAppeals ];

const editAppeal = [ EditAppeal ];

const newAppeal = [ NewAppeal ];

const archiveAppeal = [ ArchiveAppeal ];

const confirmation = [ Confirmation ];

const idam = [
  IdamMockLogin,
  Authenticated,
  IdamLogin,
  SignOut,
  SignInBack
];

const policyPages = [
  Accessibility,
  ContactUs,
  CookiePolicy,
  Cookies,
  PrivacyPolicy,
  TermsAndConditions
];

module.exports = concat(
  init,
  startAnAppeal,
  compliance,
  identity,
  appointee,
  smsNotify,
  representative,
  reasonsForAppealing,
  hearing,
  pcq,
  checkYourAppeal,
  confirmation,
  idam,
  draftAppeals,
  editAppeal,
  newAppeal,
  archiveAppeal,
  policyPages
);
