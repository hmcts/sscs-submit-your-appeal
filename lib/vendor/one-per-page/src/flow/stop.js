class Stop {
  constructor(step) {
    if (typeof step === 'undefined') {
      throw new Error('Step given to redirect to is undefined');
    }
    this.nextStep = step;
  }

  redirect(req, res) {
    res.redirect(this.step.path);
  }

  get step() {
    return this.nextStep;
  }
}

module.exports = Stop;
