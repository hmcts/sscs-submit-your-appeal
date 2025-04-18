const config = require('config');

const evidenceUploadEnabled = config.get('features.evidenceUpload.enabled');

module.exports = {
  health: '/health',
  monitoring: '/monitoring',

  errors: {
    doesNotExist: '/does-not-exist',
    internalServerError: '/internal-server-error',
    duplicateCaseError: '/duplicate-case-error'
  },

  policy: {
    cookiePolicy: '/cookie-policy',
    cookies: '/cookies',
    termsAndConditions: '/terms-and-conditions',
    privacy: '/privacy-policy',
    contactUs: '/contact-us',
    accessibility: '/accessibility'
  },

  session: {
    root: '/',
    createSession: '/create-session',
    entry: '/entry',
    exit: '/exit',
    timeout: '/session-timeout',
    sessions: '/sessions',
    sessionTimeoutRedirect: '/session-timeout-redirect'

  },

  start: {
    benefitType: '/benefit-type',
    postcodeCheck: '/postcode-check',
    invalidPostcode: '/invalid-postcode',
    independence: '/independence',
    createAccount: '/create-account',
    idamRedirect: '/idam-redirect',
    languagePreference: '/language-preference'
  },

  appealFormDownload: '/appeal-form-download',

  compliance: {
    haveAMRN: '/have-you-got-an-mrn',
    needRDN: '/need-a-review-decision-notice',
    haveContactedDWP: '/have-contacted-dwp',
    dwpIssuingOffice: '/dwp-issuing-office',
    dwpIssuingOfficeEsa: '/dwp-issuing-office-other',
    cantAppeal: '/cant-appeal',
    checkMRNDate: '/check-mrn-date',
    contactDWP: '/contact-dwp',
    mrnDate: '/mrn-date',
    mrnOverMonthLate: '/mrn-over-month-late',
    mrnOverThirteenMonthsLate: '/mrn-over-thirteen-months-late',
    noMRN: '/no-mrn',
    stillCanAppeal: '/still-can-appeal'
  },

  identity: {
    areYouAnAppointee: '/are-you-an-appointee',
    enterAppellantRole: '/enter-appellant-role',
    enterAppellantName: '/enter-appellant-name',
    enterAppellantDOB: '/enter-appellant-dob',
    enterAppellantNINO: '/enter-appellant-nino',
    enterAppellantContactDetails: '/enter-appellant-contact-details',
    enterAppellantIBCAReference: '/enter-appellant-ibca-reference',
    enterAppellantInternationalContactDetails: '/appellant-international-contact-details',
    enterAppellantInMainlandUk: '/appellant-in-mainland-uk'
  },

  appointee: {
    enterAppointeeName: '/enter-appointee-name',
    enterAppointeeDOB: '/enter-appointee-dob',
    enterAppointeeContactDetails: '/appointee-contact-details',
    sameAddress: '/appointee-same-address'
  },

  smsNotify: {
    enterMobile: '/enter-mobile',
    sendToNumber: '/send-to-number',
    smsConfirmation: '/sms-confirmation',
    appellantTextReminders: '/appellant-text-reminders'
  },

  representative: {
    representativeDetailsToHand: '/representative-details-to-hand',
    representative: '/representative',
    representativeDetails: '/representative-details',
    noRepresentativeDetails: '/no-representative-details',
    representativeInMainlandUk: '/representative-in-mainland-uk',
    representativeInternationalDetails: '/representative-international-details'
  },

  reasonsForAppealing: {
    reasonForAppealing: '/reason-for-appealing',
    otherReasonForAppealing: '/other-reason-for-appealing',
    sendingEvidence: '/sending-evidence',
    evidenceProvide: evidenceUploadEnabled ? '/evidence-provide' : null,
    evidenceUpload: evidenceUploadEnabled ? '/evidence-upload' : null,
    evidenceDescription: evidenceUploadEnabled ? '/evidence-description' : null
  },

  hearing: {
    hearingArrangements: '/hearing-arrangements',
    datesCantAttend: '/dates-cant-attend',
    hearingSupport: '/hearing-support',
    hearingAvailability: '/hearing-availability',
    notAttendingHearing: '/not-attending-hearing',
    theHearing: '/the-hearing',
    hearingOptions: '/hearing-options'
  },

  idam: {
    idamLogin: '/idam-login',
    authenticated: '/authenticated',
    signOut: '/sign-out',
    signInBack: '/sign-in-back'
  },

  pcq: '/equality-and-diversity',
  checkYourAppeal: '/check-your-appeal',
  drafts: '/draft-appeals',
  editDraft: '/edit-appeal',
  newAppeal: '/new-appeal',
  deleteDraft: '/delete-appeal',
  confirmation: '/confirmation'
};
