import React, { useEffect, useState } from "react";
import { Box, Typography, useTheme, Button, useMediaQuery, Select, MenuItem } from "@mui/material";
import {
  CalendarMonth,
  EventNoteOutlined,
  SpaOutlined,
  HistoryOutlined,
  RedeemOutlined,
  FactCheckOutlined,
  AddOutlined,
  StarOutline,
} from "@mui/icons-material";
import Header from "../components/Header";
import CustomCalendar from "./CustomCalendar";
import { Banknote } from "lucide-react";
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import "../vendors/customscss/Dashboard.scss";
// import useStylistAvailability from "../hooks/useStylistAvailability";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VendorDashboard = () => {
  const [apiData, setApiData] = useState([]);

  const authToken = Cookies.get("token");
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");

  // const { data: availabilityList } = useStylistAvailability();

  const fetchAvailability = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/stylist/get-availability`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });
      if (res.data && res.data.success) {
        setApiData(res.data.data || []);
      }
    } catch (err) {
      showErrorToast('Failed to fetch availability data');
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, [authToken]);

  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  const statData = [
    { title: "Availability Management", path: "/availability", icon: <EventNoteOutlined /> },
    { title: "Upcoming Appointments", path: "/availability", icon: <SpaOutlined /> },
    { title: "History", path: "/appointment", icon: <HistoryOutlined /> },
    { title: "Availability Management", path: "/availability", icon: <FactCheckOutlined /> },
    { title: "Lorem Services", path: "", icon: <StarOutline /> },
  ];

  return (
    // m: { xs: "10px", sm: "15px", md: "1.5rem 2.5rem" },
    <Box sx={{ width: "100%", maxWidth: "100%" }}>
      <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns={{
          xs: "repeat(2, 1fr)",
          sm: "repeat(3, 1fr)",
          md: "repeat(4, 1fr)",
          lg: "repeat(4, 1fr)",
          xl: "repeat(8, 1fr)"
        }}
        gridAutoRows="140px"
        gap={{ xs: "15px", sm: "20px" }}
        sx={{ width: "100%" }}
      >
        {statData?.map((stat, index) => (
          <Box
            key={index}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={{ xs: "0.5rem", sm: "1rem" }}
            borderRadius="0.55rem"
            sx={{
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.05)" },
              background: "linear-gradient(180deg, #6D295A 0%, #420C36 100%)",
              color: "#FFFFFF",
              gridColumn: {
                xs: "span 1",
                sm: "span 1",
                md: "span 1",
                lg: "span 1",
                xl: "span 1"
              }
            }}
          >
            {stat.icon &&
              React.cloneElement(stat.icon, {
                sx: {
                  fontSize: { xs: "32px", sm: "40px", md: "48px" },
                  color: "#FFFFFF",
                  mb: 1
                },
              })}
            {stat.value && (
              <Typography
                variant="h4"
                sx={{
                  color: "#FFFFFF",
                  fontWeight: "bold",
                  mb: 0.5,
                  fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" }
                }}
              >
                {stat.value}
              </Typography>
            )}
            <Link to={stat?.path} className="text-decoration-none">
              <Typography
                variant="h6"
                sx={{
                  color: "#FFFFFF",
                  textAlign: "center",
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                  lineHeight: { xs: 1.2, sm: 1.3, md: 1.4 }
                }}
              >
                {stat.title}
              </Typography>
            </Link>
          </Box>
        ))}
      </Box>

      <Box mt={2}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            mb: "15px",
            textTransform: "uppercase",
            fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1rem" }
          }}
        >
          Top Performing Services
        </Typography>
        <Box
          display="flex"
          flexWrap="wrap"
          gap={{ xs: 2, sm: 3, md: 4 }}
          justifyContent={{ xs: "center", sm: "flex-start" }}
        >
          {[{ color: "red" }, { color: "gold" }, { color: "blue" }, { color: "green" }].map((item, idx) => (
            <Box key={idx} textAlign="center">
              <Box sx={{
                width: { xs: 60, sm: 70, md: 80 },
                height: { xs: 60, sm: 70, md: 80 },
                borderRadius: "50%",
                border: `4px solid ${item.color}`,
                padding: "5px",
                backgroundColor: "transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "auto"
              }}>
                <Box sx={{ width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "black" }} />
              </Box>
              <Typography mt={1} sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Lorem</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Appointments Table */}
      <Box sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "1fr 2fr"
        },
        gap: { xs: 2, md: 4 },
        mt: 3
      }}>
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              mb: "15px",
              textTransform: "uppercase",
              fontSize: { xs: "1.25rem", sm: "1.5rem", md: "1rem" }
            }}
          >
            Upcoming Appointments
          </Typography>
          <CustomCalendar year={currentYear} month={currentMonth} />
        </Box>
        <Box sx={{ minHeight: "100vh" }}>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }, gap: { xs: 2, sm: 3, md: 4 } }}>
            <Box className="p-4" sx={{
              background: "linear-gradient(180deg, #6D295A 0%, #420C36 100%)",
              borderRadius: 2,
              color: "white",
              padding: { xs: "1rem", sm: "1.5rem" }
            }}>
              <Typography variant="subtitle2" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Total Earnings</Typography>
              <Typography variant="h4" sx={{ fontSize: { xs: "1.5rem", sm: "2rem", md: "2.125rem" } }}>$2,674.68</Typography>
              <Box
                display="flex"
                flexDirection={{ xs: "column", sm: "row" }}
                alignItems={{ xs: "stretch", sm: "center" }}
                gap={2}
                mt={2}
                className="border border-1 rounded mx-auto px-3"
              >
                <Box display="flex" alignItems="center">
                  <Banknote size={24} style={{ marginRight: 10 }} />
                  <Typography sx={{ textAlign: { xs: "center", sm: "left" }, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    Bank Account 3432xxxx23432
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  sx={{
                    width: { xs: "100%", sm: "auto" },
                    background: "linear-gradient(180deg, #6D295A 0%, #420C36 100%)",
                    alignSelf: { xs: "stretch", sm: "center" },
                    fontSize: { xs: "0.75rem", sm: "0.875rem" }
                  }}
                >
                  Update
                </Button>
              </Box>
            </Box>
            <Box className="p-4 h-100" sx={{
              background: "linear-gradient(180deg, #6D295A 0%, #420C36 100%)",
              color: "white",
              borderRadius: 2,
              padding: { xs: "1rem", sm: "1.5rem" }
            }}>
              <Typography variant="subtitle2" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>Elements earnings Oct 2023</Typography>
              <Typography variant="h6" sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>$680.86</Typography>
              <Typography variant="body2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>After tax</Typography>
            </Box>
            <Box className="p-4 h-100" sx={{
              background: "linear-gradient(180deg, #6D295A 0%, #420C36 100%)",
              color: "white",
              borderRadius: 2,
              padding: { xs: "1rem", sm: "1.5rem" }
            }}>
              <Typography variant="subtitle2" sx={{ fontSize: { xs: "0.875rem", sm: "1rem" } }}>TOTAL EARNINGS</Typography>
              <Typography variant="h5" sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem" } }}>$11,890.86</Typography>
            </Box>
          </Box>
          <Box mt={4} className="p-4" sx={{
            background: "linear-gradient(180deg, #6D295A 0%, #420C36 100%)",
            color: "white",
            borderRadius: 2,
            padding: { xs: "1rem", sm: "1.5rem" }
          }}>
            <Box display="flex"
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", sm: "center" }}
              gap={{ xs: 1, sm: 0 }}
            >
              <Typography variant="h6" sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }}>Total Earnings</Typography>
              <Select defaultValue={"2023"} size="small" sx={{
                backgroundColor: "white",
                borderRadius: 1,
                minWidth: { xs: "100%", sm: "auto" }
              }}>
                <MenuItem value="2023">2023</MenuItem>
                <MenuItem value="2022">2022</MenuItem>
              </Select>
            </Box>
            <Box mt={3} sx={{ height: { xs: 250, sm: 300 } }}>
              <Bar
                data={{
                  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
                  datasets: [
                    {
                      label: 'My First Dataset',
                      data: [65, 59, 80, 81, 56, 55, 40, 65, 59, 80, 81, 56],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(255, 205, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(54, 162, 235, 0.5)',
                        'rgba(153, 102, 255, 0.5)',
                        'rgba(201, 203, 207, 0.5)',
                        'rgba(255, 99, 132, 0.5)',
                        'rgba(255, 159, 64, 0.5)',
                        'rgba(255, 205, 86, 0.5)',
                        'rgba(75, 192, 192, 0.5)',
                        'rgba(54, 162, 235, 0.5)'
                      ],
                      borderColor: [
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)',
                        'rgb(153, 102, 255)',
                        'rgb(201, 203, 207)',
                        'rgb(255, 99, 132)',
                        'rgb(255, 159, 64)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(54, 162, 235)'
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  responsive: true,
                  plugins: {
                    legend: {
                      labels: {
                        color: "white",
                        font: {
                          size: isMobile ? 10 : 12
                        }
                      }
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: "white",
                        font: {
                          size: isMobile ? 10 : 12
                        }
                      },
                      grid: { color: "rgba(255, 255, 255, 0.1)" }
                    },
                    y: {
                      ticks: {
                        color: "white",
                        font: {
                          size: isMobile ? 10 : 12
                        }
                      },
                      grid: { color: "rgba(255, 255, 255, 0.1)" }
                    }
                  }
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default VendorDashboard;
