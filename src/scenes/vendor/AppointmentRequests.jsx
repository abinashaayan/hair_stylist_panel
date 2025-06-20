import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { Header } from '../../components';

const AppointmentRequests = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box m="20px">
      <Header title="Appointment requests" />
      <Box
        backgroundColor={colors.primary[400]}
        p="30px"
        borderRadius="4px"
      >
        {/* Add your appointment requests content here */}
        <Typography variant="h5" color={colors.gray[100]}>
          Appointment Requests Content
        </Typography>
      </Box>
    </Box>
  );
};

export default AppointmentRequests; 