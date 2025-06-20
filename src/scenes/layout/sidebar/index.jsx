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
import logo from "../../../assets/images/LOGO2.png";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  CalendarTodayOutlined,
  DashboardOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  PersonOutlined,
} from "@mui/icons-material";
import Item from "./Item";
import { ToggledContext } from "../../../App";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const panelType = localStorage.getItem("panelType");

  const navSections = {
    admin: [
      { title: "Customers", path: "/customers", icon: <PeopleAltOutlined /> },
      { title: "Stylist", path: "/Stylist", icon: <PeopleAltOutlined /> },
      { title: "Order Details", path: "/order-details", icon: <PeopleAltOutlined /> },
    ],
    vendor: [
      { title: "Appointments", path: "/stylist-appointments", icon: <CalendarTodayOutlined /> },
      { title: "Profile", path: "/stylist-profile", icon: <PersonOutlined /> },
    ],
  };

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
          <Item title="Dashboard" path="/" colors={colors} icon={<DashboardOutlined sx={{ color: "#FFFFFF" }} />} />
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
          {(navSections[panelType] || []).map(({ title, path, icon }) => (
            <Item key={title} title={title} path={path} colors={colors} icon={React.cloneElement(icon, { sx: { color: "#FFFFFF" } })} />
          ))}
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default SideBar;
