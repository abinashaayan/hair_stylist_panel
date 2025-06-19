/* eslint-disable react/prop-types */
import React from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useContext, useState } from "react";
import logo from "../assets/images/LOGO2.png"
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  DashboardOutlined,
  MenuOutlined,
  CalendarMonthOutlined,
  PersonOutline,
  HistoryOutlined,
  InventoryOutlined,
  AccessTimeOutlined,
  AddCircleOutline,
} from "@mui/icons-material";
import { tokens } from "../theme";
import { ToggledContext } from '../App';
import Item from "../scenes/layout/sidebar/Item";
import { useLocation } from "react-router-dom";

const VendorSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const location = useLocation();
  const panelType = localStorage.getItem("panelType");

  const navSections = [
    {
      text: "All Users",
      icon: <PersonOutline />,
      path: "/users",
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
        width: "250px",
        minWidth: "250px",
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
                <img alt="avatar" src={logo} className="mt-3" height="50" />
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
              transition: "all 0.4s ease",
              fontWeight: "bold",
              color: "#FFFFFF",
              ":hover": {
                color: "#FFFFFF",
                background: "rgba(255,255,255,0.1)",
                transform: "translateX(4px)",
              },
            },
          }}
        >
          <Item title="Dashboard" path="/" icon={<DashboardOutlined />} />
        </Menu>

        <Divider sx={{ mx: "auto", borderColor: "#fff" }} />
        <Menu
          menuItemStyles={{
            button: {
              transition: "all 0.4s ease",
              fontWeight: "bold",
              color: "#FFFFFF",
              ":hover": {
                color: "#FFFFFF",
                background: "rgba(255,255,255,0.1)",
                transform: "translateX(4px)",
              },
            },
          }}
        >
          {navSections?.map(({ text, path, icon }) => (
            <Item key={text} title={text} path={path} colors={colors} icon={icon} />
          ))}
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default VendorSidebar;
