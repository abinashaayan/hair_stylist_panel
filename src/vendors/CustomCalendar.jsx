import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';
import axios from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL } from '../utils/apiConfig';
import { Box, Typography } from '@mui/material';

const CustomCalendar = () => {
  const [events, setEvents] = useState([]);
  const authToken = Cookies.get("token");

  const fetchAvailability = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/stylist/get-availability`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true,
      });

      if (res.data?.success) {
        const availabilityEvents = transformToCalendarEvents(res.data.data || []);
        fetchAppointments(availabilityEvents); // merge after appointments fetched
      }
    } catch (err) {
      console.error('Failed to fetch availability data');
    }
  };

  const fetchAppointments = async (availabilityEvents = []) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/stylist/appointments`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });

      if (response?.data?.success) {
        const appointmentEvents = transformAppointmentsToEvents(response.data.data || []);
        setEvents([...availabilityEvents, ...appointmentEvents]);
      } else {
        console.error('Failed to fetch appointments', response?.data?.message);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const transformToCalendarEvents = (availabilityData) => {
    return availabilityData
      .filter(item => item.isActive)
      .map(item => {
        const date = item.date;
        const slots = item.slots || [];

        return {
          title: `${slots.length} Slot${slots.length > 1 ? 's' : ''}`,
          start: date,
          allDay: true,
          backgroundColor: '#4CAF50',
          borderColor: '#4CAF50',
          textColor: '#fff',
          tooltip: slots.map(slot => `${formatTime(slot.from)} - ${formatTime(slot.till)}`).join('<br/>'),
        };
      });
  };

  const transformAppointmentsToEvents = (appointments) => {
    const now = new Date();

    return appointments.map(item => {
      const start = new Date(`${item.date}T${item.slot.from}`);
      const end = new Date(`${item.date}T${item.slot.till}`);

      const isPast = end < now;

      return {
        title: `${item.user?.fullName || "Client"} - ${item.service?.name || "Service"}`,
        start,
        end,
        backgroundColor: isPast ? '#b0b0b0' : '#1976d2',
        borderColor: isPast ? '#b0b0b0' : '#1976d2',
        textColor: '#fff',
        tooltip: `
          <strong>${item.user?.fullName}</strong><br/>
          ${item.service?.name}<br/>
          ${formatTime(item.slot.from)} - ${formatTime(item.slot.till)}<br/>
          Status: ${item.status}
        `,
      };
    });
  };

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

  useEffect(() => {
    fetchAvailability();
  }, [authToken]);

  return (
    <div>
      {/* Legend */}
      <Box display="flex" alignItems="center" gap={3} mb={2}>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 16, height: 16, bgcolor: '#4CAF50', borderRadius: '50%' }} />
          <Typography variant="body2">Stylist Availability</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 16, height: 16, bgcolor: '#1976d2', borderRadius: '50%' }} />
          <Typography variant="body2">Upcoming Appointments</Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Box sx={{ width: 16, height: 16, bgcolor: '#b0b0b0', borderRadius: '50%' }} />
          <Typography variant="body2">Expired Appointments</Typography>
        </Box>
      </Box>

      {/* Calendar */}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        initialView="dayGridMonth"
        height="auto"
        events={events}
        eventDidMount={(info) => {
          if (info.event.extendedProps.tooltip) {
            const tooltip = document.createElement('div');
            tooltip.innerHTML = info.event.extendedProps.tooltip;
            tooltip.style.position = 'absolute';
            tooltip.style.background = '#fff';
            tooltip.style.border = '1px solid #ccc';
            tooltip.style.padding = '8px';
            tooltip.style.borderRadius = '6px';
            tooltip.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
            tooltip.style.zIndex = 1000;
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.display = 'none';
            tooltip.className = 'custom-calendar-tooltip';

            info.el.addEventListener('mouseenter', (e) => {
              document.body.appendChild(tooltip);
              tooltip.style.top = e.pageY + 10 + 'px';
              tooltip.style.left = e.pageX + 10 + 'px';
              tooltip.style.display = 'block';
            });
            info.el.addEventListener('mousemove', (e) => {
              tooltip.style.top = e.pageY + 10 + 'px';
              tooltip.style.left = e.pageX + 10 + 'px';
            });
            info.el.addEventListener('mouseleave', () => {
              tooltip.remove();
            });
          }
        }}
      />
    </div>
  );
};


export default CustomCalendar;
