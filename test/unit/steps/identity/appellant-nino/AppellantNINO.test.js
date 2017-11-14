'use strict';

const AppellantNINO = require('steps/identity/appellant-nino/AppellantNINO');
const { expect } = require('test/util/chai');
const paths = require('paths');
const answer = require('utils/answer');

describe('AppellantNINO.js', () => {

    let appellantNINOSut;

    beforeEach(() => {
        appellantNINOSut = new AppellantNINO();
        appellantNINOSut.journey = {
            Appointee: {}
        };
        appellantNINOSut.fields = {
            appointee: {}
        }
    });

    describe('get url()', () => {

        it('returns url /enter-appellant-nino', () => {
            expect(appellantNINOSut.url).to.equal('/enter-appellant-nino');
        });

    });

});
