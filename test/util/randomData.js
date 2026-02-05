const generateValidNINumber = () => {
  // List of valid first two letter combinations (the starting letters follow some patterns,
  // but for simplicity, we will just allow any two letters)
  const firstLetters = ['AB'];

  const firstPart =
    firstLetters[Math.floor(Math.random() * firstLetters.length)];

  const digits = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, '0');

  const validLastLetters = ['A', 'B', 'C', 'D'];

  const lastLetter =
    validLastLetters[Math.floor(Math.random() * validLastLetters.length)];

  // Combine parts into a valid NI number
  return `${firstPart}${digits}${lastLetter}`;
};

module.exports = { generateValidNINumber };
