const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('../config');

module.exports = (token) => {
  let valid = true;
  let decoded;
  let errors = [];
  // TODO: Trim the bearer
  const now = () => Date.now();
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
};
