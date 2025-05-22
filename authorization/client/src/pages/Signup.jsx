import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { gql, useMutation } from "@apollo/client";

const SIGNUP_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`;

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [createUser, { loading, error }] = useMutation(SIGNUP_MUTATION);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/posts");
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createUser({ variables: { input: formData } });
      navigate("/login");
    } catch (err) {
      console.error("Signup failed:", err);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm space-y-4"
      >
        <h2 className="text-2xl font-bold mb-2 text-center">Sign Up</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          className="input"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          className="input"
          required
        />

        <button type="submit" className="btn w-full" disabled={loading}>
          {loading ? "Creating..." : "Create Account"}
        </button>

        {error && <p className="text-red-500 text-sm">{error.message}</p>}

        <div className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
}
