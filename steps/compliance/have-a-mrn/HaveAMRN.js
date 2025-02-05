const { goTo, branch } = require('@hmcts/one-per-page');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { form, text } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const Joi = require('joi');
const paths = require('paths');
const userAnswer = require('utils/answer');
const {
  getBenefitCode,
  getBenefitName,
  getHasAcronym,
  getBenefitEndText
} = require('utils/stringUtils');
const i18next = require('i18next');
const { isIba } = require('utils/benefitTypeUtils');

class HaveAMRN extends SaveToDraftStore {
  static get path() {
    return paths.compliance.haveAMRN;
  }

  get benefitType() {
    const sessionLanguage = i18next.language;
    const benefitTypeContent = require(
      `steps/start/benefit-type/content.${sessionLanguage}`
    );

    const benefitShortCode = getBenefitCode(
      this.req.session.BenefitType.benefitType
    );

    if (this.req.session.BenefitType) {
      if (getHasAcronym(this.req.session.BenefitType.benefitType)) {
        return benefitShortCode;
      }
      return benefitTypeContent.benefitTypes[
        getBenefitCode(this.req.session.BenefitType.benefitType).toLowerCase()
      ];
    }
    return '';
  }

  get benefitCode() {
    return getBenefitCode(this.req.session.BenefitType.benefitType);
  }

  get benefitName() {
    return getBenefitName(this.req.session.BenefitType.benefitType);
  }

  get benefitEndText() {
    return getBenefitEndText(this.req.session.BenefitType.benefitType);
  }

  get suffix() {
    return isIba(this.req) ? 'Iba' : '';
  }

  get form() {
    return form({
      haveAMRN: text.joi(
        this.content.fields.haveAMRN.error[`required${this.suffix}`],
        Joi.string().valid([userAnswer.YES, userAnswer.NO]).required()
      )
    });
  }

  answers() {
    return answer(this, { hide: true });
  }

  values() {
    return {};
  }

  next() {
    const hasAMRN = this.fields.haveAMRN.value === userAnswer.YES;
    return branch(
      goTo(this.journey.steps.AppellantIBCAReference).if(
        hasAMRN && isIba(this.req)
      ),
      goTo(this.journey.steps.MRNDate).if(hasAMRN),
      goTo(this.journey.steps.NeedRDN).if(isIba(this.req)),
      goTo(this.journey.steps.HaveContactedDWP)
    );
  }
}

module.exports = HaveAMRN;
