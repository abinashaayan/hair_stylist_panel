import React, { useContext, useState } from "react";
import { Box, Typography, IconButton, Divider, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import {
  DashboardOutlined,
  CalendarMonthOutlined,
  PersonOutline,
  MenuOutlined,
} from "@mui/icons-material";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import FlexBetween from "../components/FlexBetween";
import { ToggledContext } from "../App";
import { tokens } from "../theme"; // Import tokens

const VendorSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode); // Correctly initialize colors

  const navItems = [
    {
      text: "Dashboard",
      icon: <DashboardOutlined />,
      path: "/",
    },
    {
      text: "Appointments",
      icon: <CalendarMonthOutlined />,
      path: "/stylist-appointments",
    },
    {
      text: "Profile",
      icon: <PersonOutline />,
      path: "/stylist-profile",
    },
  ];

  return (
    <Sidebar
      backgroundColor={theme.palette.background.alt}
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
        height: "100%"
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
            color: colors.gray[100], // Use colors from tokens
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
            {!collapsed && (
              <Box display="flex" alignItems="center" gap="12px" sx={{ transition: ".3s ease" }}>
                <Typography variant="h4" fontWeight="bold" color={colors.gray[100]}> {/* Use colors from tokens */}
                  VENDOR PANEL
                </Typography>
              </Box>
            )}
            <IconButton onClick={() => setCollapsed(!collapsed)}>
              <MenuOutlined />
            </IconButton>
          </Box>
        </MenuItem>
      </Menu>
      <Divider />

      <Box mb={5} pl={collapsed ? undefined : "5%"}>
        <Menu
          menuItemStyles={{
            button: {
              ":hover": {
                color: colors.blueAccent[200], // Use colors from tokens
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          {navItems.map(({ text, icon, path }) => (
            <Link
              key={text}
              to={path}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <MenuItem
                active={window.location.pathname === path} // Assuming current path for active state
                icon={icon}
                style={{
                  color: window.location.pathname === path ? colors.blueAccent[500] : colors.gray[100], // Use colors from tokens
                }}
              >
                <Typography>{text}</Typography>
              </MenuItem>
            </Link>
          ))}
        </Menu>
      </Box>
    </Sidebar>
  );
};

export default VendorSidebar;
