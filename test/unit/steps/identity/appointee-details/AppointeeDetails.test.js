'use strict';

const { expect } = require('test/util/chai');
const AppointeeDetails = require('steps/identity/appointee-details/AppointeeDetails');
const paths = require('paths');

describe('AppointeeDetails.js', () => {

    let appointeeDetailsClass;

    beforeEach(() => {
        appointeeDetailsClass = new AppointeeDetails();
    });

    describe('get url()', () => {

        it('returns url /enter-appointee-details', () => {
            expect(appointeeDetailsClass.url).to.equal(paths.identity.enterAppointeeDetails);
        });

    });

    describe('get form()', () => {

        it('should be defined', () => {
            expect(appointeeDetailsClass.form).to.be.undefined;
        });

    });

    describe('get next()', () => {

        it('should be defined', () => {
            expect(appointeeDetailsClass.next()).to.be.undefined;
        });

    });

});
