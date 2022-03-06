const { UserInputError, ApolloError } = require('apollo-server');

const User = require('../../models/User');
const Post = require('../../models/Post');
const {
  validateCreatePost,
  validateDeletePost,
} = require('../../utils/validatePost');
const { validateComment } = require('../../utils/validateCommentLike');
const { validateToken } = require('../../utils/validateToken');
const { uploadImageS3 } = require('../../storage/imageHandlerS3');

module.exports = {
  Query: {
    async getPost(_, { id }) {
      try {
        const post = await Post.findById(id);
        if (!post) {
          throw new UserInputError('Post not found');
        }
        console.log('Post: ', post);
        return {
          ...post._doc,
          id: post._id,
        };
      } catch (error) {
        throw new Error(error);
      }
    },

    // Get Posts by the Latest created_at
    async getFeedLatest(_, { limit }) {
      let posts = [];
      let lim = limit ? limit : 10;

      let res = await Post.find().sort({ createdAt: -1 }).limit(lim);
      for (let p of res) {
        const { _id, __v, ...result } = p._doc;
        posts.push({
          ...result,
          id: _id,
        });
      }

      console.log('1 Post from resolver: ', posts[0]);

      return posts;
    },

    // Get posts from all "following"
    async getFeedFollowing(_, { limit }, { req }) {
      let posts = [];
      let lim = limit ? limit : 10; // 10 is the default limit
      const token = req.headers.authorization;

      // TODO: Validate the token and give back the decoded data
      const { valid, decoded, errors } = validateToken(token);
      if (!valid) {
        for (let i in errors) {
          throw new UserInputError(errors[i]);
        }
      }

      // TODO: Get the "following" array
      const user = await User.findById(decoded.id);
      const followingId = user.following; // ID string

      // TODO: Get all posts from all followings
      if (followingId.length == 0) {
        return posts;
      }
      for (let i in followingId) {
        let res = await Post.find({ user: followingId[i] }); // array of posts
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

    // Get All posts created by a user
    async getPostsByUser(_, { userId, limit }) {
      try {
        const p = await Post.find({ user: userId })
          .limit(limit)
          .sort({ createdAt: -1 });
        const posts = Array.from(p);
        console.log(`Posts by userId ${userId}: ${posts}`);

        const res = posts.map((post) => {
          const { _id, __v, ...rest } = post._doc;
          const result = {
            ...rest,
            id: post._id,
          };
          return result;
        });

        console.log('getPostsByUser res: ', res);
        return res;
      } catch (error) {
        throw new Error(error);
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
      console.log('createPost validatedInput: ', validatedInput);
      console.log('Data after validation: ', {
        valid,
        errors,
        validatedInput,
        userId,
      });
      if (!valid) {
        errors.forEach((e) => {
          throw new UserInputError(e);
        });
      }

      // TODO: Upload images to S3, if there's any
      let s3ImgUrls = [];
      if (validatedInput.images.length > 0) {
        const { success, images: uploadRes } = await uploadImageS3(
          validatedInput.images
        );
        if (!success) {
          throw new ApolloError('Failed to upload images');
        }
        console.log('uploadRes: ', uploadRes);
        s3ImgUrls = uploadRes.map((img) => img.url);
        console.log('s3ImgUrls from post mutation: ', s3ImgUrls);
      }

      // Differentiate between polls and other types
      if (validatedInput.postType == 'poll') {
        newPost = new Post({
          body: validatedInput.body,
          user: userId,
          postType: validatedInput.postType,
          imgUrls: s3ImgUrls,
          poll: validatedInput.poll,
          comments: [],
          likes: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } else {
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
      }

      // TODO: Save the post
      const res = await newPost.save();
      console.log('Created a new Post: ', res);

      // TODO: Return the Post type
      return {
        ...res._doc,
        id: res._id,
      };
    },

    // CREATE COMMENT TO A POST
    async createComment(_, { postId, text }, { req }) {
      const token = req.headers.authorization;
      console.log('CREATE COMMENT');
      console.log('postId: ', postId);
      console.log('text: ', text);

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
        const { _id, __v, ...result } = newPost._doc;

        const response = {
          ...result,
          id: newPost._id,
        };
        console.log('createItem response: ', response);
        return response;
      } catch (e) {
        throw new Error('Cannot update the post: ', e.message);
      }
    },

    // LIKE A POST
    async likePost(_, { postId }, { req }) {
      // TODO: Check token, get the client's ID
      const token = req.headers.authorization;
      const { valid, errors, decoded } = validateToken(token);
      if (!valid) {
        for (err of errors) {
          throw new ApolloError(err);
        }
      }
      // TODO: Get client data from DB
      const clientId = decoded.id;
      const client = await User.findById(clientId);
      if (!client) {
        throw new ApolloError('Please login to like');
      }
      //  TODO: Get post data from DB
      const post = await Post.findById(postId);
      if (!post) {
        throw new UserInputError("Post requested doesn't exist");
      }

      // TODO: Check if user already likes
      const usersLiked = post._doc.likes.map((like) => like.user);
      if (usersLiked.includes(clientId)) {
        throw new UserInputError('You already liked this post');
      }
      // TODO: If not, then add userId in likes
      const newLike = {
        user: clientId,
      };
      post.likes.push(newLike);

      // TODO: Save and return new post
      const newPost = await post.save();
      if (!newPost) {
        throw new ApolloError('SERVER ERROR');
      }
      const { _id, __v, ...rest } = newPost._doc;
      const result = {
        ...rest,
        id: newPost._doc._id,
      };
      console.log('RESULT FROM LIKED A POST: ', result);
      return result;
    },

    // UNLIKE A POST
    async unlikePost(_, { postId }, { req }) {
      // TODO: Check token, get the client's ID
      const token = req.headers.authorization;
      const { valid, errors, decoded } = validateToken(token);
      if (!valid) {
        for (err of errors) {
          throw new ApolloError(err);
        }
      }
      // TODO: Get client data from DB
      const clientId = decoded.id;
      console.log('ClientID: ', clientId);
      const client = await User.findById(clientId);
      if (!client) {
        throw new ApolloError('Please login to like');
      }
      //  TODO: Get post data from DB
      const post = await Post.findById(postId);
      console.log('Post res from unlikePost: ', post);
      if (!post) {
        throw new UserInputError("Post requested doesn't exist");
      }

      // TODO: Check if user already not liked
      const usersLiked = post.likes.map((like) => like.user.toString());
      console.log('usersLiked: ', usersLiked);
      if (!usersLiked.includes(clientId)) {
        throw new UserInputError('You HAVE NOT actually liked this post');
      }
      // TODO: If yes, then remove userId in likes
      post.likes = post.likes.filter(
        (item) => item.user.str != client._doc._id.str
      );

      // TODO: Save and return new post
      const newPost = await post.save();
      if (!newPost) {
        throw new ApolloError('SERVER ERROR');
      }
      const { _id, __v, ...rest } = newPost._doc;
      const result = {
        ...rest,
        id: newPost._doc._id,
      };
      console.log('RESULT FROM UNLIKED A POST: ', result);
      return result;
    },

    // DELETE A POST
    async deletePost(_, { input }) {
      const { postId, token } = input;

      // TODO: Find the post by ID. If doesn't exist, throw error
      const post = await Post.findById(postId);
      if (!post) {
        throw new UserInputError(`Post with ID ${postId} doesn't exist`);
      }
      const postUserId = post.user.toString();

      // TODO: Decode and verify token. decoded.id must be equal to post.userId
      const { valid, errors } = validateDeletePost(token, postUserId);
      if (!valid) {
        for (let i in errors) {
          throw new UserInputError(errors[i]);
        }
      }

      // TODO: Delete
      const doc = await post.remove();
      if (doc) {
        console.log('Doc', doc);
      }
      return {
        postId,
        deletedAt: new Date().toISOString(),
      };
    },

    // Update a post
  },
};
