import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const token = localStorage.getItem("token");
  const location = useLocation();

  // If no token, send to /login and remember where they wanted to go
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Otherwise render the page they requested
  return <Outlet />;
}
