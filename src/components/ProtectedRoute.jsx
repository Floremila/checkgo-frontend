import { Navigate } from "react-router-dom";

function safeGetRoles() {
  try {
    return JSON.parse(localStorage.getItem("roles") || "[]");
  } catch {
    return [];
  }
}

function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const roles = safeGetRoles();
    if (!roles.includes(requiredRole)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;


