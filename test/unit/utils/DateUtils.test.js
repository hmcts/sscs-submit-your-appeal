/* eslint-disable, no-magic-numbers */

const { expect } = require('test/util/chai');
const DateUtils = require('utils/DateUtils');
const moment = require('moment');
const mrnDateImage = require('steps/compliance/mrn-date/mrnDateOnImage');
const { long, short } = require('utils/months');

describe('MRN date that is <= a calendar month', () => {
  it('should return true when the MRN date is one day short of a month', () => {
    expect(DateUtils.isLessThanOrEqualToAMonth(DateUtils.oneDayShortOfAMonthAgo())).to.be.true;
  });

  it('should return true when the MRN date is exactly one month', () => {
    expect(DateUtils.isLessThanOrEqualToAMonth(DateUtils.oneMonthAgo())).to.be.true;
  });

  it('should return false when the MRN date is 1 month and 1 day', () => {
    expect(DateUtils.isLessThanOrEqualToAMonth(DateUtils.oneMonthAndOneDayAgo())).to.be.false;
  });
});

describe('MRN date that is <= 13 calendar months', () => {
  it('should return true when the MRN date is one day short of 13 months', () => {
    const oneDayShortOfThirteenMonthsAgo = DateUtils.oneDayShortOfThirteenMonthsAgo();
    expect(DateUtils.isLessThanOrEqualToThirteenMonths(oneDayShortOfThirteenMonthsAgo)).to.be.true;
  });

  it('should return true when the MRN date is exactly 13 months', () => {
    const thirteenMonthsAgo = DateUtils.thirteenMonthsAgo();
    expect(DateUtils.isLessThanOrEqualToThirteenMonths(thirteenMonthsAgo)).to.be.true;
  });

  it('should return false when the MRN date is 13 months and 1 day', () => {
    const thirteenMonthsAndOneDayAgo = DateUtils.thirteenMonthsAndOneDayAgo();
    expect(DateUtils.isLessThanOrEqualToThirteenMonths(thirteenMonthsAndOneDayAgo)).to.be.false;
  });
});

describe('isDateValid', () => {
  let date = null;
  let day = '29';
  let month = '2';
  let year = '2000';

  it('should return true when date is a leap year', () => {
    date = DateUtils.createMoment(day, month, year);
    expect(DateUtils.isDateValid(date)).to.be.true;
  });

  describe('day', () => {
    it('should return true when day is a single digit', () => {
      day = '1';
      date = DateUtils.createMoment(day, month, year);
      expect(DateUtils.isDateValid(date)).to.be.true;
    });

    it('should return true when day is double digits', () => {
      day = '12';
      date = DateUtils.createMoment(day, month, year);
      expect(DateUtils.isDateValid(date)).to.be.true;
    });

    it('should return false when invalid day is added', () => {
      day = '35';
      date = DateUtils.createMoment(day, month, year);
      expect(DateUtils.isDateValid(date)).to.be.false;
    });

    it('should return false when day is a non-numeric character', () => {
      day = 'a';
      date = DateUtils.createMoment(day, month, year);
      expect(DateUtils.isDateValid(date)).to.be.false;
    });
  });

  describe('month', () => {
    before(() => {
      day = '15';
      year = '2000';
    });

    it('should return true when month is a single digit', () => {
      month = '1';
      date = DateUtils.createMoment(day, month, year);
      expect(DateUtils.isDateValid(date)).to.be.true;
    });

    it('should return true when month is double digits', () => {
      month = '10';
      date = DateUtils.createMoment(day, month, year);
      expect(DateUtils.isDateValid(date)).to.be.true;
    });

    it('should return false when invalid month is added', () => {
      month = '35';
      date = DateUtils.createMoment(day, month, year);
      expect(DateUtils.isDateValid(date)).to.be.false;
    });

    it('should return false when month is a non-numeric character', () => {
      month = 'a';
      date = DateUtils.createMoment(day, month, year);
      expect(DateUtils.isDateValid(date)).to.be.false;
    });
  });

  describe('year', () => {
    before(() => {
      day = '15';
      month = '10';
    });

    it('should return false when year is a single digit', () => {
      year = '1';
      date = DateUtils.createMoment(day, month, year);
      expect(DateUtils.isDateValid(date)).to.be.false;
    });

    it('should return false when month is double digits', () => {
      year = '12';
      date = DateUtils.createMoment(day, month, year);
      expect(DateUtils.isDateValid(date)).to.be.false;
    });

    it('should return false when month is triple digits', () => {
      year = '121';
      date = DateUtils.createMoment(day, month, year);
      expect(DateUtils.isDateValid(date)).to.be.false;
    });

    it('should return true when month is quadruple digits', () => {
      year = '1999';
      date = DateUtils.createMoment(day, month, year);
      expect(DateUtils.isDateValid(date)).to.be.true;
    });

    it('should return false when year is a non-numeric character', () => {
      year = 'a';
      date = DateUtils.createMoment(day, month, year);
      expect(DateUtils.isDateValid(date)).to.be.false;
    });
  });
});

