export const todoResolvers = {
  Query: {
    todo: async () => {
      const res = await fetch('https://jsonplaceholder.typicode.com/todos');
      return res.json();
    },
    getByIdTodo: async (_, { id }) => {
      const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${id}`);
      return res.ok ? res.json() : null;
    },
  },
};
