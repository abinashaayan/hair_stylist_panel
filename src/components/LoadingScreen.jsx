import React from "react";
import { Box, CircularProgress } from "@mui/material";
import logo from "../assets/imageslogo1.png";

const LoadingScreen = () => {
    return (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100vh" bgcolor="#fff">
            <img src={logo} alt="App Logo" style={{ width: 120, marginBottom: 20 }} />
            <CircularProgress />
        </Box>
    );
};

export default LoadingScreen;
