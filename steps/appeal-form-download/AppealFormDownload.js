const { ExitPoint } = require('@hmcts/one-per-page');
const { get } = require('lodash');
const paths = require('paths');
const urls = require('urls');
const benefitTypes = require('steps/start/benefit-type/types');
const preserveSession = require('middleware/preserveSession');
const checkWelshToggle = require('middleware/checkWelshToggle');

class AppealFormDownload extends ExitPoint {
  static get path() {
    return paths.appealFormDownload;
  }

  get session() {
    return this.req.sess;
  }

  get middleware() {
    return [
      preserveSession,
      checkWelshToggle,
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
}

module.exports = AppealFormDownload;
