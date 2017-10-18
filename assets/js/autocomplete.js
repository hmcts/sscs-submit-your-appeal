import accessibleAutocomplete from 'accessible-autocomplete';

document.addEventListener("DOMContentLoaded", function(event) {
    const selects = document.querySelectorAll('select');

    selects.forEach(select => {
        accessibleAutocomplete.enhanceSelectElement({
            selectElement: select,
        });
    });
});
