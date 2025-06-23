import { createContext, useContext, useState, useEffect } from "react";
import Cookies from 'js-cookie';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [panelType, setPanelType] = useState(null);
  const [token, setToken] = useState(null);
  const [stylistId, setStylistId] = useState(null);

  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated") === "true";
    const type = localStorage.getItem("panelType");
    const cookieToken = Cookies.get("token");
    const storedStylistId = localStorage.getItem("stylistId");

    setIsAuthenticated(auth);
    setPanelType(type);
    setToken(cookieToken);
    setStylistId(storedStylistId);
  }, []);

  const login = (authStatus, type, authToken, vendorId) => {
    setIsAuthenticated(authStatus);
    setPanelType(type);
    setToken(authToken);
    setStylistId(vendorId);
  };

  const logout = () => {
    localStorage.clear();
    Cookies.remove("token");
    setIsAuthenticated(false);
    setPanelType(null);
    setToken(null);
    setStylistId(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, panelType, token, stylistId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => useContext(AuthContext);
