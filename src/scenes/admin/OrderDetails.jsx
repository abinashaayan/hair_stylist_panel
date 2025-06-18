import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const OrderDetails = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    return (
        <Box m="20px">
            <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h2" color={colors.gray[100]} fontWeight="bold" mb="5px">
                    Order Details
                </Typography>
            </Box>
            <Box backgroundColor={colors.primary[400]} p="30px" borderRadius="4px">
                <Typography variant="h5" color={colors.gray[100]}>
                    Order Details
                </Typography>
            </Box>
        </Box>
    );
};

export default OrderDetails; 