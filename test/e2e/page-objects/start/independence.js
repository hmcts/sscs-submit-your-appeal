// const paths = require('paths');

function continueFromIndependance(commonContent) {
  const I = this;
  // I.seeCurrentUrlEquals(paths.start.independence);
  // I.wait(1);
  // I.waitForClickable({
  //   css: `input[type=submit][value=${commonContent.continue}]`
  // });
  I.click(commonContent.continue);
}

module.exports = { continueFromIndependance };
