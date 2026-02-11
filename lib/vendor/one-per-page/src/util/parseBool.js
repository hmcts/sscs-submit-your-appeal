const truthies = ['true', 'True', 'TRUE', '1', 'yes', 'Yes', 'YES', 'y', 'Y'];

const parseBool = (bool = '') => {
  if (truthies.includes(String(bool))) {
    return true;
  }
  return false;
};

module.exports = parseBool;