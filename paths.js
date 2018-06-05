const evidenceUploadEnabled = require('config').features.evidenceUpload.enabled;

module.exports = {

  health: '/health',

  errors: {
    doesNotExist: '/does-not-exist',
    internalServerError: '/internal-server-error'
  },

  landingPages: {
    overview: '/',
    beforeYouAppeal: '/before-you-appeal',
    helpWithAppeal: '/help-with-appeal',
    startAnAppeal: '/start-an-appeal',
    afterYouAppeal: '/after-you-appeal'
  },

  policy: {
    cookiePolicy: '/cookie-policy',
    termsAndConditions: '/terms-and-conditions',
    privacy: '/privacy-policy',
    contactUs: '/contact-us'
  },

  session: {
    createSession: '/create-session',
    entry: '/entry',
    exit: '/exit',
    timeout: '/session-timeout',
    sessions: '/sessions'
  },

  start: {
    benefitType: '/benefit-type',
    postcodeCheck: '/postcode-check',
    invalidPostcode: '/invalid-postcode',
    independence: '/independence'
  },

  appealFormDownload: '/appeal-form-download',

  compliance: {
    haveAMRN: '/have-a-mrn',
    haveContactedDWP: '/have-contacted-dwp',
    dwpIssuingOffice: '/dwp-issuing-office',
    cantAppeal: '/cant-appeal',
    checkMRNDate: '/check-mrn-date',
    contactDWP: '/contact-dwp',
    mrnDate: '/mrn-date',
    mrnOverMonthLate: '/mrn-over-month-late',
    mrnOverThirteenMonthsLate: '/mrn-over-thirteen-months-late',
    noMRN: '/no-mrn'
  },

  identity: {
    areYouAnAppointee: '/are-you-an-appointee',
    enterAppellantName: '/enter-appellant-name',
    enterAppellantDOB: '/enter-appellant-dob',
    enterAppellantNINO: '/enter-appellant-nino',
    enterAppellantContactDetails: '/enter-appellant-contact-details'
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
    noRepresentativeDetails: '/no-representative-details'
  },

  reasonsForAppealing: {
    reasonForAppealing: '/reason-for-appealing',
    otherReasonForAppealing: '/other-reason-for-appealing',
    sendingEvidence: '/sending-evidence',
    evidenceUpload: evidenceUploadEnabled ? '/evidence-upload' :  undefined
  },

  hearing: {
    hearingArrangements: '/hearing-arrangements',
    datesCantAttend: '/dates-cant-attend',
    hearingSupport: '/hearing-support',
    hearingAvailability: '/hearing-availability',
    notAttendingHearing: '/not-attending-hearing',
    theHearing: '/the-hearing'
  },

  checkYourAppeal: '/check-your-appeal',

  confirmation: '/confirmation'

};
