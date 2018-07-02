import $ from 'jquery';
import fieldTemplates from '@hmcts/look-and-feel/templates/look-and-feel/components/fields.njk';
import errorSummary from '@hmcts/look-and-feel/templates/look-and-feel/components/errors.njk';
// todo add accepts to the input
// todo increase the counter
class EvidenceUpload {
  constructor(elContainer) {
    this.elContainer = elContainer;
    this.formAction = '/evidence-upload/item-0';
    this.elId = 'uploadEv';
    this.doTheUpload = this.doTheUpload.bind(this);
    fieldTemplates.getExported((error, components) => {
      if (components && components.fileupload) {
        this.fileupload = components.fileupload(this.elId);
        this.appendForm();
      }
    });
  }
  buildForm() {
    return `<div id="upload-container">
    <form name=""></form>    
    ${this.fileupload}</div>`;
  }
  hideUnnecessaryMarkup() {
    $('.add-another-add-link').hide();
  }
  doTheUpload() {
    console.info('do the upload');
    const formData = new FormData();
    jQuery.each(jQuery('#' + this.elId)[0].files, function(i, file) {
      console.info('filez ', file);
      formData.append('file-' + i, file);
    });
    jQuery.ajax({
      url: this.formAction,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      method: 'POST',
      success: function(data){
        alert(data);
      }
    });
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