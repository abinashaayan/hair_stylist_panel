/* eslint-disable react/prop-types */
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import { useContext, useState } from "react";
// import avatar from "../../../assets/images/avatar.png";
import logo from "../../../assets/images/logo1.png";
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

  return (
    <Sidebar
      backgroundColor={colors.primary[400]}
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
            color: colors.gray[100],
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", }}>
            {!collapsed && (
              <Box display="flex" alignItems="center" gap="12px" sx={{ transition: ".3s ease" }}>
                <img
                  alt="avatar"
                  src={logo}
                  className="mt-3"
                  style={{ width: "130px", height: "40px" }}
                />
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
                color: "#868dfb",
                background: "transparent",
                transition: ".4s ease",
              },
            },
          }}
        >
          <Item title="Dashboard" path="/" colors={colors} icon={<DashboardOutlined />} />
        </Menu>

        {panelType === "admin" ? (
          <>
            <Typography variant="h6" color={colors.gray[300]} sx={{ m: "15px 0 5px 20px" }}>
              {!collapsed ? "Data" : " "}
            </Typography>
            <Menu menuItemStyles={{ button: { ":hover": { color: "#868dfb", background: "transparent", transition: ".4s ease", }, }, }}>
              <Item title="Customers" path="/customers" colors={colors} icon={<PeopleAltOutlined />} />
              <Item title="Category" path="/menu" colors={colors} icon={<PeopleAltOutlined />} />
            </Menu>
          </>
        ) : (
          <>
            <Typography variant="h6" color={colors.gray[300]} sx={{ m: "15px 0 5px 20px" }}>
              {!collapsed ? "Vendor" : " "}
            </Typography>
            <Menu menuItemStyles={{ button: { ":hover": { color: "#868dfb", background: "transparent", transition: ".4s ease", }, }, }}>
              <Item title="Appointments" path="/stylist-appointments" colors={colors} icon={<CalendarTodayOutlined />} />
              <Item title="Profile" path="/stylist-profile" colors={colors} icon={<PersonOutlined />} />
            </Menu>
          </>
        )}
      </Box>
    </Sidebar>
  );
};

export default SideBar;
