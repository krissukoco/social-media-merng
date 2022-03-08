const postTypes = require('../misc/postTypes');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('../config');
const { validateToken } = require('./validateToken');

// CREATE POST
module.exports.validateCreatePost = (input, token) => {
  let userId;
  let poll;
  let images = input.images;
  let errors = [];
  // NOT EMPTY: postType, body, token
  if (input.postType.length === 0) {
    errors.push('postType should not be empty');
  }
  if (input.body.length === 0) {
    errors.push('post body should not be empty');
  }
  if (token.length === 0) {
    errors.push('token should not be empty');
  }

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

  // If postType === "image", then images should not be empty
  if (input.postType == 'image') {
    if (!input.images || input.images == 0) {
      errors.push('images should not be empty');
    }
  } else {
    images = [];
  }

  // Set validatedData
  const validatedInput = {
    postType: input.postType,
    body: input.body,
    token: token,
    images,
    poll,
  };

  const valid = errors.length === 0;
  return { valid, errors, validatedInput, userId };
};

// DELETE POST
module.exports.validateDeletePost = (token, userId) => {
  let errors = [];

  const tokenValidation = validateToken(token);
  if (!tokenValidation.valid) {
    for (let e in tokenValidation.errors) {
      errors.push(e);
    }
  } else {
    const decodedData = tokenValidation.decoded;
    tokenUserId = decodedData.id;
  }

  // User ID from token is the same by ID provided
  if (userId !== tokenUserId) {
    errors.push(`You HAVE NO authorization to delete post`);
  }

  const valid = errors.length == 0 ? true : false;

  return {
    valid,
    errors,
  };
};
