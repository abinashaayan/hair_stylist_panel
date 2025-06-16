import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, panelType, token, stylistId }) => {
  // For admin panel, we need both authentication and token
  if (panelType === "admin" && (!isAuthenticated || !token)) {
    return <Navigate to="/login" />;
  }

  // For vendor panel, we need authentication and stylistId
  if (panelType === "vendor" && (!isAuthenticated || !stylistId)) {
    return <Navigate to="/login" />;
  }

  // If not authenticated at all
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute;
