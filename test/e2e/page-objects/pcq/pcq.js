function completePcq() {
  // if (config.features.pcq.enabled === 'true') {
  const I = this;
  I.wait(3);
  // This will need to be changed to 'I don\'t want to answer these questions' once the PCQ side of SSCS is merged.
  I.click('I don\'t want to answer these questions');
  // }
}

module.exports = { completePcq };
