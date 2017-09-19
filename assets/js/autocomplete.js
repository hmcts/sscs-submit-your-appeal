document.addEventListener("DOMContentLoaded", function(event) {

    const $container = document.querySelector('#autocomplete-benefit-container');

    if($container) {
        const benefits = [
            'Attendance Allowance',
            'Bereavement Benefit',
            'Carer’s Allowance',
            'Child Benefit',
            'Disability Living Allowance (DLA)',
            'Employment and Support Allowance (ESA)',
            'Home Responsibilities Protection',
            'Housing Benefit',
            'Incapacity Benefit',
            'Income Support',
            'Industrial Injuries Disablement',
            'Jobseeker’s Allowance (JSA)',
            'Maternity Allowance',
            'Personal Independence Payment (PIP)',
            'Severe Disablement Allowance',
            'Social Fund',
            'Universal Credit (UC)'
        ];

        accessibleAutocomplete({
            element: $container,
            id: 'benefit-autocomplete',
            source: benefits
        })
    }

});
