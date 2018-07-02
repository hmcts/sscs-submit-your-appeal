import $ from 'jquery';
import fieldTemplates from '@hmcts/look-and-feel/templates/look-and-feel/components/fields.njk';
import errorSummary from '@hmcts/look-and-feel/templates/look-and-feel/components/errors.njk';

class EvidenceUpload {
  constructor(el) {
    this.el = el;
    fieldTemplates.getExported((error, components) => {
      if (components && components.fileupload) {
        this.fileupload = components.fileupload();
        this.appendForm();
      }
    });
  }
  buildForm() {
    console.info('stuff ', this.fileupload)
    return `<div id="fileUpload">${this.fileupload}</div>`;
  }
  appendForm() {
    const markup = this.buildForm();
    console.info('meh 2')
    $(this.el).append(this.buildForm());
  }
  destroy() {
    $(this.el).empty();
  }
}

export default EvidenceUpload;