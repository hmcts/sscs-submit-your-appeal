/*
 * TreeWalker
 *
 * A class that encapsulates walking the tree of steps safely.
 *
 * Expects an iterate function that accepts a block and results obj and
 * either returns a TreeWalker to continue walking or the results.
 **/
class TreeWalker {
  constructor(step, iterate) {
    this.step = step;
    this.iterate = iterate;
  }

  map(block) {
    return this.trampoline(this, step => block(step));
  }

  walk() {
    return this.trampoline(this, step => step);
  }

  last() {
    const steps = this.walk();
    return steps[steps.length - 1];
  }

  // Trampolines are a way of doing recursion when your language doesn't support
  // tail call optimisation. Standard recursion would lead to the stack growing
  // to overflow.
  //
  // Instead we use the trampoline to bounce the stack. It executes the iterate
  // function of the TreeWalker it's given. If that TreeWalker returns a
  // TreeWalker it will continue executing them until a result is returned.
  //
  // We also include some loop breaking to ensure that we don't query the same
  // step multiple times, as that would indicate a possible infinite loop.
  //
  // For more reading on trampolines, this blog is pretty good:
  // http://raganwald.com/2013/03/28/trampolines-in-javascript.html
  trampoline(treeWalker, block, results = []) {
    let walkerOrResults = treeWalker;
    const visits = new Set();
    while (walkerOrResults instanceof TreeWalker) {
      walkerOrResults = walkerOrResults.iterate(step => {
        if (visits.has(step)) {
          throw new Error('possible infinite loop detected');
        }
        visits.add(step);

        return block(step);
      }, results);
    }
    return walkerOrResults;
  }
}

/**
 * Validates the step then causes the tree walking to stop.
 **/
const validateThenStopHere = step => new TreeWalker(
  step,
  (block, results) => {
    step.retrieve().validate();
    return [...results, block(step)];
  }
);

/**
 * Stops walking the tree and returns the results.
 **/
const stopHere = step => new TreeWalker(
  step,
  (block, results) => [...results, block(step)]
);

/**
 * Validates the current step and if valid continues down the tree by calling
 * the steps next function.
 **/
const ifCompleteThenContinue = step => new TreeWalker(
  step,
  (block, results) => {
    step.retrieve().validate();
    results.push(block(step));
    if (step.valid) {
      const next = step.journey.instance(step.next().step);
      return next.flowControl;
    }
    return results;
  }
);

const continueToNext = step =>
  new TreeWalker(step, (block, results) => {
    const next = step.journey.instance(step.next().step);
    results.push(block(step));
    return next.flowControl;
  });

const stopHereIfNextIsInvalid = step => new TreeWalker(
  step,
  (block, results) => {
    const next = step.journey.instance(step.next().step);
    results.push(block(step));
    const scopedResults = [];

    const resultsOrWalker = next.flowControl.iterate(block, scopedResults);

    if (Array.isArray(resultsOrWalker)) {
      return results;
    }
    if (resultsOrWalker instanceof TreeWalker) {
      scopedResults.forEach(result => results.push(result));
      return resultsOrWalker;
    }
    throw new Error(`Expected results or TreeWalker, got ${resultsOrWalker}`);
  }
);

module.exports = {
  stopHere,
  validateThenStopHere,
  ifCompleteThenContinue,
  continueToNext,
  stopHereIfNextIsInvalid
};
