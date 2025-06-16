import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, Box, Button, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from "@mui/material";
import { Email, Visibility, VisibilityOff, Lock, PersonOutlined } from "@mui/icons-material";
import logo from "../assets/images/logo1.png";
import watermark from "../assets/images/watermark1.png";
import watermark1 from "../assets/images/3997198-uhd_4096_2160_25fps.mp4";

import "../css/login.scss";
import Input from "../custom/Input";
import axios from "axios";

const Login = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [panelType, setPanelType] = useState("adminpanel");
  const [stylistId, setStylistId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    setIsLoading(true);

    try {
      if (panelType === "adminpanel") {
        if (!email || !password) {
          setError("Please fill in all fields");
          return;
        }
        const response = await axios.post("http://3.223.253.106:5050/api/admin/login", {
          email,
          password,
        });
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
        localStorage.removeItem("panelType");
        localStorage.removeItem("stylistId");
        localStorage.removeItem("vendorToken");
        const token = response.data.token;
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("token", token);
        localStorage.setItem("panelType", "admin");
        onLoginSuccess(true, 'admin', token, null);
      } else {
        localStorage.removeItem("isAuthenticated");
        localStorage.removeItem("token");
        localStorage.removeItem("panelType");
        localStorage.removeItem("stylistId");
        localStorage.removeItem("vendorToken");
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("panelType", "vendor");
        localStorage.setItem("stylistId", stylistId);

        onLoginSuccess(true, 'vendor', null, stylistId);
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      className="login-container"
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid container spacing={0} sx={{ flex: 1 }}>
        {/* Left Column - Video & Content */}
        <Grid
          item
          xs={12}
          md={8}
          className="left-column"
          sx={{
            position: "relative",
            overflow: "hidden",
            minHeight: { xs: "50vh", md: "100%" }, // ensure height on small devices
          }}
        >
          <video
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              zIndex: 0,
            }}
          >
            <source src={watermark1} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1,
            }}
          />

          <Box
            sx={{
              display: { xs: "none", md: "flex" },
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography variant="h6" sx={{ color: "white" }}>
              Welcome to
            </Typography>
            <Typography
              variant="h2"
              sx={{
                fontWeight: "bold",
                color: "white",
                fontSize: { sm: "2.5rem", md: "3rem" },
              }}
            >
              Hair Style Saloon
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "white",
                maxWidth: { sm: 600, md: 800 },
                mt: 2,
                fontSize: { sm: "1rem" },
              }}
            >
              Discover the art of transformation with our expert stylists. Whether you're after a bold new look or subtle sophistication, we deliver styles that speak for you. Walk in for a haircut — walk out with confidence.
            </Typography>
          </Box>

        </Grid>
        <Grid
          item
          xs={12}
          md={4}
          className="right-column"
          sx={{
            position: { xs: "absolute", md: "relative" },
            top: { xs: 0, md: "auto" },
            left: { xs: 0, md: "auto" },
            width: { xs: "100%", md: "auto" },
            height: { xs: "100%", md: "auto" },
            zIndex: { xs: 3, md: "auto" },
            backgroundImage: {
              xs: "none",
              md: `url(${watermark})`,
            },
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            backgroundPosition: "center",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 2, sm: 4 },
            py: { xs: 4, md: 10 },
          }}
        >
          <Box className="login-form" sx={{ width: "100%", maxWidth: 400 }}>
            <FormControl>
              <RadioGroup
                row
                aria-labelledby="panel-selection"
                name="panel-selection"
                value={panelType}
                onChange={(e) => setPanelType(e.target.value)}
              >
                <FormControlLabel value="adminpanel" control={<Radio />} label="ADMIN PANEL" />
                <FormControlLabel value="vendorpanel" control={<Radio />} label="VENDOR PANEL" />
              </RadioGroup>
            </FormControl>

            {panelType === "adminpanel" ? (
              <>
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
              </>
            ) : (
              <Input
                placeholder="Enter Stylist ID"
                type="text"
                value={stylistId}
                onChange={(e) => setStylistId(e.target.value)}
                icon={<PersonOutlined />}
              />
            )}

            {error && (
              <Typography color="error" sx={{ mt: 1, mb: 1 }}>
                {error}
              </Typography>
            )}

            <Button
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{
                mt: 2,
                bgcolor: "black",
                color: "white",
                "&:hover": { bgcolor: "grey" },
              }}
              onClick={handleLogin}
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </Box>
        </Grid>

      </Grid>
    </Box>

  );
};

export default Login;
