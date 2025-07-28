import React, { useEffect, useState } from 'react';
import { Box, Grid, Typography, IconButton, Tooltip, useTheme } from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
// import useStylistAvailability from '../hooks/useStylistAvailability';
import Cookies from "js-cookie";
import axios from 'axios';
import { API_BASE_URL } from '../utils/apiConfig';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const CustomCalendar = ({ initialYear, initialMonth }) => {
  const [apiData, setApiData] = useState([]);

  const authToken = Cookies.get("token");
  const theme = useTheme();

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(initialYear || today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(initialMonth || today.getMonth());

  // const { data: availabilityList = [] } = useStylistAvailability();

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

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const isAvailableDay = (day) => {
    if (!day) return false;
    const dateKey = formatDateKey(new Date(currentYear, currentMonth, day));
    return apiData.some(item => item.isActive && item.date === dateKey);
  };


  const availableDayColor = theme.palette.mode === 'dark' ? '#2e7d32' : '#c3f7c3';

  const formatDateKey = (dateObj) =>
    `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`;

  const getSlotsForDay = (day) => {
    if (!day) return [];
    const dateKey = formatDateKey(new Date(currentYear, currentMonth, day));
    const entry = apiData.find(item => item.date === dateKey && item.isActive);
    return entry?.slots || [];
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 0) {
        setCurrentYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setCurrentMonth((prev) => {
      if (prev === 11) {
        setCurrentYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  // Generate calendar weeks
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

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const date = new Date();
    date.setHours(Number(hour), Number(minute));
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <IconButton onClick={handlePrevMonth}>
          <ArrowBackIos fontSize="small" />
        </IconButton>
        <Typography variant="h6" fontWeight="bold">
          {new Date(currentYear, currentMonth).toLocaleString("default", { month: "short" })} {currentYear}
        </Typography>
        <IconButton onClick={handleNextMonth}>
          <ArrowForwardIos fontSize="small" />
        </IconButton>
      </Box>

      {/* Weekdays */}
      <Grid container spacing={1}>
        {daysOfWeek.map((day) => (
          <Grid item xs={1.7} key={day}>
            <Typography align="center" fontWeight="bold" color="textSecondary">
              {day}
            </Typography>
          </Grid>
        ))}
      </Grid>

      {/* Calendar weeks */}
      {weeks?.map((week, wi) => (
        <Grid container spacing={1} key={wi} mt={1}>
          {week.map((day, di) => (
            <Grid item xs={1.7} key={di}>
              <Tooltip
                arrow
                title={
                  day && getSlotsForDay(day).length > 0 ? (
                    <Box px={1} py={0.5}>
                      <Typography
                        variant="subtitle2"
                        fontWeight="bold"
                        gutterBottom
                        sx={{ fontSize: '0.85rem' }}
                      >
                        {new Date(currentYear, currentMonth, day).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </Typography>
                      {getSlotsForDay(day).map((slot, idx) => (
                        <Typography
                          key={idx}
                          variant="body2"
                          sx={{ fontSize: '0.8rem', color: 'text.primary' }}
                        >
                          {formatTime(slot.from)} - {formatTime(slot.till)}
                        </Typography>
                      ))}
                    </Box>
                  ) : ''
                }
              >
                <Box
                  width={36}
                  height={36}
                  mx="auto"
                  borderRadius="50%"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  sx={{
                    backgroundColor: day && isAvailableDay(day) ? availableDayColor : "transparent",
                    color: theme.palette.text.primary,
                  }}
                >
                  <Typography variant="body2" fontWeight="medium">
                    {day || ""}
                  </Typography>
                </Box>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      ))}
    </Box>
  );
};

export default CustomCalendar;
