const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { UserInputError } = require('apollo-server');

const User = require('../../models/User');
const {
  validateRegister,
  validateLogin,
} = require('../../utils/validateUserInputs');
const { SECRET_KEY } = require('../../config');

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
  let hashedPassword;
  const saltRounds = 10;

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  } catch (error) {
    throw new Error(error);
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
    throw new Error(error);
  }
};

module.exports = {
  Query: {
    async getUser(_, { id }) {
      const res = await User.findById(id);
      console.log('getUser res: ', res);
      if (!res) {
        throw new UserInputError(
          'No such account exists. You entered a wrong User ID'
        );
      }

      // TODO: Make sure password IS NOT SENT BACK
      const { password, updatedAt, ...user } = res._doc;
      console.log('User: ', user);

      return user;
    },
  },
  Mutation: {
    // registerUser(parents, args, context, info)
    async registerUser(_, { input }) {
      const { fullname, email, username, password, confirmPassword } = input;

      // TODO: Validate ALL input data
      const errors = validateRegister(input);
      if (errors.length !== 0) {
        for (let i = 0; i < errors.length; i++) {
          throw new UserInputError(errors[i]);
        }
      }

      // TODO: Check either email or username is taken
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

      // TODO: Hash password
      const encryptedPwd = await hashPassword(password);

      // TODO: Store user data in DB (Mongo)
      const newUser = new User({
        email,
        username,
        fullname,
        password: encryptedPwd,
        followers: [],
        following: [],
      });
      const res = await newUser.save();

      // TODO: Return LoginRegisterResponse typeDefs
      const token = generateToken(res._id, '1h');
      return {
        userId: res._id,
        token: token,
      };
    },

    async loginUser(_, { input }) {
      const { emailOrUsername, password } = input;
      let user;

      // TODO: Validate ALL input data
      const { isEmail, errors } = validateLogin(input);
      if (errors.length !== 0) {
        for (let i = 0; i < errors.length; i++) {
          throw new UserInputError(errors[i]);
        }
      }

      // TODO: Check email/username and compare password
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

      // TODO: Return LoginRegisterResponse typeDefs
      const token = generateToken(user._id, '1d');
      return {
        userId: user._id,
        token: token,
      };
    },
  },
};
