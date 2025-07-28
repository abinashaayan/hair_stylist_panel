import {
  Box,
  Card,
  CardContent,
  Typography,
  useTheme,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Grid,
  CircularProgress,
} from "@mui/material";
import {
  Header,
} from "../../components";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE_URL } from "../../utils/apiConfig";
import Cookies from "js-cookie";
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import EventIcon from '@mui/icons-material/Event';

const timeAgo = (date) => {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);

  if (seconds < 60) return `${seconds} sec ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
  return `${Math.floor(seconds / 86400)} days ago`;
};

function Dashboard() {
  const [overviewData, setOverviewData] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [rawRecentActivity, setRawRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);


  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authToken = Cookies.get("token");

  const fetchOverViewDataOfDashboard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/overview`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data.success) {
        console.log(response.data.data, 'overview data')
        setOverviewData(response.data.data);
        // const recent = response.data.data.recentActivity.map((item) => ({
        //   ...item,
        //   time: timeAgo(item.timeRaw),
        // }));
        setRawRecentActivity(response.data.data.recentActivity); // stores raw datetime
        setRecentActivity(response.data.data.recentActivity); // visible activity with time text
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authToken) {
      fetchOverViewDataOfDashboard();
    }
  }, [authToken]);

  useEffect(() => {
    // Recalculate time every 60 seconds
    const interval = setInterval(() => {
      const updated = rawRecentActivity.map((item) => ({
        ...item,
        time: timeAgo(item.timeRaw),
      }));
      setRecentActivity(updated);
    }, 60000); // 60 sec

    return () => clearInterval(interval);
  }, [rawRecentActivity]);

  const overviewStats = [
    {
      title: "Total Users",
      value: overviewData.totalUsers || 0,
      color: "#E0BBE4",
      icon: <PersonIcon />,
    },
    {
      title: "Active Bookings",
      value: overviewData.activeBookings || 0,
      color: "#957DAD",
      icon: <BookIcon />,
    },
    {
      title: "Completed Services",
      value: overviewData.completedServices || 0,
      color: "#D291BC",
      icon: <CheckCircleIcon />,
    },
    {
      title: "Revenue",
      value: overviewData.revenue || 0,
      color: "#FEC8D8",
      icon: <AttachMoneyIcon />,
    },
    {
      title: "Pending Approvals",
      value: overviewData.pendingApprovals || 0,
      color: "#FFDFD3",
      icon: <HourglassEmptyIcon />,
    },
  ];

  const getAvatarColor = (type) => {
    switch (type) {
      case "booking":
        return "#ffe0b2"; // orange
      case "review":
        return "#c8e6c9"; // green
      case "profile":
        return "#bbdefb"; // blue
      case "approval":
        return "#f8bbd0"; // pink
      case "product":
        return "#d1c4e9"; // purple
      default:
        return "#e0e0e0"; // grey fallback
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {overviewStats.map((stat) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={stat.title}>
                <Card sx={{ background: stat.color, borderRadius: 2, boxShadow: 4, border: '0.5px solid #6d295a' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                    {stat.icon}
                    <Typography variant="subtitle2" sx={{ mt: 1, color: '#6D295A', fontWeight: 700 }}>
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#222' }}>
                      {stat.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Recent Activity Feed */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#6D295A', fontWeight: 700 }}>
                Recent Activity
              </Typography>
              <List>
                {recentActivity?.map((activity, idx) => (
                  <ListItem
                    button
                    key={idx}
                    sx={{ borderRadius: 2, mb: 1, '&:hover': { background: '#F3E8F1' } }}
                  >
                    <ListItemAvatar>
                      <Box position="relative" display="inline-flex">
                        {/* Animated progress ring */}
                        <CircularProgress
                          variant="indeterminate"
                          size={46}
                          thickness={4}
                          sx={{
                            color: getAvatarColor(activity.type),
                            animationDuration: '2s',
                          }}
                        />
                        {/* Avatar in center */}
                        <Box
                          position="absolute"
                          top={0}
                          left={0}
                          bottom={0}
                          right={0}
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                        >
                          <Avatar
                            sx={{
                              bgcolor: getAvatarColor(activity.type),
                              border: '2px solid #6D295A',
                              width: 36,
                              height: 36,
                            }}
                          >
                            <EventIcon sx={{ color: 'black', fontSize: 20 }} />
                          </Avatar>
                        </Box>
                      </Box>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Typography sx={{ fontWeight: 600 }}>
                          {activity.message}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="caption" sx={{ color: '#7b7b7b' }}>
                          {activity.time}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </>
      )}
    </Box>
  );
}


export default Dashboard;
