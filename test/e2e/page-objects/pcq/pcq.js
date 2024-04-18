

function skipPcq() {
  // if (config.features.pcq.enabled === 'true') {
  const I = this;
  I.wait(5);
  // This will need to be changed to 'I don\'t want to answer these questions' once the PCQ side of SSCS is merged.
  I.click('I don\'t want to answer these questions');
  // }
}


function skipPcqCY() {
  const I = this;
  I.wait(5);
  I.waitForText('Dydw i ddim eisiau ateb y cwestiynau hyn');
  I.click('Dydw i ddim eisiau ateb y cwestiynau hyn');
}


function completeAllPcq() {
  const I = this;
  I.wait(5);
  I.waitForText('Continue to the question');
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
  I.wait(5);
  I.waitForText('Ymlaen i’r cwestiynau');
  I.click('Ymlaen i’r cwestiynau');
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
