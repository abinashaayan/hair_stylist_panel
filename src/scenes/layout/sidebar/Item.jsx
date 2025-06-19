/* eslint-disable react/prop-types */
import { useTheme } from "@mui/material";
import React from "react";
import { MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import { tokens } from "../../../theme";


const Item = ({ title, path, icon }) => {
  const location = useLocation();
  const theme = useTheme();
  const isActive = location.pathname === path;
  const colors = tokens(theme.palette.mode);
  

  return (
    <MenuItem
      component={<Link to={path} />}
      icon={React.cloneElement(icon, {
        sx: { color: isActive ? "#6d295a" : "#FFFFFF" },
      })}
      style={{
        color: isActive ? "#000000" : "#FFFFFF",
        fontWeight: "bold",
        backgroundColor: isActive ? "#f2f0f0" : "transparent",
        borderTopLeftRadius: "30px",
        transition: "all 0.4s ease",
        ...(isActive
          ? {
            boxShadow: "inset 3px 0 0 #1976d2",
          }
          : {
            boxShadow: "none",
          }),
      }}
    >
      {title}
    </MenuItem>
  );
};
export default Item;
