import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Stack,
  Grid,
} from "@mui/material";
import {
  Header,
} from "../../components";
import {
  PersonAdd,
  PointOfSale,
  Group,
  MonetizationOn,
  PendingActions,
  Event,
  Category,
  ShoppingCart,
  LocalOffer,
  RateReview,
  CheckCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { tokens } from "../../theme";
import { useState } from "react";

const statData = [
  { title: "User Management", subtitle: "Add, Edit, Delete User", icon: <PersonAdd sx={{ fontSize: "26px" }} /> },
  { title: "Category Management", subtitle: "Add, Edit, Delete Category, Subcategory and more", icon: <PointOfSale sx={{ fontSize: "26px" }} /> },
];

// Mock statistics data
const overviewStats = [
  { title: "Total Users", value: 1240, icon: <Group sx={{ fontSize: 32, color: '#6D295A' }} />, color: '#F3E8F1' },
  { title: "Active Bookings", value: 87, icon: <Event sx={{ fontSize: 32, color: '#6D295A' }} />, color: '#E8F3F1' },
  { title: "Completed Services", value: 320, icon: <CheckCircle sx={{ fontSize: 32, color: '#6D295A' }} />, color: '#F1F3E8' },
  { title: "Revenue", value: "$12,400", icon: <MonetizationOn sx={{ fontSize: 32, color: '#6D295A' }} />, color: '#F3F1E8' },
  { title: "Pending Approvals", value: 5, icon: <PendingActions sx={{ fontSize: 32, color: '#6D295A' }} />, color: '#F1E8F3' },
];

// Quick actions
const quickActions = [
  { label: "User Management", icon: <Group /> },
  { label: "Category Management", icon: <Category />, },
  { label: "Appointment Management", icon: <Event /> },
  { label: "Product Management", icon: <ShoppingCart /> },
  { label: "Promotions", icon: <LocalOffer /> },
];

// Mock recent activity
const recentActivity = [
  { type: "booking", text: "New booking by Jane Doe", time: "2 min ago", icon: <Event sx={{ color: '#6D295A' }} /> },
  { type: "review", text: "Client review added for stylist John", time: "10 min ago", icon: <RateReview sx={{ color: '#6D295A' }} /> },
  { type: "stylist", text: "Stylist Anna updated her profile", time: "30 min ago", icon: <PersonAdd sx={{ color: '#6D295A' }} /> },
  { type: "approval", text: "New stylist sign-up pending approval", time: "1 hr ago", icon: <PendingActions sx={{ color: '#6D295A' }} /> },
  { type: "product", text: "Product listing updated", time: "2 hr ago", icon: <ShoppingCart sx={{ color: '#6D295A' }} /> },
];

function Dashboard() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isXlDevices = useMediaQuery("(min-width: 1260px)");
  const isMdDevices = useMediaQuery("(min-width: 724px)");
  const isXsDevices = useMediaQuery("(max-width: 436px)");
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedStat, setSelectedStat] = useState(null);
  const navigate = useNavigate();

  const handleStatClick = (stat) => {
    // Map your stat to its route here
    if (stat.title === "Category Management") {
      navigate("/category");
    } else if (stat.title === "User Management") {
      navigate("/customers");
    } else if (stat.type === "orders") {
      navigate("/orders");
    } else {
      // fallback or default navigation
      navigate("/");
    }
  };

  return (
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      {/* Overview Statistics */}
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

      {/* Quick Actions */}
      <Card sx={{ mb: 3, borderRadius: 3, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, color: '#6D295A', fontWeight: 700 }}>Quick Actions</Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          {quickActions.map((action) => (
            <Button
              key={action.label}
              variant="contained"
              color="secondary"
              startIcon={action.icon}
              sx={{ minWidth: 180, mb: 1, borderRadius: 2, fontWeight: 600, background: '#6D295A', color: 'white', '&:hover': { background: '#420C36' } }}
              onClick={() => navigate(action.to)}
            >
              {action.label}
            </Button>
          ))}
        </Stack>
      </Card>

      {/* Recent Activity Feed */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2, color: '#6D295A', fontWeight: 700 }}>Recent Activity</Typography>
          <List>
            {recentActivity?.map((activity, idx) => (
              <ListItem button key={idx} sx={{ borderRadius: 2, mb: 1, '&:hover': { background: '#F3E8F1' } }}>
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: '#fff', border: '2px solid #6D295A' }}>
                    {activity.icon}
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
    </Box>
  );
}

export default Dashboard;
