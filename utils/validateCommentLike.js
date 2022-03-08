const { validateToken } = require('../utils/validateToken');

module.exports.validateComment = (commentText, token) => {
  let valid = false;
  let errors = [];
  let userId;

  // Token => get user id
  const tokenValidation = validateToken(token);
  if (!tokenValidation.valid) {
    for (let e in tokenValidation.errors) {
      errors.push(e);
    }
  } else {
    const decodedData = tokenValidation.decoded;
    userId = decodedData.id;
  }

  //  Make sure comment text not empty
  if (!commentText || commentText.length == 0) {
    errors.push('Comment cannot be empty');
  }

  // Valid = true if no errors
  if (errors.length === 0) {
    valid = true;
  }

  return { valid, errors, userId };
};
