import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Button, Typography } from "@mui/material";
import { Email, Visibility, VisibilityOff, Lock } from "@mui/icons-material";
import logo from "../assets/images/logo1.png";
import watermark from "../assets/images/watermark1.png";

import "../css/login.scss";
import Input from "../custom/Input";
import axios from "axios";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // const handleLogin = () => {
    //     if (email === "adminjohnson@yopmail.com" && password === "admin@12") {
    //         localStorage.setItem("isAuthenticated", "true");
    //         navigate("/");
    //     } else {
    //         alert("Invalid credentials!");
    //     }
    // };

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:5050/api/admin/login",
                { email, password }
            );

            console.log(response.data, "response");
            const token = response.data.token;


            localStorage.setItem("isAuthenticated", "true");
            localStorage.setItem("token", token);

            navigate("/");
        }
        catch (error) {
            return console.log(error)
        }
    }

    return (
        <Box className="login-container" sx={{ height: "100vh", display: "flex", flexDirection: "column" }}>
            <Grid container spacing={0} sx={{ flex: 1 }}>
                <Grid item xs={12} md={7} className="left-column" sx={{
                    // position: "relative",
                    backgroundImage: `url(${watermark})`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    backgroundSize: "100px", // adjust as needed
                    backgroundColor: "rgba(255, 255, 255, 0.3)", // adds a light overlay effect

                }}>
                    <Box >
                        <Box>
                            <img
                                alt="avatar"
                                src={logo}
                                style={{ width: "200px", height: "65px" }}
                            />
                        </Box>
                        <Typography variant="subtitle1" gutterBottom>
                            Welcome to Johnson Auto Part | Admin Panel
                        </Typography>
                        <Typography variant="h2" color="d" sx={{ fontWeight: "bold" }} gutterBottom>
                            Johnson Auto Part
                        </Typography>

                    </Box>
                </Grid>
                <Grid item xs={12} md={5} className="right-column" sx={{ bgcolor: "white" }}>
                    <Box className="login-form"
                        sx={{ mx: "auto", mt: 10, p: 4, }}>
                        <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
                            ADMIN LOGIN
                        </Typography>
                        <Input
                            placeholder="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={<Email />}
                        />
                        <Input
                            placeholder="Password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={<Lock />}
                            endIcon={showPassword ? <VisibilityOff /> : <Visibility />}
                            onEndIconClick={() => setShowPassword(!showPassword)}
                        />
                        <Button
                            variant="contained"
                            fullWidth
                            sx={{
                                mt: 2,
                                bgcolor: "black",
                                color: "white",
                                "&:hover": { bgcolor: "grey" },
                            }}
                            onClick={handleLogin}
                        >
                            Login
                        </Button>
                        {/* <Typography
                            sx={{ mt: 2, fontSize: "14px", color: "gray", cursor: "pointer" }}
                        >
                            Forgot Password?
                        </Typography> */}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Login;
