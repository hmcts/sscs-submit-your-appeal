
const titleise = string => {

    if (typeof string === 'undefined') {
        return '';
    }

    if (string.length < 1) {
        return string;
    }
    const firstChar = string[0].toUpperCase();
    const rest = string.slice(1)
        .replace(/([A-Z])/g, ' $1')
        .trim()
        .toLowerCase();

    return `${firstChar}${rest}`;
};

const splitBenefitType = benefitType => {

    let code = '';
    let description = benefitType;

    if(benefitType.includes('(') &&  benefitType.includes(')')) {
        const index = benefitType.indexOf('(');
        description = benefitType.substring(0,index).trim();
        code = benefitType.substring(index, benefitType.length)
            .replace('(', '')
            .replace(')', '');
    }

    return { description, code }
};

const formatMobileNumber = number => {

    let formattedNumber;

    if (number.length > 11 && number.includes('+')) {

        formattedNumber = `${number.substring(0, 3)} ${number.substring(3, 7)} ${number.substring(7, 10)} ${number.substring(10)}`;

    } else if (number.length > 11 && !number.includes('+')) {

        formattedNumber = `${number.substring(0, 2)} ${number.substring(2, 6)} ${number.substring(6, 9)} ${number.substring(9)}`;

    } else {

        formattedNumber = `${number.substring(0, 4)} ${number.substring(4, 7)} ${number.substring(7)}`;
    }

    return formattedNumber

};

module.exports = { titleise, splitBenefitType, formatMobileNumber };
