// src/resolvers/user.resolvers.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userSchema.js");

const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

const resolvers = {
    Query: {
        users: async () => {
            return await User.find();
        },
        user: async (_, { id }) => {
            return await User.findById(id);
        },
    },

    Mutation: {
        // -- Sign up --
        createUser: async (_, { input }) => {
            const { name, email, password } = input;

            // Basic presence check
            if (!name || !email || !password) {
                throw new Error("Name, email, and password are required");
            }

            // Unique email check
            const existing = await User.findOne({ email });
            if (existing) {
                throw new Error("Email already in use");
            }

            // Hash & create
            const hash = await bcrypt.hash(password, 10);
            const user = await User.create({ name, email, password: hash });
            return user;
        },

        // -- Login, returns JWT + user --
        login: async (_, { email, password }) => {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error("No user found with that email");
            }

            const valid = await bcrypt.compare(password, user.password);
            if (!valid) {
                throw new Error("Incorrect password");
            }

            const token = jwt.sign(
                { userId: user.id, email: user.email },
                JWT_SECRET,
                { expiresIn: "7d" }
            );

            return { token, user };
        },

        // -- Update by ID --
        updateUser: async (_, { id, input }) => {
            const { name, email, password } = input;
            const updates = {};

            if (name) updates.name = name;
            if (email) updates.email = email;

            if (password) {
                updates.password = await bcrypt.hash(password, 10);
            }

            const updated = await User.findByIdAndUpdate(id, updates, {
                new: true,
                runValidators: true,    // enforce schema validators (e.g. enum, required)
            });

            if (!updated) {
                throw new Error("User not found");
            }

            return updated;
        },

        // -- Delete by ID --
        deleteUser: async (_, { id }) => {
            const deleted = await User.findByIdAndDelete(id);
            return deleted != null;
        },
    },
};

module.exports = resolvers;
