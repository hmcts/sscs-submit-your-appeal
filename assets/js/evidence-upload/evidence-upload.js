import $ from 'jquery';
import fieldTemplates from '@hmcts/look-and-feel/templates/look-and-feel/components/fields.njk';
import errorSummary from '@hmcts/look-and-feel/templates/look-and-feel/components/errors.njk';

// todo add accepts to the input
// todo increase the counter
class EvidenceUpload {
  constructor(elContainer) {
    this.elContainer = elContainer;
    this.formAction = '/evidence-upload/item-0';
    this.formId = 'evidence-upload-form';
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
        <form 
        id="${this.formId}" 
        name="${this.formId}" 
        action="${this.formAction}" 
        method="post" 
        enctype="multipart/form-data">    
            ${this.fileupload}
        </form>
    </div>`;
  }
  hideUnnecessaryMarkup() {
    $('.add-another-add-link').hide();
  }
  doTheUpload() {
    $('#' + this.formId)[0].submit();
    // the following works nicely but I guess it's simpler to just submit the form
/*    const formData = new FormData(document.getElementById(this.formId));
    const docName = $('#' + this.elId).val().split('\\').pop();
    $.ajax({
      url: this.formAction,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      method: 'POST',
      success: function(data){
        console.info('helloooo ', data, docName);
      }
    });*/
  }
  attachEventListeners() {
    $('#' + this.elId).on('change', this.doTheUpload)
  }
  detachEventListeners() {
    $('#' + this.elId).off('change', this.doTheUpload)
  }
  appendLineToList() {

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