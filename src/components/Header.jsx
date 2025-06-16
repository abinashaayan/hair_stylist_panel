import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="10px">
      <Typography variant="h3" fontWeight="bold" color={colors.gray[100]} mb="5px">
        {title}
      </Typography>
      <Typography variant="h5" color={colors.redAccent[400]}>
        {subtitle}
      </Typography>
    </Box>
  );
};

export default Header;
