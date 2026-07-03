import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const userJson = localStorage.getItem("user");
  
  let user = null;
  try {
    user = userJson ? JSON.parse(userJson) : null;
  } catch (e) {
    console.error("Error parsing user from localStorage:", e);
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    return <Navigate to={user?.role === "admin" ? "/admin" : "/dashboard"} />;
  }

  return children;
};

export default ProtectedRoute;