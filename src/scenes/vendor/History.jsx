import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const History = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h2" color={colors.gray[100]} fontWeight="bold" mb="5px">
          Appointment History
        </Typography>
      </Box>
      <Box
        backgroundColor={colors.primary[400]}
        p="30px"
        borderRadius="4px"
      >
        {/* Add your history content here */}
        <Typography variant="h5" color={colors.gray[100]}>
          Appointment History Content
        </Typography>
      </Box>
    </Box>
  );
};

export default History; 