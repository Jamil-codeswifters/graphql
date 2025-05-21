import { useQuery, useMutation, gql } from '@apollo/client';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

export default function UserList() {
  const { data, loading, error, refetch } = useQuery(GET_USERS);
  const [deleteUser] = useMutation(DELETE_USER);
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setDeletingId(id);
      try {
        await deleteUser({ variables: { id } });
        await refetch();
      } catch (err) {
        alert('Failed to delete user.');
      }
      setDeletingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center mt-20">
        <svg
          className="animate-spin h-8 w-8 text-blue-600"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading spinner"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
      </div>
    );

  if (error)
    return (
      <p className="text-center text-red-500 mt-10">
        Error fetching users. Please try again later.
      </p>
    );

  if (data.users.length === 0)
    return (
      <p className="text-center mt-10 text-gray-500">No users found.</p>
    );

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">User List</h2>
      <ul className="divide-y divide-gray-200">
        {data.users.map((user) => (
          <li
            key={user.id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-4 hover:bg-gray-50 rounded px-2 transition"
          >
            <div>
              <p className="text-lg font-medium">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <div className="flex gap-4 mt-3 sm:mt-0">
              <Link
                to={`/edit/${user.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                aria-label={`Edit ${user.name}`}
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(user.id)}
                disabled={deletingId === user.id}
                className={`px-4 py-2 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-400 ${
                  deletingId === user.id
                    ? 'bg-red-300 cursor-not-allowed'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
                aria-label={`Delete ${user.name}`}
              >
                {deletingId === user.id ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
