module.exports = {

    health:                             '/health',

    session: {
        createSession:                  '/create-session',
        entry:                          '/',
        exit:                           '/exit',
        sessions:                       '/sessions'
    },

    start: {
        benefitType:                    '/benefit-type'
    },

    compliance: {
        cantAppeal:                     '/cant-appeal',
        checkMRNDate:                   '/check-mrn-date',
        contactDWP:                     '/contact-dwp',
        mrnDate:                        '/mrn-date',
        mrnOverMonthLate:               '/mrn-over-month-late',
        mrnOverThirteenMonthsLate:      '/mrn-over-thirteen-months-late',
        noMRN:                          '/no-mrn'
    },

    identity: {
        areYouAnAppointee:              '/are-you-an-appointee',
        enterAppellantDetails:          '/enter-appellant-details',
        enterAppointeeDetails:          '/enter-appointee-details'
    },

    smsNotify: {
        enterMobile:                    '/enter-mobile',
        sendToNumber:                   '/send-to-number',
        smsConfirmation:                '/sms-confirmation',
        appellantTextReminders:         '/appellant-text-reminders'
    },

    representative: {
        representative:                 '/representative',
        representativeDetails:          '/representative-details',
        noRepresentativeDetails:        '/no-representative-details'
    },

    reasonsForAppealing: {
        reasonForAppealing:             '/reason-for-appealing'
    },

    hearing: {
        arrangements:                   '/arrangements',
        hearingArrangements:            '/hearing-arrangements',
        hearingAvailability:            '/hearing-availability'
    }

};
