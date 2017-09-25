const logger = require('nodejs-logging').getLogger('testServer.js');
const portscanner = require('portscanner');
const errorHandler = require('lib/opp/core/errorHandler');
const crypto = require('services/crypto');
const app = require('app.js');

app.post('/session', (req, res) => {

    Object.assign(req.session, req.body);

    //  add sessionKey to cookie for testing
    const sessionKey = crypto.generateEncryptedKey();
    res.cookie('sessionKey', sessionKey);

    res.sendStatus(200);
});

app.get('/session', (req, res) => {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(req.session));
});

// set up the error handler
app.use(errorHandler(app.get('steps')));

const steps = app.get('steps');
const request = require('supertest');
const agent = request.agent(app);

class TestServer {

  connect() {
    return new Promise((resolve) => {
      this.findAvailablePort().then((port)=> {
        const server = app.listen(port);
        resolve( { server, steps, app, agent } );
      }).catch((error) => {
        logger.error(error);
      });
    });
  }

  findAvailablePort() {
    return portscanner.findAPortNotInUse(
      app.get('portFrom'),
      app.get('portTo'),
      '127.0.0.1'
    );
  }

}

module.exports = TestServer;
