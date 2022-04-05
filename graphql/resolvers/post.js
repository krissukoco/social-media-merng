const { UserInputError, ApolloError } = require('apollo-server');
const mongoose = require('mongoose');

const User = require('../../models/User');
const Post = require('../../models/Post');
const {
  validateCreatePost,
  validateDeletePost,
} = require('../../utils/validatePost');
const { validateComment } = require('../../utils/validateCommentLike');
const { validateToken } = require('../../utils/validateToken');
const { uploadImageS3 } = require('../../storage/imageHandlerS3');

const { checkIdValid } = require('../../utils/validateId');

module.exports = {
  Query: {
    // GET ONE POST
    async getPost(_, { id }) {
      try {
        const isValidId = checkIdValid(id);
        if (!isValidId) {
          throw new UserInputError('Post ID is invalid');
        }
        const post = await Post.findOne({ _id: id });
        if (!post) {
          throw new UserInputError('Post not found');
        }
        return {
          ...post._doc,
          id: post._id,
        };
      } catch (error) {
        throw new ApolloError(error);
      }
    },

    // GET POSTS -> Latest sorted on createdAt
    async getFeedLatest(_, { limit }) {
      let posts = [];
      // Default is to give 10 posts
      let lim = limit ? limit : 10;

      let res = await Post.find().sort({ createdAt: -1 }).limit(lim);
      for (let p of res) {
        const { _id, __v, ...result } = p._doc;
        posts.push({
          ...result,
          id: _id,
        });
      }

      return posts;
    },

    // Get posts from all "following"
    async getFeedFollowing(_, { limit }, { req }) {
      let posts = [];
      let lim = limit ? limit : 10; // 10 is the default limit
      const token = req.headers.authorization;

      // Validate the token & give back the decoded data
      const { valid, decoded, errors } = validateToken(token);
      if (!valid) {
        for (let e of errors) {
          throw new UserInputError(e);
        }
      }

      // Get the "following" array
      const isValidUserId = checkIdValid(decoded.id);
      if (!isValidUserId) {
        throw new UserInputError('User is incorrect');
      }
      const user = await User.findById(decoded.id);
      const followingId = user.following; // ID string

      // Get all posts from all followings
      if (followingId.length == 0) {
        return posts;
      }
      for (let u of followingId) {
        let res = await Post.find({ user: mongoose.Types.ObjectId(u) }); // array of posts
        for (let p of res) {
          const { _id, __v, ...result } = p._doc;
          posts.push({
            ...result,
            id: _id,
          });
        }
      }
      return posts;
    },

    // GET ALL POSTS CREATED BY A USER
    async getPostsByUser(_, { userId, limit }) {
      try {
        const p = await Post.find({ user: userId })
          .limit(limit)
          .sort({ createdAt: -1 });
        const posts = Array.from(p);

        const res = posts.map((post) => {
          const { _id, __v, ...rest } = post._doc;
          const result = {
            ...rest,
            id: post._id,
          };
          return result;
        });

        return res;
      } catch (error) {
        throw new ApolloError(error.message);
      }
    },
  },

  // ======= MUTATION =======
  Mutation: {
    // Create a post
    async createPost(_, { input }, { req }) {
      const token = req.headers.authorization;

      let newPost;
      const { valid, errors, validatedInput, userId } = validateCreatePost(
        input,
        token
      );
      if (!valid) {
        errors.forEach((e) => {
          throw new UserInputError(e);
        });
      }

      // Upload images to S3, if there's any
      let s3ImgUrls = [];
      if (validatedInput.images.length > 0) {
        const { success, images: uploadRes } = await uploadImageS3(
          validatedInput.images
        );
        if (!success) {
          throw new ApolloError('Failed to upload images');
        }
        s3ImgUrls = uploadRes.map((img) => img.url);
      }

      // Post instance
      newPost = new Post({
        body: validatedInput.body,
        user: userId,
        postType: validatedInput.postType,
        imgUrls: s3ImgUrls,
        comments: [],
        likes: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // Save the post
      const res = await newPost.save();

      // Return the Post type
      const { _id, __v, ...rest } = res._doc;
      return {
        ...rest,
        id: res._doc._id,
      };
    },

    // CREATE COMMENT TO A POST
    async createComment(_, { postId, text }, { req }) {
      // Token required
      const token = req.headers.authorization;
      const { valid, errors, userId } = validateComment(text, token);
      if (!valid) {
        errors.forEach((e) => {
          throw new UserInputError(e);
        });
      }

      try {
        const newComment = {
          body: text,
          user: userId,
        };
        const post = await Post.findById(postId);
        post.comments.push(newComment);

        const res = await post.save();

        // Re-get the updated post, return to client
        const newPost = await Post.findById(postId);
        if (!newPost) {
          throw new UserInputError('Post not found (to comment on)');
        }
        const { _id, __v, ...result } = newPost._doc;

        const response = {
          ...result,
          id: newPost._id,
        };
        return response;
      } catch (e) {
        console.error(e.message);
        throw new ApolloError('CANNOT UPDATE the post: ', e.message);
      }
    },

    // LIKE A POST
    async likePost(_, { postId }, { req }) {
      // Check token, get the client's ID
      const token = req.headers.authorization;
      const { valid, errors, decoded } = validateToken(token);
      if (!valid) {
        // for (err of errors) {
        throw new UserInputError(errors[0]);
        // }
      }
      // Get client data from DB
      const clientId = decoded.id;
      const client = await User.findById(clientId);
      if (!client) {
        throw new UserInputError('Your authentication is incorrect');
      }
      //  Get post data from DB
      const post = await Post.findById(postId);
      if (!post) {
        throw new UserInputError('Post not found (to like to)');
      }

      // Check if user already likes
      const usersLiked = post._doc.likes.map((like) => like.user);
      if (usersLiked.includes(clientId)) {
        throw new UserInputError('You already liked this post');
      }
      // If not, then add userId in likes
      const newLike = {
        user: clientId,
      };
      post.likes.push(newLike);

      // Save and return new post
      const newPost = await post.save();
      if (!newPost) {
        throw new ApolloError('SERVER ERROR');
      }
      const { _id, __v, ...rest } = newPost._doc;
      const result = {
        ...rest,
        id: newPost._doc._id,
      };
      return result;
    },

    // UNLIKE A POST
    async unlikePost(_, { postId }, { req }) {
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
      const client = await User.findById(clientId);
      if (!client) {
        throw new ApolloError('User Authentication is incorrect');
      }
      //  Get post data from DB
      const post = await Post.findById(postId);
      if (!post) {
        throw new UserInputError('Post not found');
      }

      // Check if user already not liked
      const usersLiked = post.likes.map((like) => like.user.toString());
      if (!usersLiked.includes(clientId)) {
        throw new UserInputError('You HAVE NOT liked this post');
      }
      // If yes, then remove userId in likes
      post.likes = post.likes.filter(
        (item) => item.user.str != client._doc._id.str
      );

      // Save and return new post
      const newPost = await post.save();
      if (!newPost) {
        throw new ApolloError('SERVER ERROR');
      }
      const { _id, __v, ...rest } = newPost._doc;
      const result = {
        ...rest,
        id: newPost._doc._id,
      };
      return result;
    },

    // DELETE A POST
    async deletePost(_, { id: postId }, { req }) {
      const token = req.headers.authorization;
      let success = false;

      // Find the post by ID. If doesn't exist, throw error
      const post = await Post.findById(postId);
      if (!post) {
        throw new UserInputError(`Post doesn't exist`);
      }
      const postUserId = post.user.toString();

      // Decode and verify token. decoded.id must be equal to post.userId
      const { valid, errors } = validateDeletePost(token, postUserId);
      if (!valid) {
        for (let e of errors) {
          throw new UserInputError(e);
        }
      }

      // Delete Post
      const doc = await post.remove();
      if (doc) {
        success = true;
      }

      const res = {
        success,
        postId,
        deletedAt: new Date().toISOString(),
      };

      return res;
    },
  },
};
