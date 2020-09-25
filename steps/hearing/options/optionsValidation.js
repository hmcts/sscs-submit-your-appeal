const validOptions = require('steps/hearing/options/options');

const emptyTelephoneValidation = value => (!(value.option === validOptions.telephone && !value.telephone));
const emptyEmailValidation = value => (!(value.option === validOptions.video && !value.email));

module.exports = {
    emptyTelephoneValidation,
    emptyEmailValidation
}
