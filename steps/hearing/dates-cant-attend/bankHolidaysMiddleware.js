const UKBankHolidays = require('@hmcts/uk-bank-holidays');

const bankHolidaysMiddleware = async (req, res, next) => {
    const ukBankHolidays = new UKBankHolidays(['england-and-wales']);
    await ukBankHolidays.loadBankHolidayDates(error => {
        next(error);
    });
    res.locals.ukBankHolidays = ukBankHolidays;
    next();
};

module.exports = bankHolidaysMiddleware;
