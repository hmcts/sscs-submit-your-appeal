async function skipPcq() {
  const I = this;
  I.wait(5);
  const url = await I.getPageUrl();
  console.log('page url: ', url);
  I.click('I don\'t want to answer these questions');
}

async function skipPcqCY() {
  const I = this;
  I.wait(5);
  const url = await I.getPageUrl();
  console.log('page url: ', url);
  I.click('Dydw i ddim eisiau ateb y cwestiynau hyn');
}


function completeAllPcq() {
  const I = this;
  I.wait(1);
  I.see('Continue to the question');
  I.click('Continue to the question');
  I.checkPCQOptionAndContinue('#language_main');
  I.checkPCQOptionAndContinue('#sex');
  I.checkPCQOptionAndContinue('#gender_different');
  I.checkPCQOptionAndContinue('#sexuality');
  I.checkPCQOptionAndContinue('#marriage-2');
  I.checkPCQOptionAndContinue('#ethnic_group');
  I.checkPCQOptionAndContinue('#ethnicity-2');
  I.checkPCQOptionAndContinue('#religion-3');
  I.checkPCQOptionAndContinue('#pregnancy-2');
  I.click('Continue');
}

function completeAllPcqCY() {
  const I = this;
  I.wait(1);
  I.click('Ymlaen');
  I.checkCYPCQOptionAndContinue('#language_main');
  I.checkCYPCQOptionAndContinue('#sex');
  I.checkCYPCQOptionAndContinue('#gender_different');
  I.checkCYPCQOptionAndContinue('#sexuality');
  I.checkCYPCQOptionAndContinue('#marriage-2');
  I.checkCYPCQOptionAndContinue('#ethnic_group');
  I.checkCYPCQOptionAndContinue('#ethnicity-2');
  I.checkCYPCQOptionAndContinue('#religion-3');
  I.checkCYPCQOptionAndContinue('#pregnancy-2');
  I.click('Symud ymlaen');
}


module.exports = { skipPcq,
  completeAllPcq,
  skipPcqCY,
  completeAllPcqCY };
