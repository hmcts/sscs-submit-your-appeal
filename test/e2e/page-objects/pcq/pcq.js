

function completePcq() {
  // if (config.features.pcq.enabled === 'true') {
  const I = this;
  I.wait(3);
  // This will need to be changed to 'I don\'t want to answer these questions' once the PCQ side of SSCS is merged.
  I.click('I don\'t want to answer these questions');
  // }
}


function completeAllPcq() {
  const I = this;
  I.wait(3);
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


module.exports = { completePcq,
  completeAllPcq };
