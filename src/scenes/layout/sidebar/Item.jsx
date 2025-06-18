/* eslint-disable react/prop-types */
import { MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";

const Item = ({ title, path, icon }) => {
  const location = useLocation();
  return (
    <MenuItem
      component={<Link to={path} />}
      to={path}
      icon={icon}
      rootStyles={{
        color: "#FFFFFF",
        "&.ps-active": {
          color: "#FFFFFF",
          backgroundColor: "rgba(255,255,255,0.1)",
        }
      }}
    >
      {title}
    </MenuItem>
  );
};

export default Item;
