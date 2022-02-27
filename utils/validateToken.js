const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('../config');

module.exports.validateToken = (token) => {
  let valid = false;
  let decoded;
  let errors = [];
  const now = () => Date.now();

  if (token.length > 0) {
    console.log('Original token: ', token);
    token = token.replace('Bearer ', '');
    console.log('Token inputed: ', token);

    // TODO: Decrypt, make sure it has data
    try {
      decoded = jwt.verify(token, SECRET_KEY);
      // const decoded = jwt.verify("ARBITRARYTOKEN", SECRET_KEY);
      if (!decoded) {
        errors.push('Token is invalid');
      }
    } catch (error) {
      console.log('error while verifying jwt: ', error);
      errors.push(error);
    }

    console.log('Decoded token: ', decoded);

    // TODO: Make sure it's not expired
    if (decoded.exp * 1000 < now()) {
      errors.push('expired');
    }

    // TODO: Return { valid, decoded, errors }
    valid = errors.length == 0 ? true : false;
    console.log('From validateToken: ', {
      valid,
      decoded,
      errors,
    });
    return {
      valid,
      decoded,
      errors,
    };
  } else if (!token || token == null || token.length == 0) {
    let res = {
      valid: false,
      decoded: null,
      errors: ['Token is empty'],
    };
    console.log('Brought to error. res: ', res);
    return res;
  }
};
