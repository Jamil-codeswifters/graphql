
const postModel = require('../models/postSchema.js');
const userModel = require('../models/userSchema.js');
const { requireAuth } = require('../utills//index.js');

const resolvers = {
    Query: {
        posts: async (_, __, { user }) => {
            const userId = requireAuth({ user });
            // return only this user's posts
            return await postModel.find({ author: userId }).sort('-createdAt');
        },
        post: async (_, { id }, { user }) => {
            const userId = requireAuth({ user });
            const post = await postModel.findById(id);
            if (!post) throw new Error('Post not found');
            if (post.author.toString() !== userId) {
                throw new Error('Not authorized to view this post');
            }
            return post;
        },
    },

    Mutation: {
        createPost: async (_, { input }, { user }) => {
            const { title, content } = input
            const userId = requireAuth({ user });
            const newPost = await postModel.create({
                ...input,
                author: userId
            });
            return newPost;
        },

        updatePost: async (_, { id, input }, { user }) => {
            const userId = requireAuth({ user });
            const post = await postModel.findById(id);
            if (!post) throw new Error('Post not found');
            if (post.author.toString() !== userId) {
                throw new Error('Not authorized to update this post');
            }
            Object.assign(post, input);
            await post.save();
            return post;
        },

        deletePost: async (_, { id }, { user }) => {
            const userId = requireAuth({ user });
            const post = await postModel.findById(id);
            if (!post) throw new Error('Post not found');
            if (post.author.toString() !== userId) {
                throw new Error('Not authorized to delete this post');
            }
            await postModel.findByIdAndDelete(id);
            return true;
        },

    },

    //populate the 'author' field whenever a Post is returned 
    Post: {
        author: async (parent) => {
            return await userModel.findById(parent.author);
        }
    }
};

module.exports = resolvers;
