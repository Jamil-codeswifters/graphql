import { gql, useQuery, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';

const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      content
    }
  }
`;

const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id)
  }
`;

export default function Posts() {
  const { loading, error, data } = useQuery(GET_POSTS);
  const [deletePost, { loading: deleting }] = useMutation(DELETE_POST, {
    update(cache, { data: { deletePost } }, { variables }) {
      if (deletePost) {
        // Remove deleted post from cache
        const existingPosts = cache.readQuery({ query: GET_POSTS });
        if (existingPosts) {
          cache.writeQuery({
            query: GET_POSTS,
            data: {
              posts: existingPosts.posts.filter(post => post.id !== variables.id),
            },
          });
        }
      }
    }
  });

  if (loading) return <p className="text-center p-6">Loading posts...</p>;
  if (error) return <p className="text-center p-6 text-red-600">Error loading posts: {error.message}</p>;

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost({ variables: { id } });
    } catch (err) {
      console.error("Failed to delete post:", err);
      alert("Failed to delete post. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Posts</h1>
        <Link
          to="/posts/create"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow"
        >
          Create New
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.posts.map(post => (
          <div key={post.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-5 flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-1">{post.title}</h2>
              <h3 className="text-md text-gray-700 mb-4 font-medium">{post.content}</h3>
            </div>
            <div className="flex justify-end space-x-2">
              <Link
                to={`/posts/edit/${post.id}`}
                className="text-sm bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(post.id)}
                disabled={deleting}
                className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
