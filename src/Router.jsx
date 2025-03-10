import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
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
  return (
    <Router>
      <Routes>
        {/* <Route path="/login" element={<Login />} /> */}
        <Route
          path="/login"
          element={
            localStorage.getItem("isAuthenticated") === "false" ||
              localStorage.getItem("isAuthenticated") === null
              ? <Login />
              : <Navigate to="/" />
          }
        />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<App />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/category" element={<Category />} />
            <Route path="/customers" element={<UserDetails />} />
            <Route path="/contacts" element={<Contacts />} />
            {/* <Route path="/invoices" element={<Invoices />} />
            <Route path="/form" element={<Form />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/bar" element={<Bar />} />
            <Route path="/pie" element={<Pie />} />
            <Route path="/stream" element={<Stream />} />
            <Route path="/line" element={<Line />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/geography" element={<Geography />} /> */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
