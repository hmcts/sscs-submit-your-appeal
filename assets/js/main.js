import $ from 'jquery';
import ShowHideContent from 'govuk/show-hide-content';
import accessibleAutocomplete from 'accessible-autocomplete';

$(document).ready(() => {
    initShowHideContent();
    initAutocomplete();
});

function initShowHideContent() {
    const showHideContent = new ShowHideContent();
    showHideContent.init();
}

function initAutocomplete() {
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        accessibleAutocomplete.enhanceSelectElement({
            selectElement: select
        });
    });
}
