import $ from 'jquery';
import fieldTemplates from '@hmcts/look-and-feel/templates/look-and-feel/components/fields.njk';
import errorSummary from '@hmcts/look-and-feel/templates/look-and-feel/components/errors.njk';
import fileTypeWhiteList
  from '../../../steps/reasons-for-appealing/evidence-upload/fileTypeWhitelist.js';
/* eslint-disable id-blacklist */
class EvidenceUpload {
  constructor(elContainer) {
    this.elContainer = elContainer;
    this.formId = 'evidence-upload-form';
    this.elId = 'uploadEv';
    this.listToRead = '.add-another-list';
    this.doTheUpload = this.doTheUpload.bind(this);

    fieldTemplates.getExported(this.setup.bind(this));
    errorSummary.getExported((error, components) => {
      this.errorSummary = components.errorSummary;
    });
  }
  getNumberForNextItem() {
    const nodes = $(`${this.listToRead} dd.add-another-list-item`)
      .toArray()
      .map(item => parseInt(item.id.split('-').pop(), 10))
      .sort();
    let num = 0;
    while (nodes.indexOf(num) !== -1) {
      /* eslint-disable no-plusplus */
      num++;
      /* eslint-enable no-plusplus */
    }
    return num;
  }
  setup(error, components) {
    // give it the time to finish painting the dom...
    window.setTimeout(() => {
      if (components && components.fileupload) {
        this.numberForNextItem = this.getNumberForNextItem();
        this.formAction = `/evidence-upload/item-${this.numberForNextItem}`;
        this.fileupload = components.fileupload({
          id: this.elId,
          name: this.elId,
          value: '',
          errors: this.errors
        }, null, fileTypeWhiteList);
        this.appendForm();
      }
    }, 0);
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
  buildErrorSummary(errors) {
    return this.errorSummary({
      validated: true,
      valid: false,
      errors
    });
  }
  handleErrorSummary(fieldErrors) {
    const errorSummaryList = fieldErrors.map(validationError => {
      return {
        id: validationError.field,
        message: validationError.errors[0]
      };
    });
    const summary = this.buildErrorSummary(errorSummaryList);
    $('.error-summary').remove();
    $('.column-two-thirds').prepend(summary.val);
  }
  handleInlineError(errors) {
    const hasErrors = !!(errors && errors.length);
    $('.form-group').toggleClass('form-group-error', hasErrors);
  }
  hideUnnecessaryMarkup() {
    $('.add-another-add-link').hide();
    $('.add-another-edit-link').css('visibility', 'hidden');
  }
  doTheUpload() {
    const formData = new FormData(document.getElementById(this.formId));
    $.ajax({
      url: this.formAction,
      data: formData,
      cache: false,
      contentType: false,
      processData: false,
      method: 'POST',
      success: () => {
        window.location.reload();
      },
      error: error => {
        if (error && error.responseJSON && error.responseJSON.validationErrors) {
          this.handleErrorSummary(error.responseJSON.validationErrors);
          this.handleInlineError(error.responseJSON.validationErrors)
        }
      }
    });
  }
  attachEventListeners() {
    $(`#${this.elId}`).on('change', this.doTheUpload);
  }
  detachEventListeners() {
    $(`#${this.elId}`).off('change', this.doTheUpload);
  }
  appendForm() {
    const markup = this.buildForm();
    $(this.elContainer).append(markup);
    this.hideUnnecessaryMarkup();
    this.attachEventListeners();
  }
  destroy() {
    this.detachEventListeners();
    $(this.elContainer).empty();
  }
}

export default EvidenceUpload;