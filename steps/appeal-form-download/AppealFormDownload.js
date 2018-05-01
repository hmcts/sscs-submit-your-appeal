const { form, text } = require('@hmcts/one-per-page/forms');
const { Question } = require('@hmcts/one-per-page');
const paths = require('paths');
const urls = require('urls');
const benefitTypes = require('steps/start/benefit-type/types');

class AppealFormDownload extends Question {
  static get path() {
    return paths.appealFormDownload;
  }

  get benefitType() {
    return this.fields.benefitType.value;
  }

  get formDownload() {
    const benefitType = this.fields.benefitType.value;
    const formDownload = {};

    if (benefitType === benefitTypes.childBenefit) {
      formDownload.link = urls.formDownload.sscs5;
      formDownload.type = 'SSCS5';
    } else {
      formDownload.link = urls.formDownload.sscs1;
      formDownload.type = 'SSCS1';
    }

    return formDownload;
  }

  get form() {
    return form({
      benefitType: text.ref(this.journey.steps.BenefitType, 'benefitType')
    });
  }
}

module.exports = AppealFormDownload;
