import { userResolvers } from './user.resolver.js';
import { todoResolvers } from './todo.resolver.js';

export const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...todoResolvers.Query,
  },

};
