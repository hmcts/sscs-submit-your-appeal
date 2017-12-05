const router = require('express').Router();
const paths = require('paths');
const { postCode, inwardPostcode } = require('utils/regex');
const enterPostcodeContent = require('./enter-postcode/content.en.json');
const invalidPostcodeContent = require('./postcode-invalid/content.en.json');
const postcodeList = require('valid-postcode-pages/validPostcodeList');

const postcodeIsValid = value => value.match(postCode);
const postcodeInList = postcode => postcodeList.includes(postcode.toUpperCase());
const splitPostcode = postcode => postcode.replace(inwardPostcode, "").replace(/\s+/, "");

const fields = {
    postcode: {
        name: 'postcode',
        id: 'postcode'
    }
};

router.get(paths.validPostcode.postcodeCheck, (req, res) => {
    res.render('enter-postcode/template.html', Object.assign({}, {content: enterPostcodeContent}, {fields}));
});

router.post(paths.validPostcode.postcodeCheck, (req, res) => {
    const postcodeValue = req.body.postcode;
    if (postcodeIsValid(postcodeValue)) {
        const outcode = splitPostcode(postcodeValue);
        if (postcodeInList(outcode)) {
            res.redirect(paths.session.entry);
        } else {
            res.redirect(paths.validPostcode.invalidPostcode);
        }
    } else {
        const errors = enterPostcodeContent.fields.postcode.error;
        const errorMessage = postcodeValue === '' ? errors.required : errors.invalid;
        const field = JSON.parse(JSON.stringify(fields));
        field.validated = true;
        field.errors = [{
            id: 'postcode',
            message: errorMessage
        }];
        field.postcode.value = postcodeValue;
        field.postcode.errors = [
            errorMessage
        ];
        res.render('enter-postcode/template.html', Object.assign({}, {content: enterPostcodeContent}, {fields: field}));
    }
});

router.get(paths.validPostcode.invalidPostcode, (req, res) => {
    res.render('postcode-invalid/template.html', {content: invalidPostcodeContent});
});

module.exports = router;
