'use strict';

const { expect } = require('test/util/chai');
const NotAttendingHearing = require('steps/hearing/not-attending/NotAttendingHearing');
const paths = require('paths');

describe('HearingArrangements.js', () => {

    let notAttendingHearing;

    beforeEach(() => {

        notAttendingHearing = new NotAttendingHearing({
            journey: {
                steps: {
                    CheckYourAppeal: paths.checkYourAppeal
                }
            }
        });

        notAttendingHearing.fields = {
            emailAddress: {}
        };
    });

    describe('get path()', () => {

        it('returns path /not-attending-hearing', () => {
            expect(notAttendingHearing.path).to.equal(paths.hearing.notAttendingHearing);
        });

    });

    describe('get form()', () => {

        let field;

        before(() => {
            field = notAttendingHearing.form.fields[0];
        });

        it('contains textfield reference for emailAddress field from contact details page', () => {
            expect(field.name).to.equal('emailAddress');
        });

    });

    describe('byPostOrEmail()', () => {

        it('returns email content when emailAddress field has a value', () => {
            expect(notAttendingHearing.byPostOrEmail).to.equal('post');
        });

        it('returns post content when emailAddress field doesn\'t have a value', () => {
            notAttendingHearing.fields.emailAddress.value = 'email address';
            expect(notAttendingHearing.byPostOrEmail).to.equal('email');
        });

    });


    describe('next()', () => {

        it('returns the next step path /check-your-appeal', () => {
            expect(notAttendingHearing.next()).to.eql({ nextStep: paths.checkYourAppeal});
        });

    });

});
