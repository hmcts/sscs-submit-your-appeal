/* eslint-disable no-undefined */
/* eslint-disable multiline-ternary */
/* eslint-disable operator-linebreak */

const { SaveToDraftStoreAddAnother } = require('middleware/draftAppealStoreMiddleware');
const { redirectTo } = require('@hmcts/one-per-page/flow');
const { text, object } = require('@hmcts/one-per-page/forms');
const { answer } = require('@hmcts/one-per-page/checkYourAnswers');
const { errorFor } = require('@hmcts/one-per-page/src/forms/validator');
const { isGreaterThanOrEqualToFiveCharacters, getBenefitCode } = require('utils/stringUtils');
const sections = require('steps/check-your-appeal/sections');
const i18next = require('i18next');
const paths = require('paths');
const { decode, isFeatureFlagEnabled } = require('utils/stringUtils');

class ReasonForAppealing extends SaveToDraftStoreAddAnother {
  static get path() {
    return paths.reasonsForAppealing.reasonForAppealing;
  }

  get benefitType() {
    const sessionLanguage = i18next.language;
    const benefitTypeContent = require(`steps/start/benefit-type/content.${sessionLanguage}`);

    return benefitTypeContent.benefitTypes[getBenefitCode(this.req.session.BenefitType.benefitType).toLowerCase()];
  }

  get benefitCode() {
    if (this.req.session.BenefitType) {
      return getBenefitCode(this.req.session.BenefitType.benefitType);
    }
    return '';
  }

  isBenefitEnabled(featureFlag) {
    return isFeatureFlagEnabled(featureFlag);
  }

  get addAnotherLinkContent() {
    const sessionLanguage = i18next.language;
    const content = require(`./content.${sessionLanguage}`);

    if (this.fields.items !== undefined) {
      return this.fields.items.value.length > 0 ? content.links.addAnother : content.links.add;
    }
    return false;
  }

  get field() {
    const sessionLanguage = i18next.language;
    const content = require(`./content.${sessionLanguage}`);

    return object({
      whatYouDisagreeWith: text,
      reasonForAppealing: text
    }).check(
      errorFor('whatYouDisagreeWith', content.fields.whatYouDisagreeWith.error.notEnough),
      value => value.whatYouDisagreeWith &&
        isGreaterThanOrEqualToFiveCharacters(value.whatYouDisagreeWith))
      .check(
        errorFor('reasonForAppealing', content.fields.reasonForAppealing.error.notEnough),
        value => value.reasonForAppealing &&
          isGreaterThanOrEqualToFiveCharacters(value.reasonForAppealing.trim())
      );
  }

  validateList(list) {
    const sessionLanguage = i18next.language;
    const content = require(`./content.${sessionLanguage}`);

    return list.check(content.listError, arr => arr.length > 0);
  }

  answers() {
    return [
      answer(this, {
        section: sections.reasonsForAppealing,
        template: 'answer.html'
      })
    ];
  }

  values() {
    const sessionLanguage = i18next.language;
    const content = require(`./content.${sessionLanguage}`);

    const reasons = this.fields.items.value.map(item => {
      return {
        whatYouDisagreeWith: item.whatYouDisagreeWith && item.whatYouDisagreeWith !== ' ' ?
          decode(item.whatYouDisagreeWith) : content.cya.reasonForAppealing.notProvided,
        reasonForAppealing: item.reasonForAppealing && item.reasonForAppealing !== ' ' ?
          decode(item.reasonForAppealing) : content.cya.reasonForAppealing.notProvided
      };
    });

    return {
      reasonsForAppealing: {
        reasons
      }
    };
  }

  next() {
    return redirectTo(this.journey.steps.OtherReasonForAppealing);
  }
}

module.exports = ReasonForAppealing;
