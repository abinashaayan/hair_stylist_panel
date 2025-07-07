import React, { useState, useContext, useEffect } from "react";
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
  Typography,
  Divider,
} from "@mui/material";

import { tokens, ColorModeContext } from "../../../theme";
import { useContext as useContextHook, useState as useStateHook } from "react";
import {
  DarkModeOutlined,
  LightModeOutlined,
  MenuOutlined,
  Logout,
  Settings,
  Notifications,
  PersonOutlined,
  AccessTime,
} from "@mui/icons-material";
import { ToggledContext } from "../../../App";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../utils/context/AuthContext";
import FlexBetween from "../../../components/FlexBetween";
import useStylistProfile from "../../../hooks/useStylistProfile";

const Navbar = () => {
  const theme = useTheme();
  const colorMode = useContextHook(ColorModeContext);
  const { toggled, setToggled } = useContextHook(ToggledContext);
  const isMdDevices = useMediaQuery("(max-width:768px)");
  const isMobile = useMediaQuery("(max-width:480px)");
  const isNonMobile = useMediaQuery("(min-width: 768px)");
  const colors = tokens(theme.palette.mode);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const open = Boolean(anchorEl);
  const panelType = localStorage.getItem("panelType");
  const { profile, loading, error } = panelType === "vendor" ? useStylistProfile() : { profile: null, loading: false, error: null };

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatDateTime = (date) => {
    const options = {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    return date.toLocaleString('en-US', options);
  };

  return (
    <FlexBetween
      padding={{ xs: "0.5rem", sm: "1rem" }}
      backgroundColor="transparent"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "linear-gradient(180deg, #6D295A 0%, #420C36 100%)",
        minHeight: { xs: "60px", sm: "70px" }
      }}
    >
      <FlexBetween gap={{ xs: "0.5rem", sm: "1.75rem" }}>
        {!isNonMobile && (
          <IconButton onClick={handleMobileToggle} sx={{ color: "#FFFFFF", padding: { xs: "8px", sm: "12px" } }}>
            <MenuOutlined sx={{ fontSize: { xs: "20px", sm: "24px" } }} />
          </IconButton>
        )}
        {panelType === "vendor" && (
          <Box display="flex" alignItems="center" gap={{ xs: "5px", sm: "10px" }}>
            <Typography
              fontWeight="bold"
              fontSize={{ xs: "1rem", sm: "1.5rem", md: "2rem" }}
              color="#FFFFFF"
              onClick={() => navigate("/")}
              sx={{ "&:hover": { color: "rgba(255, 255, 255, 0.8)", cursor: "pointer" }, whiteSpace: "nowrap" }}
            >
              STYLIST
            </Typography>
          </Box>
        )}
      </FlexBetween>
      <FlexBetween gap={{ xs: "0.5rem", sm: "2rem" }}>
        {panelType === "vendor" && !isMobile && (
          <Box display="flex" alignItems="center" gap="0.5rem">
            <AccessTime sx={{ color: "#FFFFFF", fontSize: { xs: "1rem", sm: "1.2rem" } }} />
            <Typography variant="body2" sx={{ color: "#FFFFFF", fontSize: { xs: "0.7rem", sm: "0.9rem" }, whiteSpace: "nowrap", display: { xs: "none", sm: "block" } }}>
              {formatDateTime(currentDateTime)}
            </Typography>
          </Box>
        )}

        <IconButton onClick={colorMode.toggleColorMode} sx={{ color: "#FFFFFF", padding: { xs: "8px", sm: "12px" } }}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlined sx={{ fontSize: { xs: "18px", sm: "20px" } }} />
          ) : (
            <DarkModeOutlined sx={{ fontSize: { xs: "18px", sm: "20px" } }} />
          )}
        </IconButton>

        <Tooltip title="Profile">
          <IconButton onClick={handleClick} sx={{ color: "#FFFFFF", padding: { xs: "8px", sm: "12px" } }}>
            {panelType === "vendor" ? (
              <PersonOutlined sx={{ fontSize: { xs: "20px", sm: "25px" } }} />
            ) : (
              <Avatar sx={{ width: { xs: 25, sm: 32 }, height: { xs: 25, sm: 32 }, backgroundColor: "hsl(0 84.2% 60.2%)" }} />
            )}
          </IconButton>
        </Tooltip>
      </FlexBetween>

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
            width: 300,
            maxWidth: "90vw",
            borderRadius: 4,
            p: 0,
            overflow: "visible",
            boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
          },
        }}
        transformOrigin={{ vertical: "top", horizontal: "right", }}
      >
        {panelType === "vendor" && [
          <Box key="profile-box" sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2, pt: 3 }}>
            <Avatar src={profile?.profilePicture || undefined} sx={{ width: 70, height: 70, mb: 1, border: "3px solid #6D295A" }}>
              {profile?.name ? profile.name[0] : "S"}
            </Avatar>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: "#222", mb: 0.2 }}>
              {profile?.fullName || "Stylist Name"}
            </Typography>
            <Typography variant="body2" sx={{ color: "#7b7b7b", mb: 1 }}>
              {profile?.role || "Urban Braids"}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} style={{ color: i <= 4 ? "#FFD700" : "#FFD70099", fontSize: 20, marginRight: 1 }}>
                  {i < 5 ? "★" : "☆"}
                </span>
              ))}
              <Typography variant="caption" sx={{ color: "#7b7b7b", ml: 1 }}>
                (212 Reviews)
              </Typography>
            </Box>
            <Typography variant="subtitle2" sx={{ color: "#6D295A", fontWeight: 700, mb: 1 }}>
              09:00 - 18:00
            </Typography>
          </Box>,
          <Divider key="profile-divider" sx={{ my: 0, borderColor: "#eee" }} />
        ]}
        {/* Menu Options */}
        <Box sx={{ p: 1 }}>
          {panelType === "vendor" && (
            <Link to="/stylist-profile" style={{ textDecoration: "none", color: "inherit" }}>
              <MenuItem onClick={handleClose} sx={{ fontSize: 15, py: 1.2, borderRadius: 2 }}>
                <PersonOutlined fontSize="small" sx={{ mr: 1, color: "#6D295A" }} />
                Profile
              </MenuItem>
            </Link>
          )}
          <MenuItem onClick={handleLogout} sx={{ fontSize: 15, py: 1.2, borderRadius: 2 }}>
            <Logout fontSize="small" sx={{ mr: 1, color: "#6D295A" }} />
            Log Out
          </MenuItem>
        </Box>
      </Menu>
    </FlexBetween>
  );
};

export default Navbar;
