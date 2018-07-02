import $ from 'jquery';
import fieldTemplates from '@hmcts/look-and-feel/templates/look-and-feel/components/fields.njk';
import errorSummary from '@hmcts/look-and-feel/templates/look-and-feel/components/errors.njk';

class EvidenceUpload {
  constructor(elContainer) {
    this.elContainer = elContainer;
    this.elId = 'file-upload-input';
    this.doTheUpload = this.doTheUpload.bind(this);
    fieldTemplates.getExported((error, components) => {
      if (components && components.fileupload) {
        this.fileupload = components.fileupload(this.elId);
        this.appendForm();
      }
    });
  }
  buildForm() {
    return `<div id="upload-container">${this.fileupload}</div>`;
  }
  hideUnnecessaryMarkup() {
    $('.add-another-add-link').hide();
  }
  doTheUpload() {
    console.info('do the upload')
  }
  attachEventListeners() {
    $('#' + this.elId).on('change', this.doTheUpload)
  }
  detachEventListeners() {
    $('#' + this.elId).off('change', this.doTheUpload)
  }
  appendForm() {
    const markup = this.buildForm();
    $(this.elContainer).append(this.buildForm());
    this.hideUnnecessaryMarkup();
    this.attachEventListeners();
  }
  destroy() {
    this.detachEventListeners();
    $(this.elContainer).empty();
  }
}

export default EvidenceUpload;