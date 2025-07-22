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


function Dashboard() {
  const [overviewData, setOverviewData] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const authToken = Cookies.get("token");

  const fetchOverViewDataOfDashboard = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard-details`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log(response.data, 'sdfsdfdf');
      if (response.data.success) {
        setOverviewData(response.data.data);
        setRecentActivity(response.data.data.recentActivities);
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

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
          <Grid container spacing={2} sx={{ mb: 3 }}>
            {overviewStats.map((stat, idx) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={stat.title}>
                <Card sx={{ background: stat.color, borderRadius: 2, boxShadow: 4, border: '0.5px solid #6d295a' }}>
                  <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 2 }}>
                    {stat.icon}
                    <Typography variant="subtitle2" sx={{ mt: 1, color: '#6D295A', fontWeight: 700 }}>{stat.title}</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#222' }}>{stat.value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Recent Activity Feed */}
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2, color: '#6D295A', fontWeight: 700 }}>Recent Activity</Typography>
              <List>
                {recentActivity?.map((activity, idx) => (
                  <ListItem button key={idx} sx={{ borderRadius: 2, mb: 1, '&:hover': { background: '#F3E8F1' } }}>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: '#fff', border: '2px solid #6D295A' }}>
                        <EventIcon sx={{ color: 'black' }} />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<Typography sx={{ fontWeight: 600 }}>{activity.text}</Typography>}
                      secondary={<Typography variant="caption" sx={{ color: '#7b7b7b' }}>{activity.time}</Typography>}
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
