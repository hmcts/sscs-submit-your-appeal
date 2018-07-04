import $ from 'jquery';
import fieldTemplates from '@hmcts/look-and-feel/templates/look-and-feel/components/fields.njk';
import errorSummary from '@hmcts/look-and-feel/templates/look-and-feel/components/errors.njk';
import fileTypeWhiteList from '../../../steps/reasons-for-appealing/evidence-upload/fileTypeWhitelist.js';

class EvidenceUpload {
  constructor(elContainer) {
    this.elContainer = elContainer;
    this.formId = 'evidence-upload-form';
    this.elId = 'uploadEv';
    this.listToRead = '.add-another-list';

    this.handleClickOnList = this.handleClickOnList.bind(this);
    this.doTheUpload = this.doTheUpload.bind(this);

    fieldTemplates.getExported(this.setup.bind(this));
  }
  getNumberForNextItem() {
    // todo make this less fragile
    const nodes = $(this.listToRead + ' dd.add-another-list-item')
      .toArray()
      .map((item) => {
        return parseInt(item.id.split('-').pop(), 10);
      })
      .sort();
    let num = 0;
    while (nodes.indexOf(num) !== -1) {
      num++;
    }
    return num;
  }
  setup(error, components) {
    // give it the time to finish painting the dom...
    window.setTimeout(() => {
      if (components && components.fileupload) {
        this.numberForNextItem = this.getNumberForNextItem();
        this.formAction = '/evidence-upload/item-' + this.numberForNextItem;
        this.fileupload = components.fileupload(this.elId, null, fileTypeWhiteList);
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
  hideUnnecessaryMarkup() {
    $('.add-another-add-link').hide();
    $('.add-another-edit-link').css('visibility', 'hidden');
  }
  doTheUpload() {
    //$('#' + this.formId)[0].submit();
    const formData = new FormData(document.getElementById(this.formId));
    const docName = $('#' + this.elId).val().split('\\').pop();
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
      error: (error) => {
        console.info('$deity give me strength', error)
      }
    });
  }
  handleClickOnList(e) {
/*    if ($(e.target).hasClass('add-another-edit-link')) {
      e.preventDefault();
    }*/
  }
  attachEventListeners() {
    $('#' + this.elId).on('change', this.doTheUpload);
    $(this.listToRead).on('click', this.handleClickOnList);
  }
  detachEventListeners() {
    $('#' + this.elId).off('change', this.doTheUpload);
    $(this.listToRead).off('click', this.handleClickOnList)
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