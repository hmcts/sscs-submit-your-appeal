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
    this.interceptSubmission = this.interceptSubmission.bind(this);

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
          name: `item.${this.elId}`,
          value: '',
          errors: this.errors
        }, 'Choose file', fileTypeWhiteList.filter(item => item.indexOf('/') === -1)
        );
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
    const errorId = 'inline-errors-list';
    const hasErrors = Boolean(errors && errors.length);
    $(`#${errorId}`).remove();
    $('.form-group').toggleClass('form-group-error', hasErrors);
    if (hasErrors) {
      $('label').after(`<span id="${errorId}" class="error-message">${errors[0].errors[0]}</span>`);
    }
  }
  hideUnnecessaryMarkup() {
    $('.add-another-add-link').hide();
    $(`#${this.elId}`).hide();
  }
  interceptSubmission(e) {
    if ($('.noItems').length) {
      e.preventDefault();
      const errors = [
        {
          field: 'uploadEv',
          errors: ['Please upload at least one file']
        }
      ];
      this.handleErrorSummary(errors);
      this.handleInlineError(errors);
      return false;
    }
    return true;
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
        if (error) {
          $('.error-message').remove();
          $(`#${this.elId}`).val('');
          const pageErrors = (error.responseJSON && error.responseJSON.validationErrors) ?
            error.responseJSON.validationErrors :
            [
              {
                field: 'uploadEv',
                errors: ['Sorry, we are experiencing technical problems. Please try again later.']
              }
            ];

          this.handleErrorSummary(pageErrors);
          this.handleInlineError(pageErrors);
        }
      }
    });
  }
  attachEventListeners() {
    $(`#${this.elId}`).on('change', this.doTheUpload);
    $('.button').on('click', this.interceptSubmission);
  }
  detachEventListeners() {
    $(`#${this.elId}`).off('change', this.doTheUpload);
    $('.button').off('click', this.interceptSubmission);
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
