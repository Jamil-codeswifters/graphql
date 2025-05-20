import { gql } from 'apollo-server';

export const schema = gql`
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
`;
