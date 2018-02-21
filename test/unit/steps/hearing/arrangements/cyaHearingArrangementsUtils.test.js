const { expect } = require('test/util/chai');
const { getHearingArrangementsAnswer } = require('steps/hearing/arrangements/cyaHearingArrangementsUtils');

describe('cyaHearingArrangementsUtils.js', () => {

    describe('getHearingArrangementsAnswer()', () => {

        let arrangement, fields;

        beforeEach(() => {
            arrangement = 'languageInterpreter';
            fields = {
                selection: {
                    value: ['languageInterpreter']
                }
            };
        });

        it('should return Not required when selection value is not set', () => {
            fields.selection.value = ['signLanguageInterpreter'];
            expect(getHearingArrangementsAnswer(fields, arrangement)).to.equal('Not required');
        });

        it('should return Required when selection value is set and the hidden field isn\'t', () => {
            expect(getHearingArrangementsAnswer(fields, arrangement)).to.equal('Required');
        });

        it('should return the value of the hidden field when both selection value and hidden field value has been set', () => {
            fields.interpreterLanguageType = {
                value: 'A language'
            };
            expect(getHearingArrangementsAnswer(fields, arrangement)).to.equal('A language');
        });

    });

});
