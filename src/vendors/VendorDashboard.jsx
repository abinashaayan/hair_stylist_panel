import React, { useState } from "react";
import { Box, Typography, useTheme, IconButton, Button, useMediaQuery, Select, MenuItem } from "@mui/material";
import {
  CalendarMonth,
  PeopleAlt,
  Star,
  AttachMoney,
  CheckCircleOutline,
  EventNoteOutlined,
  PlaylistAddCheckOutlined,
  HourglassEmptyOutlined,
  CloseOutlined,
  CalendarTodayOutlined,
  DateRangeOutlined,
  FilterListOutlined,
  ListAltOutlined,
  EditOutlined,
  SpaOutlined,
  HistoryOutlined,
  RedeemOutlined,
  FactCheckOutlined,
  AddOutlined,
  StarOutline,
} from "@mui/icons-material";
import StatBox from "../components/StatBox";
import FlexBetween from "../components/FlexBetween";
import Header from "../components/Header";
import CustomTable from "../custom/Table";
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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const mockAppointmentData = [
  {
    id: 1,
    date: "15 June,2018",
    hairStylist: "John Jackson",
    service: "Hair Spa",
    clientName: "Mark Austin",
    number: "9898989898",
    voucher: "Aftdfg58",
    status: "Confirmed",
  },
  {
    id: 2,
    date: "15 June,2018",
    hairStylist: "Michel Angelo",
    service: "Hair Cutting",
    clientName: "Corey Anderson",
    number: "9898989898",
    voucher: "Aftdfg58",
    status: "Confirmed",
  },
  {
    id: 3,
    date: "15 June,2018",
    hairStylist: "John Jackson",
    service: "Mustache",
    clientName: "Mike Mathews",
    number: "9898989898",
    voucher: "Aftdfg58",
    status: "Confirmed",
  },
  {
    id: 4,
    date: "15 June,2018",
    hairStylist: "John Jackson",
    service: "Hair Spa",
    clientName: "Pablo Marelo",
    number: "9898989898",
    voucher: "Aftdfg58",
    status: "Confirmed",
  },
];

