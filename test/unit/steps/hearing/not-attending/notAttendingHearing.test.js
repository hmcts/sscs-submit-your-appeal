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

        let fields;
        let field;

        before(() => {
            fields = notAttendingHearing.form.fields;
        });

        it('should contain 1 field', () => {
            expect(Object.keys(fields).length).to.equal(1);
            expect(fields).to.have.all.keys('emailAddress');
        });

        describe('emailAddress field', () => {

            before(() => {
                field = fields.emailAddress;
            });

            it('has constructor name Reference', () => {
                expect(field.constructor.name).to.eq('Reference');
            });

            it('contains the field name emailAddress', () => {
                expect(field.name).to.equal('emailAddress');
            });

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

    describe('answers()', () => {

        it('should contain hide index which is set to true', () => {
            const answers = notAttendingHearing.answers();
            expect(answers.hide).to.equal(true);
        });

    });


    describe('next()', () => {

        it('returns the next step path /check-your-appeal', () => {
            expect(notAttendingHearing.next()).to.eql({ nextStep: paths.checkYourAppeal});
        });

    });

});
