/* eslint-disable react/prop-types */
import React from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useContext, useState, useEffect } from "react";
import logo from "../../../assets/images/LOGO2.png";
import { tokens } from "../../../theme";
import { Menu, MenuItem, Sidebar } from "react-pro-sidebar";
import {
  DashboardOutlined,
  MenuOutlined,
  PeopleAltOutlined,
  PersonOutlined,
  CalendarMonthOutlined,
  InventoryOutlined,
  AccessTimeOutlined,
  AddCircleOutline,
  Close,
  HistoryOutlined,
} from "@mui/icons-material";
import Item from "./Item";
import { ToggledContext } from "../../../App";

const SideBar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { toggled, setToggled } = useContext(ToggledContext);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const panelType = localStorage.getItem("panelType");
  const isMdDevices = useMediaQuery("(max-width:768px)");
  const isMobile = useMediaQuery("(max-width:480px)");


  useEffect(() => {
    if (!isMdDevices) {
      const mainContent = document.querySelector('[data-main-content]');
      if (mainContent) {
        const sidebarWidth = collapsed ? 80 : 250;
        mainContent.style.marginLeft = `${sidebarWidth}px`;
      }
    }
  }, [collapsed, isMdDevices]);

  // Mobile: update marginLeft based on toggled state
  useEffect(() => {
    if (isMdDevices) {
      const mainContent = document.querySelector('[data-main-content]');
      if (mainContent) {
        mainContent.style.marginLeft = toggled ? "250px" : "0px";
      }
    }
  }, [toggled, isMdDevices]);


  const navSections = {
    admin: [
      { title: "Customers", path: "/customers", icon: <PeopleAltOutlined /> },
      { title: "Stylist", path: "/stylist", icon: <PeopleAltOutlined /> },
      { title: "Stylist Reviews", path: "/stylist-reviews", icon: <PersonOutlined /> },
      { title: "Products", path: "/product", icon: <PersonOutlined /> },
      { title: "Product Category", path: "/category", icon: <PeopleAltOutlined /> },
      { title: "Stylist Services", path: "/service", icon: <PeopleAltOutlined /> },
      { title: "Order Details", path: "/order-details", icon: <PeopleAltOutlined /> },
      { title: "Appointment Status", path: "/appointment-status", icon: <PersonOutlined /> },
    ],
    vendor: [
      { title: "Packages", path: "/packages", icon: <InventoryOutlined /> },
      { title: "Services", path: "/services", icon: <CalendarMonthOutlined /> },
      { title: "Reviews", path: "/reviews", icon: <PersonOutlined /> },
      { title: "Portfolio", path: "/portfolio", icon: <AddCircleOutline /> },
      { title: "Availability Management", path: "/availability", icon: <AccessTimeOutlined /> },
      { title: "Appointment Management", path: "/appointment", icon: <HistoryOutlined /> },
    ],
  };

  return (
    <Sidebar
      backgroundColor="transparent"
      rootStyles={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        zIndex: 1000,
        borderRightWidth: "1px",
        borderRightStyle: "solid",
        borderColor: "#efefef",
        WebkitTransition: "width, left, right, 300ms",
        transition: "width, left, right, 300ms",
        width: collapsed ? "80px" : "250px",
        zIndex: 1000,
        minWidth: collapsed ? "80px" : "250px",
        border: 0,
        background: "linear-gradient(180deg, #6D295A 0%, #420C36 100%)",
        "@media (max-width: 768px)": {
          width: toggled ? "250px" : "0px",
          minWidth: toggled ? "250px" : "0px",
        }
      }}
      collapsed={collapsed}
      onBackdropClick={() => setToggled(false)}
      toggled={toggled}
      breakPoint="md"
      className="sidebar-container"
    >
      <Menu menuItemStyles={{ button: { ":hover": { background: "transparent" } }, }}>
        <MenuItem rootStyles={{ margin: "10px 0 20px 0", color: "#FFFFFF", }}>
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: { xs: "0 10px", sm: "0 1px" }
          }}>
            {!collapsed && (
              <Box display="flex" alignItems="center" gap="12px" sx={{ transition: ".3s ease" }}>
                <img alt="avatar" src={logo} className="mt-3" height={isMobile ? "40" : "50"} style={{ maxWidth: "100%" }} />
              </Box>
            )}
            {isMdDevices && toggled && (
              <Box sx={{ display: "flex", justifyContent: "flex-end", p: 1 }}>
                <IconButton onClick={() => setToggled(false)} sx={{ color: "#FFFFFF" }}>
                  <Close sx={{ fontSize: 24 }} />
                </IconButton>
              </Box>
            )}
            {!isMdDevices && (
              <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: "#FFFFFF", padding: { xs: "8px", sm: "12px" } }}>
                <MenuOutlined sx={{ fontSize: { xs: "18px", sm: "20px" } }} />
              </IconButton>
            )}
          </Box>
        </MenuItem>
      </Menu>
      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.2)" }} />

      <Box mb={5} pl={collapsed ? undefined : { xs: "3%", sm: "5%" }}>
        <Menu
          menuItemStyles={{
            button: {
              transition: "all 0.4s ease",
              fontWeight: "bold",
              color: "#FFFFFF",
              fontSize: { xs: "14px", sm: "16px" },
              padding: { xs: "8px 12px", sm: "12px 16px" },
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
              fontSize: { xs: "14px", sm: "16px" },
              padding: { xs: "8px 12px", sm: "12px 16px" },
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
