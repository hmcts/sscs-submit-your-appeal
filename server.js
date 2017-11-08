const app = require('app.js');
const config = require('config');

app.listen(config.node.port);

console.log(`SYA started on port:${config.node.port}`);
