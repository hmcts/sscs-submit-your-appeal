import $ from 'jquery';
import ShowHideContent from 'govuk/show-hide-content';

$(document).ready(() => {
    initShowHideContent();
});

function initShowHideContent() {
    const showHideContent = new ShowHideContent();
    showHideContent.init();
}
