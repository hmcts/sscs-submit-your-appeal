// Minimal flow helpers shim

function goTo(step) {
  return { nextStep: step };
}

function redirectTo(step) {
  return { nextStep: step, redirect: true };
}

function branch(...conds) {
  return conds[0] || {};
}

function action() {
  return {};
}

module.exports = { goTo, redirectTo, branch, action };
