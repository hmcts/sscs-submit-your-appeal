const paths = require('paths');

function continueFromIndependance() {
  const I = this;
  I.seeCurrentUrlEquals(paths.start.independence);
  I.waitForClickable({
    css: 'input[type=submit][value=Continue]'
  });
  I.click('Continue');
}

module.exports = { continueFromIndependance };
