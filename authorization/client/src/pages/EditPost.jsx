import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { gql, useQuery, useMutation } from "@apollo/client";

const GET_POST = gql`
  query GetPost($id: ID!) {
    post(id: $id) {
      id
      title
      content
    }
  }
`;

const UPDATE_POST = gql`
  mutation UpdatePost($id: ID!, $input: PostInput!) {
    updatePost(id: $id, input: $input) {
      id
      title
      content
    }
  }
`;

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(GET_POST, { variables: { id } });
  const [updatePost, { loading: updating }] = useMutation(UPDATE_POST);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // When data is loaded, populate form fields
  useEffect(() => {
    if (data?.post) {
      setTitle(data.post.title);
      setContent(data.post.content);
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert("Both title and content are required.");
      return;
    }

    try {
      await updatePost({ variables: { id, input: { title, content } } });
      navigate("/posts");
    } catch (err) {
      console.error("Failed to update post:", err);
      alert("Failed to update post. Please try again.");
    }
  };

  if (loading) return <p className="p-6 text-center">Loading post...</p>;
  if (error) return <p className="p-6 text-center text-red-600">Error: {error.message}</p>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Edit Post</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Post Title"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Edit your content here..."
          rows={6}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={updating}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg w-full transition duration-200"
        >
          {updating ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
