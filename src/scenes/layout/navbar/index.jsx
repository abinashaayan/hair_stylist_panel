import {
  Box,
  IconButton,
  InputBase,
  useMediaQuery,
  useTheme,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
} from "@mui/material";

import { tokens, ColorModeContext } from "../../../theme";
import { useContext, useState } from "react";
import {
  DarkModeOutlined,
  LightModeOutlined,
  MenuOutlined,
  Logout,
  Settings,
  Notifications,
} from "@mui/icons-material";
import { ToggledContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../utils/context/AuthContext";

const Navbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { toggled, setToggled } = useContext(ToggledContext);
  const isMdDevices = useMediaQuery("(max-width:768px)");
  const colors = tokens(theme.palette.mode);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout(); 
    navigate("/login", { replace: true });
  };

  const handleMobileToggle = () => {
    setToggled(!toggled);
    // On mobile, we don't need to adjust margins since the sidebar overlays
    if (isMdDevices) {
      const mainContent = document.querySelector('[data-main-content]');
      if (mainContent) {
        mainContent.style.marginLeft = "0px";
      }
    }
  };

  return (
    <Box display="flex" alignItems="center" justifyContent="space-between" p={2} sx={{ position: "sticky", top: 0, zIndex: 100, background: "linear-gradient(180deg, #6D295A 0%, #420C36 100%)" }}>
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton sx={{ display: `${isMdDevices ? "flex" : "none"}`, color: "#FFFFFF" }} onClick={handleMobileToggle}>
          <MenuOutlined />
        </IconButton>
      </Box>

      <Box>
        <IconButton onClick={colorMode.toggleColorMode} sx={{ color: "#FFFFFF" }}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlined />
          ) : (
            <DarkModeOutlined />
          )}
        </IconButton>
        <Tooltip title="Profile">
          <IconButton onClick={handleClick} sx={{ color: "#FFFFFF" }}>
            <Avatar sx={{ width: 25, height: 25, backgroundColor: "hsl(0 84.2% 60.2%)" }} />
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        sx={{
          "& .MuiPaper-root": {
            width: 200,
            maxHeight: 300,
            borderRadius: 2,
          },
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleClose}>
          <Settings fontSize="small" sx={{ mr: 1 }} />
          Settings
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Settings fontSize="small" sx={{ mr: 1 }} />
          Explore More
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <Notifications fontSize="small" sx={{ mr: 1 }} />
          Notifications
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <Logout fontSize="small" sx={{ mr: 1 }} />
          Logout
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default Navbar;
