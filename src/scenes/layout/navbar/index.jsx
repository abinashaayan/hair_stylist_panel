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
  SearchOutlined,
  LogoutOutlined,
  AccountCircle,
  Logout,
  Settings,
  SettingsOutlined,
  Notifications,
} from "@mui/icons-material";
import { deepOrange } from "@mui/material/colors";
import { ToggledContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import { Header } from "../../../components";
const Navbar = () => {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const { toggled, setToggled } = useContext(ToggledContext);
  const isMdDevices = useMediaQuery("(max-width:768px)");
  const isXsDevices = useMediaQuery("(max-width:466px)");
  const colors = tokens(theme.palette.mode);
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
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      p={2}
    >
      <Box display="flex" alignItems="center" gap={2}>
        <IconButton
          sx={{ display: `${isMdDevices ? "flex" : "none"}` }}
          onClick={() => setToggled(!toggled)}
        >
          <MenuOutlined />
        </IconButton>
        {/* <Box
          display="flex"
          alignItems="center"
          bgcolor={colors.primary[400]}
          borderRadius="3px"
          sx={{ display: `${isXsDevices ? "none" : "flex"}` }}
        >
          <InputBase placeholder="Search" sx={{ ml: 2, flex: 1 }} />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchOutlined />
          </IconButton>
        </Box> */}
        <Header title="DASHBOARD" /> 
      </Box>

      <Box>
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlined />
          ) : (
            <DarkModeOutlined />
          )}
        </IconButton>
        {/* <IconButton>
          <NotificationsOutlined />
        </IconButton>
        <IconButton>
          <SettingsOutlined />
        </IconButton>
        <IconButton>
          <PersonOutlined />
        </IconButton> */}
        <Tooltip title="Profile">
          <IconButton onClick={handleClick}>
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
