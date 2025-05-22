
const { ApolloServer, gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
  }

  # Payload returned by login
  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    users: [User!]!
    # optional: fetch one user by ID
    user(id: ID!): User
  }

  input CreateUserInput {
    name:     String!
    email:    String!
    password: String!
  
  }

  input UpdateUserInput {
    name:     String
    email:    String
    password: String


  }



  type Mutation {
    createUser(input: CreateUserInput!): User!
    login(email: String!, password: String!): AuthPayload!
    updateUser(id: ID!, input: UpdateUserInput!): User!
    deleteUser(id: ID!): Boolean!
  }



  type Post {
    id: ID!
    title: String!
    content: String!
    author: User!    
    createdAt: String!
    updatedAt: String!
  }

  input PostInput {
    title: String
    content: String
  }

  extend type Query {
    posts: [Post!]!      # get all posts by this user
    post(id: ID!): Post  # get one post by id
  }

  extend type Mutation {
    createPost(input: PostInput!): Post!
    updatePost(id: ID!, input: PostInput): Post
    deletePost(id: ID!): Boolean!
  }
`;

module.exports = typeDefs