import userModel from "../model/userSchema.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';
export const resolvers = {
    Query: {
        users: async () => {
            return await userModel.find();
        },
        user: async (_, { id }) => {

            return await userModel.findById(id)
        }
    },

    Mutation: {
        // -- Sign up --
        createUser: async (_, { input }) => {
            const { name, email, password } = input
            if (!name || !email || !password) {
                throw new Error('All fields are required');
            }
            const existing = await userModel.findOne({ email });
            if (existing) {
                throw new Error('Email already in use');
            }
            const hash = await bcrypt.hash(password, 10);
            const user = await userModel.create({ name, email, password: hash });
            return user;
        },

        login: async (_, { email, password }) => {

            const user = await userModel.findOne({ email });
            if (!user) {
                throw new Error('No user found with that email');
            }
            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                throw new Error('Incorrect password');
            }
            const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
                expiresIn: '7d',
            });
            return { token, user };
        },

        // -- Update by ID --
        updateUser: async (_, { id, input }) => {
            const { name, email, password } = input
            const updates = {};
            console.log(name)
            if (name) updates.name = name;
            if (email) updates.email = email;
            if (password) {
                updates.password = await bcrypt.hash(password, 10);
            }
            console.log(updates)
            const updated = await userModel.findByIdAndUpdate(id, updates, {
                new: true,
                runValidators: true,
            });
            if (!updated) {
                throw new Error('User not found');
            }
            return updated;
        },

        // -- Delete by ID --
        deleteUser: async (_, { id }) => {
            const deleted = await userModel.findByIdAndDelete(id);
            return deleted != null;
        },
    },
};