describe('isDateInPast', () => {
  it('should return true if the date is in the past', () => {
    expect(DateUtils.isDateInPast(moment().subtract(1, 'day'))).to.be.true;
  });
  it('should return true if the date is now', () => {
    expect(DateUtils.isDateInPast(moment())).to.be.true;
  });
  it('should return false if the date is in the future', () => {
    expect(DateUtils.isDateInPast(moment().add(1, 'day'))).to.be.false;
  });
});

describe('mrnDateSameAsImage', () => {
  let date = null;

  it('should return true if date is the same as the image for non-iba', () => {
    date = DateUtils.createMoment(mrnDateImage.mrnDate.day, mrnDateImage.mrnDate.month, mrnDateImage.mrnDate.year);
    expect(DateUtils.mrnDateSameAsImage(date, false)).to.be.true;
  });

  it('should return false if date is the different to the image for non-iba', () => {
    date = moment();
    expect(DateUtils.mrnDateSameAsImage(date, false)).to.be.false;
  });

  it('should return true if date is the same as the image for iba', () => {
    date = DateUtils.createMoment(mrnDateImage.rdnDate.day, mrnDateImage.rdnDate.month, mrnDateImage.rdnDate.year);
    expect(DateUtils.mrnDateSameAsImage(date, true)).to.be.true;
  });

  it('should return false if date is the different to the image for iba', () => {
    date = moment();
    expect(DateUtils.mrnDateSameAsImage(date, true)).to.be.false;
  });
});

describe('isGreaterThanOrEqualToFourWeeks', () => {
  let date = null;

  it('should return false if date is under four weeks', () => {
    date = moment().add(4, 'weeks')
      .subtract(1, 'day');
    expect(DateUtils.isGreaterThanOrEqualToFourWeeks(date)).to.be.false;
  });

  it('should return true if date is exactly four weeks', () => {
    date = moment().add(4, 'weeks');
    expect(DateUtils.isGreaterThanOrEqualToFourWeeks(date)).to.be.true;
  });

  it('should return true if date is over four weeks', () => {
    date = moment().add(4, 'weeks')
      .add(1, 'day');
    expect(DateUtils.isGreaterThanOrEqualToFourWeeks(date)).to.be.true;
  });
});

describe('isLessThanOrEqualToTwentyTwoWeeks', () => {
  let date = null;

  it('should return true if date is under twenty two weeks', () => {
    date = moment().add(22, 'weeks')
      .subtract(1, 'day');
    expect(DateUtils.isLessThanOrEqualToTwentyTwoWeeks(date)).to.be.true;
  });


  it('should return true if date is exactly twenty two weeks', () => {
    date = moment().add(22, 'weeks');
    expect(DateUtils.isLessThanOrEqualToTwentyTwoWeeks(date)).to.be.true;
  });

  it('should return false if date is over twenty two weeks', () => {
    date = moment().add(22, 'weeks')
      .add(1, 'day');
    expect(DateUtils.isLessThanOrEqualToTwentyTwoWeeks(date)).to.be.false;
  });
});

