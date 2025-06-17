import React, { useEffect, useState, useCallback } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import App from "./App";
import {
  Dashboard,
  // Team,
  Invoices,
  Contacts,
  Form,
  Bar,
  Line,
  Pie,
  FAQ,
  Geography,
  Calendar,
  Stream,
} from "./scenes";
import UserDetails from "./scenes/AllUsers";
import Category from "./scenes/category";
import Login from "./components/Login";
import MenuTabs from "./custom/multipleTabs";
import PrivateRoute from "./utils/PrivateRoute";
import VendorDashboard from "./vendors/VendorDashboard";
import VendorAppointments from "./vendors/VendorAppointments";
import VendorProfile from "./vendors/VendorProfile";
import AppointmentRequests from "./scenes/vendor/AppointmentRequests";
import History from "./scenes/vendor/History";
import Packages from "./scenes/vendor/Packages";
import Availability from "./scenes/vendor/Availability";
import CreateAppointment from "./scenes/vendor/CreateAppointment";

const AppRouter = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [panelType, setPanelType] = useState(null);
  const [token, setToken] = useState(null);
  const [stylistId, setStylistId] = useState(null);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated") === "true";
    const type = localStorage.getItem("panelType");
    const storedToken = localStorage.getItem("token");
    const storedStylistId = localStorage.getItem("stylistId");

    setIsAuthenticated(auth);
    setPanelType(type);
    setToken(storedToken);
    setStylistId(storedStylistId);
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = useCallback((authStatus, type, authToken, vendorId) => {
    setIsAuthenticated(authStatus);
    setPanelType(type);
    setToken(authToken);
    setStylistId(vendorId);
  }, []);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <Router>
      <Routes>
        {/* Login Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLoginSuccess={handleLoginSuccess} />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          element={
            <PrivateRoute
              isAuthenticated={isAuthenticated}
              panelType={panelType}
              token={token}
              stylistId={stylistId}
            />
          }
        >
          <Route path="/" element={<App panelType={panelType} />}>
            {panelType === "admin" ? (
              <>
                <Route index element={<Dashboard />} />
                <Route path="menu" element={<MenuTabs />} />
                <Route path="category" element={<Category />} />
                <Route path="customers" element={<UserDetails />} />
                <Route path="contacts" element={<Contacts />} />
              </>
            ) : panelType === "vendor" ? (
              <>
                <Route index element={<VendorDashboard />} />
                <Route path="calendar" element={<Calendar />} />
                <Route path="appointment-requests" element={<AppointmentRequests />} />
                <Route path="history" element={<History />} />
                <Route path="packages" element={<Packages />} />
                <Route path="availability" element={<Availability />} />
                <Route path="create-appointment" element={<CreateAppointment />} />
                <Route path="stylist-profile" element={<VendorProfile />} />
              </>
            ) : (
              <Route index element={<Navigate to="/login" replace />} />
            )}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
