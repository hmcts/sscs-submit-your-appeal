const app = require('app.js');
const portscanner = require('portscanner');

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
        return portscanner.findAPortNotInUse(3000, 3050, '127.0.0.1');
    }

};

module.exports = testServer;
