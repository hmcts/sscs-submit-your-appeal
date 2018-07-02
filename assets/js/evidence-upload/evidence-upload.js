import $ from 'jquery';
import { fileUpload } from '../../../dist/nunjucks/formElements.njk';
import fieldTemplates from '@hmcts/look-and-feel/templates/look-and-feel/components/fields.njk';
import errorSummary from '@hmcts/look-and-feel/templates/look-and-feel/components/errors.njk';

class EvidenceUpload {
  constructor(el) {
    this.el = el;
    this.appendForm();
  }
  buildForm() {
    return `<div id="fileUpload"></div>`;
  }
  appendForm() {
    $(this.el).append(this.buildForm());
  }
  destroy() {
    $(this.el).empty();
  }
}

export default EvidenceUpload;