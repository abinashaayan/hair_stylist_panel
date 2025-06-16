import React, { useState } from "react";
import { Box, Typography, useTheme, IconButton, Button, useMediaQuery } from "@mui/material";
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
  EditOutlined
} from "@mui/icons-material";
import StatBox from "../components/StatBox";
import FlexBetween from "../components/FlexBetween";
import Header from "../components/Header";
import CustomTable from "../custom/Table";

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

  const statData = [
    { title: "Today", value: "5", icon: <CheckCircleOutline sx={{ fontSize: "26px", color: theme.palette.secondary[300] }} />, color: "#868dfb" },
    { title: "Weekly", value: "10", icon: <EventNoteOutlined sx={{ fontSize: "26px", color: theme.palette.secondary[300] }} />, color: "#868dfb" },
    { title: "Upcoming", value: "15", icon: <PlaylistAddCheckOutlined sx={{ fontSize: "26px", color: theme.palette.secondary[300] }} />, color: theme.palette.secondary[300] },
    { title: "Recent Added", value: "5", icon: <CalendarMonth sx={{ fontSize: "26px", color: theme.palette.secondary[300] }} />, color: theme.palette.secondary[300] },
    { title: "Pending", value: "15", icon: <HourglassEmptyOutlined sx={{ fontSize: "26px", color: theme.palette.secondary[300] }} />, color: theme.palette.secondary[300] },
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
        gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
        gridAutoRows="140px"
        gap="20px"
      >
        {statData.map((stat, index) => (
          <Box
            key={index}
            bgcolor={theme.palette.background.alt}
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p="1rem"
            borderRadius="0.55rem"
            sx={{ boxShadow: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;", cursor: "pointer", transition: "transform 0.2s", "&:hover": { transform: "scale(1.05)" } }}
          >
            <Box display="flex" justifyContent="space-between" width="100%">
              <Typography variant="h6" sx={{ color: stat.color, fontWeight: "bold" }}>
                {stat.value}
              </Typography>
              {stat.icon}
            </Box>
            <Typography variant="h6" sx={{ color: theme.palette.grey[100] }}>
              {stat.title}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Filter Section */}
      <Box mt="20px" display="flex" flexDirection={isNonMobile ? "row" : "column"} gap="10px" alignItems="center">
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
      </Box>

      {/* Appointments Table */}
      <Box mt="20px">
        <Typography variant="h5" fontWeight="bold" sx={{ mb: "15px" }}>
          Appointments List
        </Typography>
        <CustomTable rows={mockAppointmentData} columns={columns} />
      </Box>
    </Box>
  );
};

export default VendorDashboard;
