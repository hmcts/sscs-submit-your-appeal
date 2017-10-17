'use strict';

const { internationalMobileNumber } = require('utils/regex');
const FILTERS = {

    isMobilePhone: number => {
        return number.match(internationalMobileNumber);
    }

};

class NunjucksUtils {

    static get filters() {
        return FILTERS;
    }

}

module.exports = NunjucksUtils;