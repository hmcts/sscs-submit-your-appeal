// Minimal checkYourAnswers shim

function answer(page, opts) {
  return {
    question: opts.question || '',
    answer: opts.answer || '',
    section: opts.section || ''
  };
}

function section(name, opts) {
  return { name, opts };
}

module.exports = { answer, section };
