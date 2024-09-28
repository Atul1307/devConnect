const validator = require('validator');

const isValidSignup = (req) => {
  const { firstName, lastName, emailId, password } = req;
  if (!firstName || !lastName) {
    throw new Error('firstName or lastName not present');
  }
  if (firstName.length < 4 || firstName.length > 50) {
    throw new Error('firstName should be between 4 and 50 characters');
  }
  if (lastName.length < 2 || lastName.length > 50) {
    throw new Error('lastName should be between 4 and 50 characters');
  }
  if (!validator.isEmail(emailId)) {
    throw new Error('Please enter a valid email');
  }
  if (!validator.isStrongPassword(password)) {
    throw new Error('Please enter a strong password');
  }
};

module.exports = { isValidSignup };
