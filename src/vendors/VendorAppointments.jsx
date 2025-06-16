import React from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import {
  CalendarDays,
  CalendarCheck,
  CalendarPlus,
  Clock,
  ClipboardList,
  Edit,
} from "lucide-react";

const stats = [
  { label: "Today", count: 5, icon: <Clock color="#FFC107" />, color: "#29263d" },
  { label: "Weekly", count: 10, icon: <CalendarDays color="white" />, color: "#7C3AED", active: true },
  { label: "Upcoming", count: 15, icon: <CalendarCheck color="green" />, color: "#29263d" },
  { label: "Recent Added", count: 5, icon: <CalendarPlus color="red" />, color: "#29263d" },
  { label: "Pending", count: 15, icon: <ClipboardList color="purple" />, color: "#29263d" },
];

const appointments = [
  {
    date: "15 June, 2018",
    stylist: "John Jackson",
    service: "Hair Spa",
    client: "Mark Austin",
    number: "9898989898",
    voucher: "Atfdfg58",
    status: "Confirmed",
  },
  {
    date: "15 June, 2018",
    stylist: "Michel Angelo",
    service: "Hair Cutting",
    client: "Corey Anderson",
    number: "9898989898",
    voucher: "Atfdfg58",
    status: "Confirmed",
  },
  {
    date: "15 June, 2018",
    stylist: "John Jackson",
    service: "Mustache",
    client: "Mike Mathews",
    number: "9898989898",
    voucher: "Atfdfg58",
    status: "Confirmed",
  },
  {
    date: "15 June, 2018",
    stylist: "John Jackson",
    service: "Hair Spa",
    client: "Pablo Marelo",
    number: "9898989898",
    voucher: "Atfdfg58",
    status: "Confirmed",
  },
];

export default function VendorAppointments() {
  return (
    <Box sx={{ bgcolor: "#15132b", minHeight: "100vh", color: "white", p: 3 }}>
      {/* Stat Boxes */}
      <Grid container spacing={2} mb={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={2.4} key={index}>
            <Paper
              elevation={3}
              sx={{
                backgroundColor: stat.active ? "#7C3AED" : "#1f1b40",
                color: "white",
                p: 2,
                textAlign: "center",
                borderRadius: 2,
              }}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box>{stat.icon}</Box>
                <Typography variant="h4" mt={1}>
                  {stat.count}
                </Typography>
                <Typography variant="body2">{stat.label}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Filters */}
      <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: "white" }}>From Date</InputLabel>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel sx={{ color: "white" }}>To Date</InputLabel>
        </FormControl>
        <FormControl sx={{ minWidth: 120 }}>
          <Select defaultValue="all" sx={{ color: "white", borderColor: "white" }}>
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="stylist1">Stylist 1</MenuItem>
          </Select>
        </FormControl>
        <Button variant="contained" sx={{ bgcolor: "#7C3AED" }}>
          CONFIRMED
        </Button>
        <Button variant="outlined" sx={{ color: "white", borderColor: "white" }}>
          CANCELLED
        </Button>
        <Button variant="outlined" sx={{ color: "white", borderColor: "white" }}>
          PENDING
        </Button>
        <Button variant="outlined" sx={{ color: "white", borderColor: "white" }}>
          NO SHOWS
        </Button>
        <Button variant="outlined" sx={{ color: "white", borderColor: "white" }}>
          REPORTS
        </Button>
      </Box>

      {/* Table */}
      <Paper sx={{ backgroundColor: "#1f1b40", p: 2, borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ color: "white" }}>
              {["Date", "Hair Stylist", "Service", "Client Name", "Number", "Voucher", "Status", "Edit"].map(
                (header) => (
                  <TableCell key={header} sx={{ color: "white" }}>
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appt, index) => (
              <TableRow key={index}>
                <TableCell sx={{ color: "white" }}>{appt.date}</TableCell>
                <TableCell sx={{ color: "white" }}>{appt.stylist}</TableCell>
                <TableCell sx={{ color: "white" }}>{appt.service}</TableCell>
                <TableCell sx={{ color: "white" }}>{appt.client}</TableCell>
                <TableCell sx={{ color: "white" }}>{appt.number}</TableCell>
                <TableCell sx={{ color: "white" }}>{appt.voucher}</TableCell>
                <TableCell sx={{ color: "#7C3AED", fontWeight: "bold" }}>{appt.status}</TableCell>
                <TableCell>
                  <Edit color="#FFD700" style={{ cursor: "pointer" }} size={18} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
