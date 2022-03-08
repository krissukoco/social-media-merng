const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError, ApolloError } = require('apollo-server');

const User = require('../../models/User');
const { uploadImageS3 } = require('../../storage/imageHandlerS3');
const {
  validateRegister,
  validateLogin,
  validateUpdate,
  isPasswordStrong,
} = require('../../utils/validateUserInputs');
const { validateToken } = require('../../utils/validateToken');
const { checkIdValid } = require('../../utils/validateId');
const SECRET_KEY = process.env.SECRET_KEY;

// Helper functions
const TOKEN_EXP_DURATION = '1d';

const generateToken = (id, expiresInStr) => {
  const loginTime = new Date().toISOString();
  return jwt.sign(
    {
      id,
      loginTime,
    },
    SECRET_KEY,
    { expiresIn: expiresInStr }
  );
};

const hashPassword = async (password) => {
  const saltRounds = 10;

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw new ApolloError(error.message);
  }
};

const passwordHandler = async (inputPassword, userPassword) => {
  try {
    const res = await bcrypt.compare(inputPassword, userPassword);
    if (res) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    throw new ApolloError(error.message);
  }
};

// RESOLVERS USER
module.exports = {
  Query: {
    async getUser(_, { id }) {
      const isValidId = checkIdValid(id);
      if (!isValidId) {
        throw new UserInputError('User ID is incorrect');
      }
      const res = await User.findById(id);
      if (!res) {
        throw new UserInputError(
          'No such account exists. You entered a wrong User ID'
        );
      }

      // DO NOT SEND protected data
      const { password, _id, ...user } = res._doc;
      const resolve = { ...user, id: res._doc._id };

      return resolve;
    },

    async getSelf(_, vars, { req }) {
      const token =
        req.headers.authorization == 'null' ? '' : req.headers.authorization;
      const { valid, decoded, errors } = validateToken(token);
      if (!valid) {
        // Not throwing an error because user doesn't have to be authenticated
        return;
      }

      const id = decoded.id;
      const res = await User.findById(id);
      if (!res) {
        throw new UserInputError('Account does not exist');
      } else {
        const { password, _id, __v, ...user } = res._doc;
        const resolve = { ...user, id: res._doc._id };
        return resolve;
      }
    },
  },

  // MUTATIONS
  Mutation: {
    // STRUCTURE: resolverFunc(parents, args, context, info)

    // REGISTER USER
    async registerUser(_, { input }) {
      const { fullname, email, username, password, confirmPassword } = input;

      // Validate ALL input data
      const errors = validateRegister(input);
      if (errors.length !== 0) {
        for (let i in errors) {
          throw new UserInputError(errors[i]);
        }
      }

      // Check either email or username is taken
      const checkEmail = await User.findOne({ email });
      if (checkEmail) {
        throw new UserInputError(
          'The email has been registered. Please login to continue'
        );
      }
      const checkUsername = await User.findOne({ username });
      if (checkUsername) {
        throw new UserInputError(
          `Username: ${username} is taken. Please choose another one`
        );
      }

      // Hash password
      const encryptedPwd = await hashPassword(password);

      // Store user data in DB (Mongo)
      const newUser = new User({
        email,
        username,
        fullname,
        password: encryptedPwd,
        followers: [],
        following: [],
      });
      const res = await newUser.save();

      // Return LoginRegisterResponse typeDefs
      const token = generateToken(res._id, TOKEN_EXP_DURATION);
      return {
        userId: res._id,
        token: token,
      };
    },

    // LOGIN USER
    async loginUser(_, { input }) {
      const { emailOrUsername, password } = input;
      let user;

      // Validate ALL input data
      const { isEmail, errors } = validateLogin(input);
      if (errors.length !== 0) {
        for (let i = 0; i < errors.length; i++) {
          throw new UserInputError(errors[i]);
        }
      }

      // Check email/username and compare password
      if (isEmail) {
        user = await User.findOne({ email: emailOrUsername });
        if (!user) {
          throw new UserInputError('No account registered with this email');
        }
      } else {
        user = await User.findOne({ username: emailOrUsername });
        if (!user) {
          throw new UserInputError(`No account registered with this username`);
        }
      }

      const matched = await passwordHandler(password, user.password);
      if (!matched) {
        throw new UserInputError('Password is incorrect. Please try again');
      }

      // Return LoginRegisterResponse typeDefs
      const token = generateToken(user._id, TOKEN_EXP_DURATION);
      return {
        userId: user._id,
        token: token,
      };
    },

    // UPDATE USER DATA
    async updateUser(_, { input }, { req }) {
      // Validate input
      let { valid, errors, validatedInput } = validateUpdate(input);
      if (!valid) {
        for (let e of errors) {
          throw new UserInputError(e);
        }
      }

      // Get token, obtain userId
      const token = req.headers.authorization;
      if (!token) {
        throw new UserInputError('No Authorization Token Provided');
      }
      const {
        valid: tokenValid,
        errors: tokenErrors,
        decoded,
      } = validateToken(token);
      if (!tokenValid) {
        for (let err of tokenErrors) {
          throw new ApolloError(err);
        }
      }
      const userId = decoded.id;

      // Check username & email in DB
      // If it exists, EXCEPT when it's this user's username or email, throw error
      const { username, fullname, email, bio, location } = validatedInput;
      const checkUsername = await User.findOne({ username });
      if (checkUsername) {
        if (checkUsername._id != userId) {
          throw new UserInputError(
            `Username: "@${username}" already exists. Please pick another username`
          );
        }
      }
      const checkEmailUser = await User.findOne({ email: email });
      if (checkEmailUser) {
        if (checkEmailUser._id != userId) {
          throw new UserInputError(
            `Email: "${email}" already registered. Please pick other email`
          );
        }
      }

      // User data from DB & Update
      const user = await User.findById(userId);
      if (!user) {
        throw new UserInputError('No such account exists. Please login again');
      }
      user.username = username;
      user.fullname = fullname;
      user.email = email;
      user.bio = bio;
      user.location = location;

      // Save to DB & Return to client
      const newUser = await user.save();
      const { password, _id, __v, ...rest } = newUser._doc;
      const result = {
        ...rest,
        id: newUser._doc._id,
      };

      return result;
    },

    // FOLLOW USER
    async followUser(_, { id }, { req }) {
      // client : the one requested to follow a user
      // user   : to be followed
      // Check token, get the client's ID
      const token = req.headers.authorization;
      const { valid, errors, decoded } = validateToken(token);
      if (!valid) {
        for (err of errors) {
          throw new ApolloError(err);
        }
      }
      // Get client data from DB
      const clientId = decoded.id;
      if (clientId == id) {
        throw new ApolloError("Requester's ID is the same as User ID");
      }
      const client = await User.findById(clientId);
      if (!client) {
        throw new ApolloError(
          "Requester's account doesn't exist. Please send a correct User ID"
        );
      }
      const clientFollowing = client._doc.following;

      // Check user: if not has been followed
      if (clientFollowing.includes(id)) {
        throw new ApolloError('You have followed this User');
      }

      // Check user: if exists
      const user = await User.findById(id);
      if (!user) {
        throw new ApolloError(
          "This account doesn't exist. Please try another user"
        );
      }

      // Add user's ID to client's following array
      client.following.push(user._doc._id);
      const clientUpdate = await client.save();
      if (!clientUpdate) {
        throw new ApolloError('SERVER ERROR');
      }

      // Add client's ID to user's followers array
      user.followers.push(client._doc._id);
      const userUpdate = await user.save();
      if (!userUpdate) {
        throw new ApolloError('SERVER ERROR');
      }

      // Return client's new data
      const { _id, __v, password, ...rest } = clientUpdate._doc;
      const result = {
        ...rest,
        id: clientUpdate._doc._id,
      };
      return result;
    },

    // UNFOLLOW USER
    async unfollowUser(_, { id }, { req }) {
      // client : the one requested to follow a user
      // user   : to be unfollowed
      // Check token, get the client's ID
      const token = req.headers.authorization;
      const { valid, errors, decoded } = validateToken(token);
      if (!valid) {
        for (err of errors) {
          throw new UserInputError(err);
        }
      }
      // Get client data from DB
      const clientId = decoded.id;
      if (clientId == id) {
        throw new UserInputError("Requester's ID is the same as User ID");
      }
      const client = await User.findById(clientId);
      if (!client) {
        throw new UserInputError(
          "Requester's account doesn't exist. Please login"
        );
      }
      const clientFollowing = client._doc.following;

      // Check user: if not has NOT been followed
      if (!clientFollowing.includes(id)) {
        throw new UserInputError('You have NOT followed this User');
      }

      // Check user: if exists
      const user = await User.findById(id);
      if (!user) {
        throw new UserInputError(
          "This account doesn't exist. Please try another user"
        );
      }

      // Remove user's ID from client's following array
      client.following = client.following.filter(
        (item) => item.str != user._doc._id.str
      );
      const clientUpdate = await client.save();
      if (!clientUpdate) {
        throw new ApolloError('SERVER ERROR');
      }

      // Remove client's ID to user's followers array
      user.followers = user.followers.filter(
        (item) => item.str != client._doc._id.str
      );
      const userUpdate = await user.save();
      if (!userUpdate) {
        throw new ApolloError('SERVER ERROR');
      }

      // Return client's new data
      const { _id, __v, password, ...rest } = clientUpdate._doc;
      const result = {
        ...rest,
        id: clientUpdate._doc._id,
      };
      return result;
    },

    // CHANGE USER PASSWORD
    async changePassword(
      _,
      { oldPassword, newPassword, confirmPassword },
      { req }
    ) {
      if (newPassword === oldPassword) {
        throw new UserInputError('Password cannot be the same as the old one');
      }
      if (newPassword !== confirmPassword) {
        throw new UserInputError('Password does not match');
      }

      // Check token, get user ID
      const token = req.headers.authorization;
      const { valid, decoded, errors } = validateToken(token);
      if (!valid || !decoded.id) {
        for (e of errors) {
          throw new UserInputError('Authentication Token invalid');
        }
      }
      const userId = decoded.id;

      // Password handlings
      const user = await User.findById(userId);
      if (!user) {
        throw new UserInputError(
          'Account not found. Please enter correct informations'
        );
      }
      const pwd = user.password ? user.password : null;
      if (!pwd) {
        throw new ApolloError('SERVER ERROR');
      }
      // Compare
      const isPwdCorrect = await passwordHandler(oldPassword, pwd);
      if (!isPwdCorrect) {
        throw new UserInputError(
          'Old Password entered is wrong. Please try again'
        );
      }
      // Password strength
      const isPwdStrong = isPasswordStrong(newPassword);
      if (!isPwdStrong) {
        throw new UserInputError('New Password is not strong enough');
      }
      // Hash newPassword
      const hashedPwd = await hashPassword(newPassword);
      if (!hashedPwd) {
        throw new ApolloError('SERVER ERROR');
      }

      // Update user, with password = newPassword hashed
      user.password = hashedPwd;
      const res = await user.save();
      const { password, _id, __v, ...newUser } = res._doc;
      const result = {
        ...newUser,
        id: res._doc._id,
      };
      return result;
    },

    async uploadPersonalPicture(_, { image, type }, { req }) {
      // type must be either 'profile-picture' or 'background-image'
      if (type !== 'profile-picture' && type !== 'background-image') {
        throw new UserInputError(
          "Picture 'type' must only be either 'profile-picture' OR 'background-image'"
        );
      }

      // Check token, get user ID & data from DB
      const token = req.headers.authorization;
      const { valid, decoded, errors } = validateToken(token);
      if (!valid || !decoded.id) {
        for (e of errors) {
          throw new UserInputError('Authentication Token invalid');
        }
      }
      const userId = decoded.id;
      const user = await User.findById(userId);
      if (!user) {
        throw new UserInputError('User Account does not exist');
      }

      // Upload image to S3
      // uploadImageS3 has to take an array
      const { success, images: uploadRes } = await uploadImageS3([image]);
      if (!success) {
        throw new ApolloError(`Failed to upload ${type} image `);
      }
      const imgUrl = uploadRes[0].url;
      if (!imgUrl || imgUrl.length === 0) {
        throw new ApolloError('SERVER ERROR');
      }

      // Pass the imgUrl to DB
      switch (type) {
        case 'profile-picture':
          user.profilePictureUrl = imgUrl;
          break;
        case 'background-image':
          user.bgPictureUrl = imgUrl;
          break;
        default:
          break;
      }
      const res = await user.save();

      const { password, _id, __v, ...rest } = res._doc;
      const result = {
        ...rest,
        id: res._doc._id,
      };

      return result;
    },
  },
};
