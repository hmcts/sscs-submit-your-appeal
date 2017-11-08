const app = require('app.js');
const portscanner = require('portscanner');
const config = require('config');
const port = config.node.port;

let testServer = {

    connect() {
        return new Promise((resolve, reject) => {
            this.findAvailablePort()
                .then(port => {
                    let server = app.listen(port);
                    resolve(server)
                }).catch(error => {
                    console.log(error);
                });
        });
    },

    findAvailablePort() {
        return portscanner.findAPortNotInUse(port, port + 50, '127.0.0.1');
    }

};

module.exports = testServer;
