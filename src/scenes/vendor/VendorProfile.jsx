import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  useTheme,
  Grid,
  Avatar,
  Paper,
  Rating,
  Chip,
  Button,
  IconButton,
  Divider,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  Instagram,
  Facebook,
  Twitter,
  Edit,
  AccessTime,
  Star,
} from "@mui/icons-material";
import { tokens } from "../../theme";
import { Header } from '../../components';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/apiConfig';
import Cookies from "js-cookie";

const VendorProfile = () => {
  const [loading, setLoading] = useState(true);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rating] = useState(4.5);
  const authToken = Cookies.get("token");

  const services = [
    { name: "Haircut", price: "$30", duration: "30 min" },
    { name: "Hair Coloring", price: "$120", duration: "2 hrs" },
    { name: "Hair Styling", price: "$50", duration: "45 min" },
    { name: "Hair Treatment", price: "$80", duration: "1 hr" },
  ];

  const portfolio = [
    { image: "/src/assets/images/mostafa-meraji--QcWbgrih1Q-unsplash.jpg", title: "Modern Haircut" },
    { image: "/src/assets/images/jess-bailey-Bg14l3hSAsA-unsplash.jpg", title: "Hair Styling" },
  ];

  const businessHours = [
    { day: "Monday", hours: "9:00 AM - 6:00 PM" },
    { day: "Tuesday", hours: "9:00 AM - 6:00 PM" },
    { day: "Wednesday", hours: "9:00 AM - 6:00 PM" },
    { day: "Thursday", hours: "9:00 AM - 6:00 PM" },
    { day: "Friday", hours: "9:00 AM - 7:00 PM" },
    { day: "Saturday", hours: "10:00 AM - 5:00 PM" },
    { day: "Sunday", hours: "Closed" },
  ];

  const fetchStylistProfileDetails = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stylist/get`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(response?.data, 'Response profile deatils');
    } catch (error) {
      showErrorToast("Error fetching product categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchStylistProfileDetails();
    }
  }, [authToken])

  return (
    <Box m="20px">
      <Header title="My Profile" subtitle="View and manage your profile information" />
      <Paper
        sx={{
          position: 'relative',
          height: '300px',
          backgroundImage: 'url(/src/assets/images/mostafa-meraji--QcWbgrih1Q-unsplash.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          mb: 4,
        }}
      >
        <Box sx={{ position: 'absolute', bottom: '-50px', left: '50px', display: 'flex', alignItems: 'flex-end', gap: 3, }}>
          <Avatar src="/src/assets/images/avatar.png" sx={{ width: 150, height: 150, border: `4px solid ${colors.primary[400]}`, }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="h3" color="white" sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              Sarah Johnson
            </Typography>
            <Typography variant="h5" color="white" sx={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
              Professional Hair Stylist
            </Typography>
          </Box>
        </Box>
        <IconButton sx={{ position: 'absolute', top: 20, right: 20, backgroundColor: colors.primary[400], '&:hover': { backgroundColor: colors.primary[300] }, }}>
          <Edit />
        </IconButton>
      </Paper>

      <Grid container spacing={3} mt={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: colors.primary[400] }}>
            <Typography variant="h5" mb={2}>Contact Information</Typography>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <LocationOn />
              <Typography>123 Stylist Street, Beauty City, BC 12345</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Phone />
              <Typography>+1 (555) 123-4567</Typography>
            </Box>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Email />
              <Typography>sarah.johnson@example.com</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Typography variant="h6" mb={1}>Social Media</Typography>
            <Box display="flex" gap={1}>
              <IconButton><Instagram /></IconButton>
              <IconButton><Facebook /></IconButton>
              <IconButton><Twitter /></IconButton>
            </Box>
          </Paper>
          <Paper sx={{ p: 3, backgroundColor: colors.primary[400] }}>
            <Typography variant="h5" mb={2}>
              <AccessTime sx={{ mr: 1, verticalAlign: 'bottom' }} />
              Business Hours
            </Typography>
            {businessHours.map((schedule) => (
              <Box key={schedule.day} display="flex" justifyContent="space-between" mb={1}>
                <Typography>{schedule.day}</Typography>
                <Typography>{schedule.hours}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3, backgroundColor: colors.primary[400] }}>
            <Typography variant="h5" mb={3}>Services Offered</Typography>
            <Grid container spacing={2}>
              {services.map((service) => (
                <Grid item xs={12} sm={6} key={service.name}>
                  <Paper sx={{ p: 2, backgroundColor: colors.primary[300], display: 'flex', justifyContent: 'space-between', alignItems: 'center', }}>
                    <Box>
                      <Typography variant="h6">{service.name}</Typography>
                      <Typography variant="body2" color={colors.greenAccent[500]}>
                        {service.duration}
                      </Typography>
                    </Box>
                    <Typography variant="h6" color={colors.greenAccent[500]}>
                      {service.price}
                    </Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>

          <Paper sx={{ p: 3, backgroundColor: colors.primary[400] }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5">Portfolio</Typography>
              <Button variant="contained" color="secondary">
                Add New
              </Button>
            </Box>
            <Grid container spacing={2}>
              {portfolio.map((item, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ backgroundColor: colors.primary[300] }}>
                    <CardMedia component="img" height="200" image={item.image} alt={item.title} sx={{ objectFit: 'cover' }} />
                    <CardContent>
                      <Typography variant="h6">{item.title}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default VendorProfile;