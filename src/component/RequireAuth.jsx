import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";

const RequireAuth = ({ children, allowedRoles = ["user", "admin"] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <div>Loading ...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children;
};

export default RequireAuth;
