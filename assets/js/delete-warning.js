import $ from 'jquery';
import 'jquery-modal';

class DeleteWarning {
  constructor() {
    this.elExtend = $('#extend');

    this.deleteButton = document.querySelector('#delete');

    this.init = this.init.bind(this);
    this.destroy = this.destroy.bind(this);

    this.init();
  }

  navigateAway(event) {
    window.location.href = event.target.getAttribute('href');
  }

  stopDelete(event) {
    this.deleteButton.setAttribute('href', event.target.href);

    event.stopPropagation();
    event.preventDefault();

    const el = $('#delete-dialog');
    el.modal();
  }

  init() {
    this.attachHandlers();

    this.elExtend.on('click', () => {
      $.modal.close();
      this.attachHandlers();
    });
  }
  attachHandlers() {
    document.querySelectorAll('#delete-link').forEach((link) => {
      link.addEventListener('click', this.stopDelete.bind(this));
    });

    if (this.deleteButton) {
      this.deleteButton.addEventListener('click', this.navigateAway.bind(this));
    }
  }
  detachHandlers() {
    document.querySelectorAll('#delete-link').forEach((link) => {
      link.off('click', this.stopDelete.bind(this));
    });

    this.deleteButton.off('click', this.navigateAway.bind(this));
  }
  destroy() {
    this.detachHandlers();
    this.elExtend.off('click');
  }
}

export default DeleteWarning;
