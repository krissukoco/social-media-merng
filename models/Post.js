const mongoose = require('mongoose');

const pollSchema = require('./schema/pollSchema');

// TYPES OF POSTS:
// "standard": body only (twitter-like)
// "image": image with captions (instagram-like)
// "poll": poll with caption (linkedin/youtube-like)

const postSchema = new mongoose.Schema({
  body: { type: String, required: true },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
  },
  postType: { type: String, required: true },
  imgUrls: [{ type: String, required: true }],
  poll: pollSchema,
  createdAt: {
    type: String,
    required: true,
    default: () => new Date().toISOString(),
  },
  updatedAt: {
    type: String,
    required: true,
    default: () => new Date().toISOString(),
  },
  comments: [
    {
      body: { type: String, required: true },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      createdAt: {
        type: String,
        required: true,
        default: () => new Date().toISOString(),
      },
    },
  ],
  likes: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true,
      },
      createdAt: {
        type: String,
        required: true,
        default: () => new Date().toISOString(),
      },
    },
  ],
});

module.exports = mongoose.model('posts', postSchema);