const VendorDashboard = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 1000px)");
  const colors = theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[100];

  const appointments = [23, 24, 25, 26, 29, 30]; // dynamic appointment days
  const year = 2025;
  const month = 1;

  const statData = [
    { title: "Calendar", value: "31", icon: <CalendarMonth /> },
    { title: "Appointment requests", icon: <EventNoteOutlined /> },
    { title: "Upcoming Appointments", icon: <SpaOutlined /> },
    { title: "History", icon: <HistoryOutlined /> },
    { title: "Packages", icon: <RedeemOutlined /> },
    { title: "Availability Management", icon: <FactCheckOutlined /> },
    { title: "Create Appointment", icon: <AddOutlined /> },
    { title: "Lorem Services", icon: <StarOutline /> },
  ];

  const columns = [
    { field: "date", headerName: "Date", flex: 1 },
    { field: "hairStylist", headerName: "Hair Stylist", flex: 1 },
    { field: "service", headerName: "Service", flex: 1 },
    { field: "clientName", headerName: "Client Name", flex: 1 },
    { field: "number", headerName: "Number", flex: 1 },
    { field: "voucher", headerName: "Voucher", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Typography color={theme.palette.secondary[300]}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: "edit",
      headerName: "Edit",
      flex: 0.5,
      sortable: false,
      renderCell: () => (
        <IconButton>
          <EditOutlined sx={{ fontSize: "20px", color: theme.palette.grey[100] }} />
        </IconButton>
      ),
    },
  ];

  return (
    <Box m="1.5rem 2.5rem">
      <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      <Box
        mt="20px"
        display="grid"
        gridTemplateColumns="repeat(8, 1fr)"
        gridAutoRows="140px"
        gap="20px"
      >
        {statData.map((stat, index) => (
          <Box
            key={index}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p="1rem"
            borderRadius="0.55rem"
            sx={{
              boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
              cursor: "pointer",
              transition: "transform 0.2s",
              "&:hover": { transform: "scale(1.05)" },
              background: "linear-gradient(180deg, #6D295A 0%, #420C36 100%)",
              color: "#FFFFFF",
            }}
          >
            {stat.icon &&
              React.cloneElement(stat.icon, {
                sx: { fontSize: "48px", color: "#FFFFFF", mb: 1 },
              })}
            {stat.value && (
              <Typography variant="h4" sx={{ color: "#FFFFFF", fontWeight: "bold", mb: 0.5 }}>
                {stat.value}
              </Typography>
            )}
            <Typography variant="h6" sx={{ color: "#FFFFFF", textAlign: "center" }}>
              {stat.title}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box mt={2}>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: "15px", textTransform: "uppercase" }}>
          Top Performing Services
        </Typography>
        <Box display="flex" flexWrap="wrap" gap={4}>
          {[{ color: "red" }, { color: "gold" }, { color: "blue" }, { color: "green" }].map((item, idx) => (
            <Box key={idx} textAlign="center">
              <Box sx={{ width: 80, height: 80, borderRadius: "50%", border: `4px solid ${item.color}`, padding: "5px", backgroundColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", margin: "auto", }}>
                <Box sx={{ width: "100%", height: "100%", borderRadius: "50%", backgroundColor: "black", }} />
              </Box>
              <Typography mt={1}>Lorem</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Filter Section */}
      {/* <Box mt="20px" display="flex" flexDirection={isNonMobile ? "row" : "column"} gap="10px" alignItems="center">
        <Button
          variant="outlined"
          startIcon={<CalendarTodayOutlined />}
          sx={{ textTransform: "none", color: theme.palette.grey[100], borderColor: theme.palette.grey[400] }}
        >
          From Date
        </Button>
        <Button
          variant="outlined"
          startIcon={<DateRangeOutlined />}
          sx={{ textTransform: "none", color: theme.palette.grey[100], borderColor: theme.palette.grey[400] }}
        >
          To Date
        </Button>
        <Button
          variant="outlined"
          startIcon={<FilterListOutlined />}
          sx={{ textTransform: "none", color: theme.palette.grey[100], borderColor: theme.palette.grey[400] }}
        >
          All
        </Button>
        <FlexBetween gap="10px" flexWrap="wrap">
          {["CONFIRMED", "CANCELLED", "PENDING", "NO SHOWS"].map((status) => (
            <Button
              key={status}
              variant={status === "CONFIRMED" ? "contained" : "outlined"}
              sx={{ textTransform: "none", minWidth: "120px", ...(status === "CONFIRMED" && { backgroundColor: theme.palette.secondary[300] }) }}
            >
              {status}
            </Button>
          ))}
          <Button
            variant="outlined"
            startIcon={<ListAltOutlined />}
            sx={{ textTransform: "none", color: theme.palette.grey[100], borderColor: theme.palette.grey[400] }}
          >
            REPORTS
          </Button>
        </FlexBetween>
      </Box> */}

      {/* Appointments Table */}
      <div class="row gx-4 mt-3">
        <div class="col-12 col-md-4">
          <Box mt="20px">
            <Typography variant="h4" fontWeight="bold" sx={{ mb: "15px", textTransform: "uppercase", }}>
              Upcoming Appointments
            </Typography>
            <CustomCalendar year={year} month={month} appointments={appointments} />
          </Box>
        </div>
        <div class="col-12 col-md-8">
          <Box sx={{ minHeight: "100vh" }}>
            <div className="row g-4">
              <div className="col-md-4">
                <Box className="p-4" sx={{ background: "linear-gradient(180deg, #6D295A 0%, #420C36 100%)", borderRadius: 2, color: "white" }}>
                  <Typography variant="subtitle2">Total Earnings</Typography>
                  <Typography variant="h4">$2,674.68</Typography>
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
                      <Typography sx={{ textAlign: { xs: "center", sm: "left" } }}>
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
                      }}
                    >
                      Update
                    </Button>
                  </Box>
                </Box>
              </div>
              <div className="col-md-4">
                <Box className="p-4 h-100" sx={{ background: "linear-gradient(180deg, #6D295A 0%, #420C36 100%)", color: "white", borderRadius: 2 }}>
                  <Typography variant="subtitle2">Elements earnings Oct 2023</Typography>
                  <Typography variant="h6">$680.86</Typography>
                  <Typography variant="body2">After tax</Typography>
                </Box>
              </div>
              <div className="col-md-4">
                <Box className="p-4 h-100" sx={{ background: "linear-gradient(180deg, #6D295A 0%, #420C36 100%)", color: "white", borderRadius: 2 }}>
                  <Typography variant="subtitle2">TOTAL EARNINGS</Typography>
                  <Typography variant="h5">$11,890.86</Typography>
                </Box>
              </div>
            </div>
            <Box mt={4} className="p-4" sx={{ background: "linear-gradient(180deg, #6D295A 0%, #420C36 100%)", color: "white", borderRadius: 2, }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">Total Earnings</Typography>
                <Select defaultValue={"2023"} size="small" sx={{ backgroundColor: "white", borderRadius: 1 }}>
                  <MenuItem value="2023">2023</MenuItem>
                  <MenuItem value="2022">2022</MenuItem>
                </Select>
              </Box>
              <Box mt={3} sx={{ height: 300 }}>
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
                    plugins: { legend: { labels: { color: "white" } }, },
                    scales: { x: { ticks: { color: "white" }, grid: { color: "rgba(255, 255, 255, 0.1)" } }, y: { ticks: { color: "white" }, grid: { color: "rgba(255, 255, 255, 0.1)" } } }
                  }}
                />
              </Box>
            </Box>
          </Box>
        </div>
      </div>
    </Box>
  );
};

export default VendorDashboard;
