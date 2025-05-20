import { createAllUser } from '../controllers/createAllUser.js';

export const userResolvers = {
  Query: {
    user: () => [ createAllUser() ],
  },
};
