import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import App from "./App";
import {
  Dashboard,
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
import StylistUsers from "./scenes/vendor/StylistUsers";

import { useAuth } from "./utils/context/AuthContext";
import OrderDetails from "./scenes/admin/OrderDetails";

const AppRouter = () => {
  const [isAppLoading, setIsAppLoading] = useState(true);
  const { isAuthenticated, panelType, token, stylistId, login } = useAuth();

  if (isAuthenticated === null) {
    return null;
  }

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     setIsAppLoading(false);
  //   }, 1500);
  //   return () => clearTimeout(timeout);
  // }, []);

  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLoginSuccess={login} />
            )
          }
        />
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
                <Route path="order-details" element={<OrderDetails />} />
                <Route path="contacts" element={<Contacts />} />
              </>
            ) : panelType === "vendor" ? (
              <>
                <Route index element={<VendorDashboard />} />
                <Route path="users" element={<StylistUsers />} />
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
