'use strict';

const { expect } = require('test/util/chai');
const AppointeeDetails = require('steps/identity/appointee-details/AppointeeDetails');
const urls = require('urls');

describe('AppointeeDetails.js', () => {

    let appointeeDetailsClass;

    beforeEach(() => {
        appointeeDetailsClass = new AppointeeDetails();
    });

    after(() => {
        appointeeDetailsClass = undefined;
    });

    describe('get url()', () => {

        it('returns url /enter-appointee-details', () => {
            expect(appointeeDetailsClass.url).to.equal(urls.identity.enterAppointeeDetails);
        });

    });

});
