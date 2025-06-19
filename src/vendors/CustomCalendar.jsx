import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  useTheme,
} from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const CustomCalendar = ({ year, month, appointments }) => {
  const theme = useTheme();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const colors = theme.palette.mode === "dark" ? theme.palette.grey[700] : theme.palette.grey[100];

  const weeks = [];
  let currentDay = 1 - firstDay;

  for (let week = 0; week < 6; week++) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      if (currentDay > 0 && currentDay <= daysInMonth) {
        days.push(currentDay);
      } else {
        days.push(null);
      }
      currentDay++;
    }
    weeks.push(days);
  }

  const isAppointmentDay = (day) =>
    appointments.includes(day);

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <IconButton>
          <ArrowBackIos fontSize="small" />
        </IconButton>
        <Typography variant="h6" fontWeight="bold">
          {new Date(year, month).toLocaleString("default", { month: "short" })} {year}
        </Typography>
        <IconButton>
          <ArrowForwardIos fontSize="small" />
        </IconButton>
      </Box>

      <Grid container spacing={1}>
        {daysOfWeek.map((day) => (
          <Grid item xs={1.7} key={day}>
            <Typography align="center" fontWeight="bold" color="textSecondary">
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {weeks.map((week, wi) => (
        <Grid container spacing={1} key={wi} mt={1}>
          {week.map((day, di) => (
            <Grid item xs={1.7} key={di}>
              <Box
                width={36}
                height={36}
                mx="auto"
                borderRadius="50%"
                display="flex"
                alignItems="center"
                justifyContent="center"
                sx={{
                  backgroundColor: day && isAppointmentDay(day) ? "#ffb6c1" : "transparent",
                  color: theme.palette.text.primary,
                }}
              >
                <Typography variant="body2" fontWeight="medium">
                  {day ? day : ""}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      ))}
    </Box>
  );
};

export default CustomCalendar;
