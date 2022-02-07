const { UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const { validateCreatePost } = require('../../utils/validatePost');

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
  },
  Mutation: {
    async createPost(_, { input }) {
      let newPost;
      // TODO: Validate the inputs
      const { valid, errors, validatedInput, userId } =
        validateCreatePost(input);
      console.log('Data after validation: ', {
        valid,
        errors,
        validatedInput,
        userId,
      });
      if (!valid) {
        for (e in errors) {
          throw new UserInputError(e);
        }
      }

      // TODO: Create new post
      // Differentiate between polls and other types
      if (validatedInput.postType == 'poll') {
        newPost = new Post({
          body: validatedInput.body,
          user: userId,
          postType: validatedInput.postType,
          imgUrls: validatedInput.imgUrls,
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
          imgUrls: validatedInput.imgUrls,
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
  },
};
