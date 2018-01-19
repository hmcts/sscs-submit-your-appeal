const app = require('app.js');
const portScanner = require('portscanner');

let testServer = {

    connect() {
        return new Promise((resolve) => {
            this.findAvailablePort().then((port)=> {
                resolve(app.listen(port))
            }).catch((error) => {
                console.log(error);
            });
        });
    },

    findAvailablePort() {
        return portScanner.findAPortNotInUse(
            app.get('portFrom'),
            app.get('portTo'),
            '127.0.0.1'
        );
    }

};

module.exports = testServer;
