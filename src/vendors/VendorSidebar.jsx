import React, { useContext, useState } from "react";
import { Box, Typography, IconButton, Divider, useTheme } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import {
  DashboardOutlined,
  CalendarMonthOutlined,
  PersonOutline,
  MenuOutlined,
  HistoryOutlined,
  InventoryOutlined,
  AccessTimeOutlined,
  AddCircleOutline,
} from "@mui/icons-material";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import FlexBetween from "../components/FlexBetween";
import { ToggledContext } from "../App";
import { tokens } from "../theme"; // Import tokens

const VendorSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const location = useLocation();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navItems = [
    {
      text: "Dashboard",
      icon: <DashboardOutlined />,
      path: "/",
    },
    {
      text: "Calendar",
      icon: <CalendarMonthOutlined />,
      path: "/calendar",
    },
    {
      text: "Appointment Requests",
      icon: <AddCircleOutline />,
      path: "/appointment-requests",
    },
    {
      text: "History",
      icon: <HistoryOutlined />,
      path: "/history",
    },
    {
      text: "Packages",
      icon: <InventoryOutlined />,
      path: "/packages",
    },
    {
      text: "Availability Management",
      icon: <AccessTimeOutlined />,
      path: "/availability",
    },
    {
      text: "Create Appointment",
      icon: <AddCircleOutline />,
      path: "/create-appointment",
    },
    {
      text: "Profile",
      icon: <PersonOutline />,
      path: "/stylist-profile",
    },
  ];

  return (
    <Sidebar
      backgroundColor="transparent"
      rootStyles={{
        position: "relative",
        borderRightWidth: "1px",
        borderRightStyle: "solid",
        borderColor: "#efefef",
        WebkitTransition: "width, left, right, 300ms",
        transition: "width, left, right, 300ms",
        width: "300px",
        minWidth: "300px",
        border: 0,
        height: "100%",
        background: "linear-gradient(180deg, #6D295A 0%, #420C36 100%)"
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
      className="sidebar-container"
    >
      <Menu menuItemStyles={{ button: { ":hover": { background: "transparent" } }, }}>
        <MenuItem
          rootStyles={{
            margin: "10px 0 20px 0",
            color: "#FFFFFF",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
            {!collapsed && (
              <Box display="flex" alignItems="center" gap="12px" sx={{ transition: ".3s ease" }}>
                <Typography variant="h4" fontWeight="bold" color="#FFFFFF">
                  VENDOR PANEL
                </Typography>
              </Box>
            )}
            <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: "#FFFFFF" }}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }} />

      <Box mb={5} pl={collapsed ? undefined : "5%"}>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: "#FFFFFF",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          {navItems.map(({ text, icon, path }) => (
            <Link key={text} to={path} style={{ textDecoration: "none", color: "inherit", }}>
              <MenuItem
                active={location.pathname === path}
                icon={icon}
                style={{
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  backgroundColor: location.pathname === path ? "rgba(255, 255, 255, 0.1)" : "transparent",
                }}
              >
                <Typography sx={{ fontWeight: "bold" }}>{text}</Typography>
              </MenuItem>
            </Link>
          ))}
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default VendorSidebar;
