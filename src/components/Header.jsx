import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "../theme";
import { useLocation } from "react-router-dom";

const Header = ({ title, subtitle, path }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const location = useLocation();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const pathName = location.pathname
    .split("/")
    .filter(Boolean)
    .map(str => str.replace(/-/g, " "))
    .map(str => str.charAt(0).toUpperCase() + str.slice(1))
    .join(" / ");

  return (
    <Box
      mb="10px"
      display="flex"
      flexDirection={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "center" }}
      gap={{ xs: 1, sm: 0 }}
    >
      <Box>
        <Typography
          variant={isMobile ? "h4" : "h3"}
          fontWeight="bold"
          color={colors.gray[100]}
          mb="5px"
          sx={{ fontSize: { xs: "1rem", sm: "1.5rem", md: "1rem" } }}
        >
          {title}
        </Typography>
        <Typography
          variant={isMobile ? "h6" : "h5"}
          color={colors.redAccent[400]}
          sx={{ fontSize: { xs: "0.15rem", sm: "0.85rem", md: "0.75rem" } }}
        >
          {subtitle}
        </Typography>
      </Box>
      <Typography
        variant={isMobile ? "h6" : "h5"}
        fontWeight="bold"
        color={colors.gray[100]}
        mb="5px"
        sx={{
          fontSize: { xs: "0.8rem", sm: "1rem", md: "1.25rem" },
          textAlign: { xs: "left", sm: "right" }
        }}
      >
        Home{pathName ? ` / ${pathName}` : ""}
      </Typography>
    </Box>
  );
};

export default Header;
