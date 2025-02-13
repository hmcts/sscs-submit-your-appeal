const translationAnswers = {
  en: {
    YES: 'yes',
    NO: 'no',
    NOT_PROVIDED: 'Not provided',
    NOT_REQUIRED: 'Not required'
  },
  cy: {
    YES: 'Ydw',
    NO: 'Nac ydw',
    NOT_PROVIDED: 'Heb ei ddarparu',
    NOT_REQUIRED: 'Dim ei angen'
  }
};
const answer = {
  ...translationAnswers.en,
  ...translationAnswers
};

module.exports = answer;
