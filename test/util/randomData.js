const generateValidNINumber = () => {
  // List of valid first two letter combinations (the starting letters follow some patterns,
  // but for simplicity, we will just allow any two letters)
  const firstLetters = ['AB'];

  // Pick a random starting combination (you could add more logic here to restrict starting letters)
  const firstPart = firstLetters[Math.floor(Math.random() * firstLetters.length)];

  // Generate six random digits and ensure it has 6 digits (with leading zeros if necessary)
  const digits = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');

  // List of valid ending letters (excluding 'O', 'I', 'Q')
  const validLastLetters = ['A', 'B', 'C', 'D'];

  // Pick a random ending letter
  const lastLetter = validLastLetters[Math.floor(Math.random() * validLastLetters.length)];

  // Combine parts into a valid NI number
  return `${firstPart}${digits}${lastLetter}`;
};

module.exports = { generateValidNINumber };