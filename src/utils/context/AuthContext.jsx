import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
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
  }, []);

  const login = (authStatus, type, authToken, vendorId) => {
    setIsAuthenticated(authStatus);
    setPanelType(type);
    setToken(authToken);
    setStylistId(vendorId);
  };

  const logout = () => {
    localStorage.clear();
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
