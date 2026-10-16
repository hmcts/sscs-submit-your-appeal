const { redirectTo, goTo, branch } = require('lib/vendor/one-per-page/flow');
const { form, text } = require('lib/vendor/one-per-page/forms');
const { answer } = require('lib/vendor/one-per-page/checkYourAnswers');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const sections = require('steps/check-your-appeal/sections');
const paths = require('paths');
const Joi = require('joi');
const { titleise } = require('utils/stringUtils');
const userAnswer = require('utils/answer');
const i18next = require('i18next');
const { isIba } = require('utils/benefitTypeUtils');

class EvidenceProvide extends SaveToDraftStore {
  static get path() {
    return paths.reasonsForAppealing.evidenceProvide;
  }

  get noticeType() {
    if (i18next.language === 'cy') {
      return isIba(this.req) ?
        'Hysbysiad o Benderfyniad Adolygiad' :
        'Hysbysiad Gorfodi i Ailystyried (MRN)';
    }
    return isIba(this.req) ?
      'Review Decision Notice' :
      'Mandatory Reconsideration Notice (MRN)';
  }

  get form() {
    return form({
      evidenceProvide: text.joi(
        this.content.fields.evidenceProvide.error.required,
        Joi.string()
          .valid(...[userAnswer.YES, userAnswer.NO])
          .required()
      )
    });
  }

  answers() {
    const content = require(`./content.${i18next.language}`);

    return answer(this, {
      question: this.content.cya.evidenceProvide.question,
      section: sections.reasonsForAppealing,
      answer: titleise(
        content.cya.evidenceProvide[this.fields.evidenceProvide.value]
      )
    });
  }

  values() {
    return {
      evidenceProvide: this.getEvidenceProvideValue(
        this.fields.evidenceProvide.value
      )
    };
  }

  getEvidenceProvideValue(evidenceProvideValue) {
    if (evidenceProvideValue === userAnswer.YES) return true;
    if (evidenceProvideValue === userAnswer.NO) return false;
    return '';
  }

  next() {
    const evidenceProvide =
      this.fields.evidenceProvide.value === userAnswer.YES;
    return branch(
      redirectTo(this.journey.steps.EvidenceUpload).if(evidenceProvide),
      goTo(this.journey.steps.TheHearing)
    );
  }
}

module.exports = EvidenceProvide;
