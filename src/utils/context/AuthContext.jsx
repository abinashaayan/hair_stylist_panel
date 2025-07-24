import { createContext, useContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';
import axios from "axios";
import { API_BASE_URL } from "../apiConfig";

// Utility to decode JWT and check expiration
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    const { exp } = JSON.parse(jsonPayload);
    if (!exp) return true;
    // exp is in seconds
    return Date.now() >= exp * 1000;
  } catch (e) {
    return true;
  }
}

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [panelType, setPanelType] = useState(null);
  const [token, setToken] = useState(null);
  const [stylistId, setStylistId] = useState(null);
  const [logoutReason, setLogoutReason] = useState(null); 

  // Check token expiration on mount and at intervals
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem("isAuthenticated") === "true";
      const type = localStorage.getItem("panelType");
      const cookieToken = Cookies.get("token");
      const storedStylistId = localStorage.getItem("stylistId");

      setIsAuthenticated(auth);
      setPanelType(type);
      setToken(cookieToken);
      setStylistId(storedStylistId);

      // If token is expired, logout
      if (cookieToken && isTokenExpired(cookieToken)) {
        logout('expired');
      }
    };

    checkAuth();
    // Check every 30 seconds
    const interval = setInterval(() => {
      const cookieToken = Cookies.get("token");
      if (cookieToken && isTokenExpired(cookieToken)) {
        logout('expired');
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const login = (authStatus, type, authToken, vendorId) => {
    setIsAuthenticated(authStatus);
    setPanelType(type);
    setToken(authToken);
    setStylistId(vendorId);
    setLogoutReason(null); // clear on login
  };

  // Accept reason param for logout
  const logout = async (reason = null) => {
    try {
      if (panelType === 'admin') {
        await axios.post(
          `${API_BASE_URL}/admin/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('token')}`,
              'Content-Type': 'application/json',
            },
            withCredentials: true,
          }
        );
      } else {
        await axios.post(`${API_BASE_URL}/auth/logout`,
          {},
          {
            headers: {
              Authorization: `Bearer ${Cookies.get('token')}`,
            },
            withCredentials: true,
          }
        );
      }
    } catch (error) {
      console.error("Logout API error:", error?.response?.data?.message || error.message);
    }
    localStorage.clear();
    Cookies.remove("token");
    setIsAuthenticated(false);
    setPanelType(null);
    setToken(null);
    setStylistId(null);
    if (reason) setLogoutReason(reason); 
  };

  // Function to clear logout reason after showing notification
  const clearLogoutReason = () => setLogoutReason(null);

  return (
    <AuthContext.Provider value={{ isAuthenticated, panelType, token, stylistId, login, logout, logoutReason, clearLogoutReason }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
