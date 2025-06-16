import React, { createContext, useState, useMemo } from "react";
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
          <Box sx={{ display: "flex", height: "100vh", width: "100vw", overflowX: "hidden" }}>
            {panelType === "admin" ? <SideBar /> : <VendorSidebar />}
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
              {panelType === "admin" ? <Navbar /> : <VendorNavbar />}
              <Box sx={{ overflowY: "auto", flex: 1 }}>
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
