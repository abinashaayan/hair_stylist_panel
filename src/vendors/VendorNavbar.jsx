import React, { useState, useContext } from "react";
import {
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  PersonOutlined,
  SettingsOutlined,
  LogoutOutlined,
  MenuOutlined,
  LightModeOutlined,
  DarkModeOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../components/FlexBetween";
import { ToggledContext } from "../App";
import logo from "../assets/images/logo1.png";
import { ColorModeContext } from "../theme";

const VendorNavbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const isNonMobile = useMediaQuery("(min-width: 768px)");

  const { toggled, setToggled } = useContext(ToggledContext);
  const colorMode = useContext(ColorModeContext);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <FlexBetween
      padding="1rem"
      backgroundColor={theme.palette.background.alt}
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        // backgroundColor:"black"
      }}
    >
      <FlexBetween gap="1.75rem">
        {!isNonMobile && (
          <IconButton onClick={() => setToggled(!toggled)}>
            <MenuOutlined />
          </IconButton>
        )}
        <Box display="flex" alignItems="center" gap="10px">
          {/* <img
            alt="logo"
            src={logo}
            style={{ width: "auto", height: "40px", cursor: "pointer" }}
            onClick={() => navigate("/")}
          /> */}
          <Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            color="primary"
            onClick={() => navigate("/")}
            sx={{
              "&:hover": {
                color: theme.palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            Stylist
          </Typography>
        </Box>

        <Box display="flex" gap="15px" ml="20px">
          <Typography
            variant="body2"
            sx={{
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Edit Salon Page
          </Typography>
          <Typography
            variant="body2"
            sx={{
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Headcase Salon
          </Typography>
        </Box>
      </FlexBetween>

      <FlexBetween gap="2rem">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlined />
          ) : (
            <DarkModeOutlined />
          )}
        </IconButton>
        <IconButton onClick={handleClick}>
          <PersonOutlined sx={{ fontSize: "25px" }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={isOpen}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <MenuItem onClick={() => navigate("/stylist-profile")}>
            <SettingsOutlined sx={{ mr: 2 }} /> Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutOutlined sx={{ mr: 2 }} /> Log Out
          </MenuItem>
        </Menu>
      </FlexBetween>
    </FlexBetween>
  );
};

export default VendorNavbar;
