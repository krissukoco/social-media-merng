const mongoose = require('mongoose');

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
  bgPictureUrl: { type: String, default: '' },
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