describe('isDateOnTheWeekend', () => {
  let date = null;

  it('should return true when date is on the weekend (English)', () => {
    date = moment('20-05-2018', 'DD-MM-YYYY');
    expect(DateUtils.isDateOnTheWeekend(date, 'en')).to.be.true;
  });

  it('should return true when date is on the weekend (English)', () => {
    date = moment('19-05-2018', 'DD-MM-YYYY');
    expect(DateUtils.isDateOnTheWeekend(date, 'en')).to.be.true;
  });

  it('should return false when date is not on the weekend (English)', () => {
    date = moment('18-05-2018', 'DD-MM-YYYY');
    expect(DateUtils.isDateOnTheWeekend(date, 'en')).to.be.false;
  });

  it('should return true when date is on the weekend (Welsh)', () => {
    date = moment('20-05-2018', 'DD-MM-YYYY').locale('cy');
    expect(DateUtils.isDateOnTheWeekend(date, 'cy')).to.be.true;
  });

  it('should return true when date is on the weekend (Welsh)', () => {
    date = moment('19-05-2018', 'DD-MM-YYYY').locale('cy');
    expect(DateUtils.isDateOnTheWeekend(date, 'cy')).to.be.true;
  });

  it('should return false when date is not on the weekend (Welsh)', () => {
    date = moment('18-05-2018', 'DD-MM-YYYY').locale('cy');
    expect(DateUtils.isDateOnTheWeekend(date, 'cy')).to.be.false;
  });
});

describe('getRandomWeekDayFromDate', () => {
  const weeks = 12;

  for (let i = 1; i <= weeks; i++) {
    it(`should select a random day of the week when the date is ${i} weeks time`, () => {
      const date = moment().add(i, 'week');
      const weekday = DateUtils.getRandomWeekDayFromDate(date);
      expect(DateUtils.isDateOnTheWeekend(weekday)).to.be.false;
    });

    it(`should select a random day of the week when the date is ${i} months time`, () => {
      const date = moment().add(i, 'month');
      const weekday = DateUtils.getRandomWeekDayFromDate(date);
      expect(DateUtils.isDateOnTheWeekend(weekday)).to.be.false;
    });
  }
});

describe('getMonthValue', () => {
  const date = {
    day: '12',
    year: '2018'
  };

  describe('month when is not a numerical value', () => {
    long.en.forEach((month, index) => {
      it(`should return the numerical value for ${month}`, () => {
        date.month = month;
        expect(DateUtils.getMonthValue(date, 'en')).to.equal(index + 1);
      });
    });

    long.cy.forEach((month, index) => {
      it(`should return the numerical value for ${month}`, () => {
        date.month = month;
        expect(DateUtils.getMonthValue(date, 'cy')).to.equal(index + 1);
      });
    });

    short.en.forEach((month, index) => {
      it(`should return the numerical value for ${month}`, () => {
        date.month = month;
        expect(DateUtils.getMonthValue(date, 'en')).to.equal(index + 1);
      });
    });

    short.cy.forEach((month, index) => {
      it(`should return the numerical value for ${month}`, () => {
        date.month = month;
        expect(DateUtils.getMonthValue(date, 'cy')).to.equal(index + 1);
      });
    });

    it('should return false when the string passed is not an actual month', () => {
      date.month = 'Ja';
      expect(DateUtils.getMonthValue(date, 'en')).to.be.false;
    });

    it('should return false when the string passed is composed of a number and words', () => {
      date.month = '01month';
      expect(DateUtils.getMonthValue(date, 'en')).to.be.false;
    });
  });

  describe('month when is a numerical value', () => {
    it('should return the month value that is passed when it is a numerical value', () => {
      date.month = '10';
      expect(DateUtils.getMonthValue(date, 'en')).to.equal(date.month);
    });
  });

  describe('should return current date in DD-MM-YYYY format', () => {
    const currentDate = moment().format('DD-MM-YYYY');
    expect(DateUtils.getCurrentDate()).to.equal(currentDate);
  });
});

describe('formatDate', () => {
  it('should return a formatted date in English', () => {
    const date = DateUtils.createMoment('12', '8', '2018', 'en');

    expect(DateUtils.formatDate(date, 'DD MMMM YYYY')).to.equal('12 August 2018');
  });

  it('should return a formatted date in Welsh', () => {
    const date = DateUtils.createMoment('12', '8', '2018', 'cy');

    expect(DateUtils.formatDate(date, 'DD MMMM YYYY')).to.equal('12 Awst 2018');
  });
});
