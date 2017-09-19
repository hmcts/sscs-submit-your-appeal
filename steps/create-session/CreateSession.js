const { BaseStep } = require('@hmcts/one-per-page');

class CreateSession extends BaseStep {

    get url() {
        return '/create-session';
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
