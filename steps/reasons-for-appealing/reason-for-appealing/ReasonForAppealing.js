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
const content = require('steps/reasons-for-appealing/reason-for-appealing/content.en');
const paths = require('paths');
const { decode } = require('utils/stringUtils');

class ReasonForAppealing extends SaveToDraftStoreAddAnother {
  static get path() {
    return paths.reasonsForAppealing.reasonForAppealing;
  }

  get benefitType() {
    return getBenefitCode(this.req.session.BenefitType.benefitType);
  }

  get addAnotherLinkContent() {
    if (this.fields.items !== undefined) {
      return this.fields.items.value.length > 0 ? content.links.addAnother : content.links.add;
    }
    return false;
  }

  get field() {
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
  get valid() {
    if (this.journey.noValidate) {
      return true;
    }
    return this.fields.valid;
  }

  values() {
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
