import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import { useLocation } from "react-router-dom";

const Header = ({ title, subtitle, path }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();

  const pathName = location.pathname
    .split("/")
    .filter(Boolean)
    .map(str => str.replace(/-/g, " "))
    .map(str => str.charAt(0).toUpperCase() + str.slice(1))
    .join(" / ");

  return (
    <Box mb="10px" display="flex" justifyContent="space-between">
      <Box>
        <Typography variant="h3" fontWeight="bold" color={colors.gray[100]} mb="5px">
          {title}
        </Typography>
        <Typography variant="h5" color={colors.redAccent[400]}>
          {subtitle}
        </Typography>
      </Box>
      <Typography variant="h5" fontWeight="bold" color={colors.gray[100]} mb="5px">
        Home{pathName ? ` / ${pathName}` : ""}
      </Typography>
    </Box>
  );
};

export default Header;
