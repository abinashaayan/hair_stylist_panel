import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, } from "react-router-dom";
import PrivateRoute from "./utils/PrivateRoute";
import { useAuth } from "./utils/context/AuthContext";
import LoadingScreen from "./components/LoadingScreen";

// Lazy load scenes to optimize initial load time
import App from "./App";
import { Dashboard } from "./scenes";
import Login from "./components/Login";
import VendorDashboard from "./vendors/VendorDashboard";
import VendorProfile from "./scenes/vendor/VendorProfile";
import ServiceManagement from "./scenes/vendor/ServiceManagement";
import Appointment from "./scenes/vendor/Appointment";
import Packages from "./scenes/vendor/Packages";
import Availability from "./scenes/vendor/Availability";
import Portfolio from "./scenes/vendor/Portfolio";
import Product from "./scenes/admin/Product";
import OrderDetails from "./scenes/admin/OrderDetails";
import CustomerDetails from "./scenes/admin/CustomerDetails";
import RegisteredStylist from "./scenes/admin/RegisteredStylist";
import Category from "./scenes/admin/Category";
import ServiceCategory from "./scenes/admin/ServiceCategory";
// import Services from "./scenes/vendor/Services";
import AppointmentStatus from "./scenes/admin/AppointmentStatus";
import AllReviews from "./scenes/admin/AllReviews";
import Notification from "./scenes/vendor/Notification";

const AppRouter = () => {
  const { isAuthenticated, panelType, token, stylistId, login } = useAuth();

  if (isAuthenticated === null) {
    return <div><LoadingScreen /></div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={isAuthenticated === null ? (<div>Loading...</div>) : isAuthenticated ? (<Navigate to="/" replace />) : (<Login onLoginSuccess={login} />)} />
        <Route element={<PrivateRoute isAuthenticated={isAuthenticated} panelType={panelType} token={token} stylistId={stylistId} />}>
          <Route path="/" element={<App panelType={panelType} />}>
            {panelType === "admin" ? (
              <>
                <Route index element={<Dashboard />} />
                <Route path="customers" element={<CustomerDetails />} />
                <Route path="stylist" element={<RegisteredStylist />} />
                <Route path="stylist-reviews" element={<AllReviews />} />
                <Route path="product" element={<Product />} />
                <Route path="category" element={<Category />} />
                <Route path="service" element={<ServiceCategory />} />
                <Route path="service-management" element={<ServiceManagement />} />
                <Route path="order-details" element={<OrderDetails />} />
                <Route path="appointment-status" element={<AppointmentStatus />} />
              </>
            ) : panelType === "vendor" ? (
              <>
                <Route index element={<VendorDashboard />} />
                {/* <Route path="services" element={<Services />} /> */}
                <Route path="reviews" element={<AllReviews />} />
                <Route path="appointment" element={<Appointment />} />
                <Route path="packages" element={<Packages />} />
                <Route path="availability" element={<Availability />} />
                <Route path="portfolio" element={<Portfolio />} />
                <Route path="stylist-profile" element={<VendorProfile />} />
                <Route path="notifications" element={<Notification />} />
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
