const postTypes = require('../misc/postTypes');
const jwt = require('jsonwebtoken');

const { SECRET_KEY } = require('../config');
const validateToken = require('./validateToken');

module.exports.validateCreatePost = (input) => {
  let userId;
  let poll;
  let imgUrls;
  let errors = [];
  let token = input.token;
  // TODO: NOT EMPTY: postType, body, token
  if (input.postType.length === 0) {
    errors.push('postType should not be empty');
  }
  if (input.body.length === 0) {
    errors.push('post body should not be empty');
  }
  if (input.token.length === 0) {
    errors.push('token should not be empty');
  }

  // TODO: Token => get user id
  const tokenValidation = validateToken(token);
  console.log('tokenValidation: ', tokenValidation);
  if (!tokenValidation.valid) {
    for (let e in tokenValidation.errors) {
      errors.push(e);
    }
  } else {
    const decodedData = tokenValidation.decoded;
    userId = decodedData.id;
    console.log('userId from token: ', userId);
  }

  // TODO: If postType === "image", then imgUrls should not be empty
  if (input.postType == 'image') {
    if (!input.imgUrls || input.imgUrls == 0) {
      errors.push('imgUrls should not be empty');
    }
  } else {
    imgUrls = [];
  }

  // TODO: If postType === "poll", then poll should not be empty
  if (input.postType == 'poll') {
    if (!input.poll || input.poll.choices.length == 0) {
      errors.push('Poll object is not present or incorrect');
    }
  } else {
    poll = {
      caption: '',
      choices: [],
    };
  }

  // TODO: Set validatedData
  const validatedInput = {
    postType: input.postType,
    body: input.body,
    token: token,
    imgUrls,
    poll,
  };

  const valid = errors.length === 0;
  return { valid, errors, validatedInput, userId };
};

module.exports.validateDeletePost = (token, userId) => {
  let errors = [];

  const tokenValidation = validateToken(token);
  console.log('tokenValidation delete post: ', tokenValidation);
  if (!tokenValidation.valid) {
    for (let e in tokenValidation.errors) {
      errors.push(e);
    }
  } else {
    const decodedData = tokenValidation.decoded;
    tokenUserId = decodedData.id;
  }

  // TODO: User ID from token is the same by ID provided
  if (userId !== tokenUserId) {
    console.log('userId: ', userId);
    console.log('tokenUserId: ', tokenUserId);
    errors.push(`The user ${tokenUserId} has no authorization to delete post`);
  }

  const valid = errors.length == 0 ? true : false;
  console.log('From validateDeletePost: ', valid, errors);

  return {
    valid,
    errors,
  };
};
