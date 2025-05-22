import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Posts from "./pages/Posts";
import CreatePost from "./pages/createPost";
import EditPost from "./pages/EditPost";
import ProtectedRoute from "./routes";
function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/posts" element={<Posts />} />
          <Route path="/posts/create" element={<CreatePost />} />
          <Route path="/posts/edit/:id" element={<EditPost />} />
        </Route>

        <Route path="*" element={<Navigate to="/posts" replace />} />
      </Routes>
    </div>
  );
}

export default App;
