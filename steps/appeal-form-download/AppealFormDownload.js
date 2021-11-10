const { SaveToDraftStore } = require('middleware/draftAppealStoreMiddleware');
const { goTo } = require('@hmcts/one-per-page/flow');
const { get } = require('lodash');
const paths = require('paths');
const urls = require('urls');
const benefitTypes = require('steps/start/benefit-type/types');
const preserveSession = require('middleware/preserveSession');

class AppealFormDownload extends SaveToDraftStore {
  static get path() {
    return paths.appealFormDownload;
  }

  get session() {
    return this.req.sess;
  }

  get middleware() {
    return [
      preserveSession,
      ...super.middleware
    ];
  }

  get benefitType() {
    return get(this, 'session.BenefitType.benefitType');
  }

  isBenefitInList(list, benefit) {
    return list.some(key => benefitTypes[key] === benefit);
  }

  get formDownload() {
    const benefitType = this.benefitType;
    const formDownload = {};

    const sscs7 = ['vaccineDamage'];
    const sscs5 = ['childBenefit', 'childCare', 'taxCredits', 'contractedOut', 'taxFreeChildcare'];
    const sscs3 = ['compensationRecovery'];
    const sscs2 = ['childSupport'];

    if (this.isBenefitInList(sscs7, benefitType)) {
      formDownload.link = urls.formDownload.sscs7;
      formDownload.type = 'SSCS7';
    } else if (this.isBenefitInList(sscs5, benefitType)) {
      formDownload.link = urls.formDownload.sscs5;
      formDownload.type = 'SSCS5';
    } else if (this.isBenefitInList(sscs3, benefitType)) {
      formDownload.link = urls.formDownload.sscs3;
      formDownload.type = 'SSCS3';
    } else if (this.isBenefitInList(sscs2, benefitType)) {
      formDownload.link = urls.formDownload.sscs2;
      formDownload.type = 'SSCS2';
    } else {
      formDownload.link = urls.formDownload.sscs1;
      formDownload.type = 'SSCS1';
    }

    return formDownload;
  }

  next() {
    return goTo(this.journey.steps.Exit);
  }
}

module.exports = AppealFormDownload;
