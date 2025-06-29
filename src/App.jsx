import React, { createContext, useState, useMemo, useContext } from "react";
import { Box, CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { Navbar, SideBar } from "./scenes";
import { Outlet } from "react-router-dom";
import ToastNotification from "./Toast";
import VendorSidebar from "./vendors/VendorSidebar";
import VendorNavbar from "./vendors/VendorNavbar";

export const ToggledContext = createContext(null);

function App({ panelType }) {
  const [theme, colorMode] = useMode();
  const [toggled, setToggled] = useState(false);
  
  const values = useMemo(() => ({
    toggled,
    setToggled,
  }), [toggled]);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToggledContext.Provider value={values}>
          <ToastNotification />
          <Box sx={{ 
            display: "flex", 
            height: "100vh", 
            width: "100vw", 
            overflowX: "hidden",
            position: "relative"
          }}>
            {panelType === "admin" ? <SideBar /> : <VendorSidebar />}
            <Box 
              data-main-content
              sx={{ 
                flexGrow: 1, 
                display: "flex", 
                flexDirection: "column",
                minWidth: 0, // Prevent flex item from overflowing
                position: "relative",
                marginLeft: "250px", // Initial margin for sidebar
                transition: "margin-left 300ms ease",
                "@media (max-width: 768px)": {
                  marginLeft: 0, // On mobile, no margin needed
                }
              }}
            >
              {panelType === "admin" ? <Navbar /> : <VendorNavbar />}
              <Box sx={{ 
                overflowY: "auto", 
                flex: 1,
                width: "100%",
                position: "relative"
              }}>
                <Outlet />
              </Box>
            </Box>
          </Box>
        </ToggledContext.Provider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
