const mongoose = require('mongoose');

// const generateUserId = () => {
//   // Generate unique user id as string
//   // Formula: "<random 4-digit number>" + "-" + "<curent-date-as-string>"
//   const now = Date.now().toString();
//   const secondPart = now.substring(now.length - 4);

//   const min = 1000;
//   const max = 9999;
//   const digits = (Math.floor(Math.random() * (max - min + 1)) + min).toString();

//   return digits + '-' + secondPart;
// };

const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  username: { type: String, required: true },
  fullname: { type: String, required: true },
  password: { type: String, required: true },
  followers: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
    default: [],
    required: true,
  },
  following: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
      },
    ],
    default: [],
    required: true,
  },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  profilePictureUrl: { type: String, default: '' },
  createdAt: {
    type: String,
    default: () => new Date().toISOString(),
  },
  updatedAt: {
    type: String,
    required: true,
    default: () => new Date().toISOString(),
  },
});

module.exports = mongoose.model('users', userSchema);
