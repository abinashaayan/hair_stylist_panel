import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const Availability = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h2" color={colors.gray[100]} fontWeight="bold" mb="5px">
          Availability Management
        </Typography>
      </Box>
      <Box
        backgroundColor={colors.primary[400]}
        p="30px"
        borderRadius="4px"
      >
        {/* Add your availability management content here */}
        <Typography variant="h5" color={colors.gray[100]}>
          Availability Management Content
        </Typography>
      </Box>
    </Box>
  );
};

export default Availability; 