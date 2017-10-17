'use strict';

const { internationalMobileNumber } = require('utils/regex');
const FILTERS = {

    isMobilePhone: number => {
        console.log('meow');
        console.log(number.match(internationalMobileNumber));
        return number.match(internationalMobileNumber);
    }

};

class NunjucksUtils {

    static get filters() {
        return FILTERS;
    }

}

module.exports = NunjucksUtils;