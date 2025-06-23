import React, { useState, useContext, useEffect } from "react";
import {
  Box,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider
} from "@mui/material";
import {
  PersonOutlined,
  Person,
  LogoutOutlined,
  MenuOutlined,
  LightModeOutlined,
  DarkModeOutlined,
  AccessTime,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import FlexBetween from "../components/FlexBetween";
import { ToggledContext } from "../App";
import logo from "../assets/images/logo1.png";
import { ColorModeContext } from "../theme";
import { Star, StarHalf } from "lucide-react";
import { useAuth } from "../utils/context/AuthContext";

const VendorNavbar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const isNonMobile = useMediaQuery("(min-width: 768px)");

  const { toggled, setToggled } = useContext(ToggledContext);
  const colorMode = useContext(ColorModeContext);
  const { logout } = useAuth();

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

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <FlexBetween
      padding="1rem"
      backgroundColor="transparent"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "linear-gradient(180deg, #6D295A 0%, #420C36 100%)"
      }}
    >
      <FlexBetween gap="1.75rem">
        {!isNonMobile && (
          <IconButton onClick={() => setToggled(!toggled)} sx={{ color: "#FFFFFF" }}>
            <MenuOutlined />
          </IconButton>
        )}
        <Box display="flex" alignItems="center" gap="10px">
          <Typography
            fontWeight="bold"
            fontSize="clamp(1rem, 2rem, 2.25rem)"
            color="#FFFFFF"
            onClick={() => navigate("/")}
            sx={{ "&:hover": { color: "rgba(255, 255, 255, 0.8)", cursor: "pointer", }, }}
          >
            Stylist
          </Typography>
        </Box>

        <Box display="flex" gap="15px" ml="20px">
          <Typography variant="body2" sx={{ cursor: "pointer", color: "#FFFFFF", "&:hover": { textDecoration: "underline" }, }}>
            Edit Salon Page
          </Typography>
          <Typography variant="body2" sx={{ cursor: "pointer", color: "#FFFFFF", "&:hover": { textDecoration: "underline" }, }}>
            Headcase Salon
          </Typography>
        </Box>
      </FlexBetween>

      <FlexBetween gap="2rem">
        <Box display="flex" alignItems="center" gap="0.5rem">
          <AccessTime sx={{ color: "#FFFFFF", fontSize: "1.2rem" }} />
          <Typography
            variant="body2"
            sx={{ color: "#FFFFFF", fontSize: "0.9rem", whiteSpace: "nowrap", }}
          >
            {formatDateTime(currentDateTime)}
          </Typography>
        </Box>
        <IconButton onClick={colorMode.toggleColorMode} sx={{ color: "#FFFFFF" }}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlined />
          ) : (
            <DarkModeOutlined />
          )}
        </IconButton>
        <IconButton onClick={handleClick} sx={{ color: "#FFFFFF" }}>
          <PersonOutlined sx={{ fontSize: "25px" }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={isOpen}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
          PaperProps={{
            sx: { width: 300, p: 2, borderRadius: 3, boxShadow: "0 4px 20px rgba(0,0,0,0.15)", },
          }}
        >
          <Box textAlign="center">
            <Avatar sx={{ width: 80, height: 80, mx: "auto", border: "2px solid #444", mb: 1, }} />
            <Typography variant="h6" fontWeight="bold">
              Tommy M. Mitchell
            </Typography>
            <Typography variant="body2" color="text.secondary">
              BarberMan at Looks Unisex Salon
            </Typography>

            <Box mt={1} display="flex" justifyContent="center" alignItems="center" gap={0.5}>
              <Star size={16} color="#fbc02d" fill="#fbc02d" />
              <Star size={16} color="#fbc02d" fill="#fbc02d" />
              <Star size={16} color="#fbc02d" fill="#fbc02d" />
              <Star size={16} color="#fbc02d" fill="#fbc02d" />
              <StarHalf size={16} color="#fbc02d" fill="#fbc02d" />
              <Typography variant="body2" sx={{ ml: 1 }}>
                (212 Reviews)
              </Typography>
            </Box>
            <Typography mt={1.5} fontSize={13} fontWeight="bold" sx={{ color: "#6D295A" }}>
              OPENING TIMING: 09:00AM TO 07:30PM
            </Typography>
          </Box>
          <Divider sx={{ my: 1.5 }} />

          {/* Action Items */}
          {/* <MenuItem onClick={() => navigate("/change-password")}>
            <Person sx={{ mr: 2, color: "#6D295A" }} /> Change Password
          </MenuItem> */}
          <MenuItem onClick={() => navigate("/stylist-profile")}>
            <Person sx={{ mr: 2, color: "#6D295A" }} /> Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutOutlined sx={{ mr: 2, color: "#6D295A" }} /> Log Out
          </MenuItem>
        </Menu>
      </FlexBetween>
    </FlexBetween>
  );
};

export default VendorNavbar;
