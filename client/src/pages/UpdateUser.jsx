import { useMutation, useQuery, gql } from '@apollo/client';
import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $name: String!, $email: String!, $password: String!) {
    updateUser(id: $id, input: { name: $name, email: $email, password: $password }) {
      id
      name
      email
      password
    }
  }
`;

export default function EditUser() {
  const { id } = useParams();
  const { data } = useQuery(GET_USERS);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  // Setup mutation with cache update
  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER, {
    update(cache, { data: { updateUser } }) {
      // Read existing users from cache
      const existingUsers = cache.readQuery({ query: GET_USERS });
      if (existingUsers) {
        // Replace updated user in cache
        const updatedUsers = existingUsers.users.map((user) =>
          user.id === updateUser.id ? updateUser : user
        );
        // Write updated users back to cache
        cache.writeQuery({
          query: GET_USERS,
          data: { users: updatedUsers },
        });
      }
    },
  });

  useEffect(() => {
    if (data) {
      const user = data.users.find((u) => u.id === id);
      if (user) setForm(user);
    }
  }, [data, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser({
        variables: { id, name: form.name, email: form.email, password: form.password },
      });
      navigate('/users'); // Navigate back to user list
    } catch (err) {
      console.error('Update failed', err);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Edit User</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          placeholder="Name"
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="Email"
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Password"
          className="w-full px-4 py-2 border rounded"
          required
        />
        <button
          type="submit"
          disabled={updating}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          {updating ? 'Updating...' : 'Update'}
        </button>
      </form>
    </div>
  );
}
