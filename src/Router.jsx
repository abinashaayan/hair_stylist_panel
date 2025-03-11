import React from "react";
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
import PrivateRoute from "./utils/PrivateRoute";

const AppRouter = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={isAuthenticated ? <Navigate to="/" replace /> : <Login />}
        />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<App />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/category" element={<Category />} />
            <Route path="/customers" element={<UserDetails />} />
            <Route path="/contacts" element={<Contacts />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
