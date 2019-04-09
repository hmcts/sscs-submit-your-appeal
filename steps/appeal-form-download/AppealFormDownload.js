const { form, text } = require('@hmcts/one-per-page/forms');
const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const paths = require('paths');
const urls = require('urls');
const benefitTypes = require('steps/start/benefit-type/types');

class AppealFormDownload extends SaveToDraftStore {
  static get path() {
    return paths.appealFormDownload;
  }

  get benefitType() {
    return this.fields.benefitType.value;
  }

  isBenefitInList(list, benefit) {
    return list.some(key => benefitTypes[key] === benefit);
  }

  get formDownload() {
    const benefitType = this.fields.benefitType.value;
    const formDownload = {};

    const sscs5 = ['childBenefit', 'childCare', 'taxCredits', 'contractedOut', 'taxFreeChildcare'];
    const sscs3 = ['compensationRecovery'];

    if (this.isBenefitInList(sscs5, benefitType)) {
      formDownload.link = urls.formDownload.sscs5;
      formDownload.type = 'SSCS5';
    } else if (this.isBenefitInList(sscs3, benefitType)) {
      formDownload.link = urls.formDownload.sscs3;
      formDownload.type = 'SSCS3';
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
