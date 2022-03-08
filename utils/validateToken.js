const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('../config');

module.exports.validateToken = (token) => {
  let valid = false;
  let decoded;
  let errors = [];
  const now = () => Date.now();

  if (!token || token == 'undefined') {
    errors.push('You have to be authenticated');
    return { valid, decoded, errors };
  }

  if (token.length > 0) {
    token = token.split('Bearer ')[1];
    if (!token) {
      errors.push('You have to be authenticated');
      return { valid, decoded, errors };
    }

    // Decrypt, make sure it has data
    try {
      decoded = jwt.verify(token, SECRET_KEY);
      // const decoded = jwt.verify("ARBITRARYTOKEN", SECRET_KEY);
      if (!decoded) {
        errors.push('Token is invalid');
      }
    } catch (error) {
      console.error('ERROR while verifying jwt: ', error.message);
      errors.push(error.message);
    }

    // Make sure it's not expired
    if (decoded.exp * 1000 < now()) {
      errors.push('expired');
    }

    // Return { valid, decoded, errors }
    valid = errors.length === 0 ? true : false;
    return {
      valid,
      decoded,
      errors,
    };
  } else {
    let res = {
      valid: false,
      decoded: null,
      errors: ['You have to be authenticated'],
    };
    return res;
  }
};
