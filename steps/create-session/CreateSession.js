const { BaseStep } = require('@hmcts/one-per-page');
const urls = require('urls');

class CreateSession extends BaseStep {

    get url() {
        return urls.session.createSession
    }

    handler(req, res) {
        req.session.generate();
        req.session.username = 'Paul';
        req.session.Name_firstName = 'Paul';
        req.session.Name_lastName = 'Gain';
        res.redirect('/sessions');
    }
}

module.exports = CreateSession;
