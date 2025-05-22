const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const typeDefs = require('./schema/index.js');
const getUserFromToken = require('./utills/index.js');
const userResolver = require('./controllers/auth.js');
const postResolver = require('./controllers/post.js');
const connectDb = require('./config/db.js');
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key";

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs,
        resolvers: [userResolver, postResolver],
        context: ({ req }) => {
            const token = req.headers.authorization?.replace('Bearer ', '');
            let user = null;
            if (token) {
                try {
                    user = jwt.verify(token, JWT_SECRET);
                } catch (err) {
                    console.log(err)
                }
            }
            return { user };
        },
    });
    connectDb()
    await server.start();
    server.applyMiddleware({ app });

    app.listen(4000, () =>
        console.log('🚀 Server ready at http://localhost:4000/graphql')
    );
}

startServer();
