import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ isAuthenticated, panelType, token, stylistId }) => {
  // Wait until auth state is loaded
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (panelType === "admin" && (!isAuthenticated || !token)) {
    return <Navigate to="/login" replace />;
  }

  if (panelType === "vendor" && (!isAuthenticated || !stylistId)) {
    return <Navigate to="/login" replace />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
