import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, Card, CardContent, Grid, Avatar, Chip, Tooltip } from "@mui/material";
import { tokens } from "../../theme";
import Cookies from "js-cookie";
import axios from 'axios';
import { API_BASE_URL } from '../../utils/apiConfig';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import NotesIcon from '@mui/icons-material/Notes';
import { Header } from '../../components';
import { Checkbox, FormGroup, FormControlLabel, CircularProgress } from '@mui/material';
import Alert from '../../custom/Alert';

const statusOptions = [
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'pending', label: 'Pending' },
  { value: 'cancelled', label: 'Cancelled' },
];

function stringAvatar(name) {
  if (!name) return {};
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  return {
    children: initials,
  };
}

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [loadingStatusId, setLoadingStatusId] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const authToken = Cookies.get("token");

  useEffect(() => {
    if (authToken) {
      fetchAppointments();
    }
  }, [authToken]);

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/stylist/appointments`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      });
      console.log('Appointments response', response);
      if (response?.data?.success) {
        setAppointments(response.data.data);
      } else {
        console.error('Failed to fetch appointments', response?.data?.message);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckboxClick = (appointmentId, status) => {
    setSelectedAppointmentId(appointmentId);
    setSelectedStatus(status);
    setAlertOpen(true);
  };

  const handleAlertClose = () => {
    setAlertOpen(false);
    setSelectedAppointmentId(null);
    setSelectedStatus(null);
  };

  const handleAlertConfirm = async () => {
    setLoadingStatusId(selectedAppointmentId);
    try {
      await axios.patch(
        `${API_BASE_URL}/stylist/appointments/${selectedAppointmentId}/status`,
        { status: selectedStatus },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setAlertOpen(false);
      setSelectedAppointmentId(null);
      setSelectedStatus(null);
      fetchAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoadingStatusId(null);
    }
  };

  return (
    <Box m="20px">
      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Header title="Appointment History" />
          <Box>
            {appointments?.length > 0 ? (
              <Grid container spacing={3}>
                {appointments?.map((appointment, index) => (
                  <Grid item xs={12} md={6} lg={4} key={appointment._id || index}>
                    <Box
                      sx={{
                        borderRadius: 4,
                        boxShadow: '0 4px 24px rgba(31, 38, 135, 0.10)',
                        overflow: 'hidden',
                        background:
                          appointment.status === 'expired'
                            ? '#808080'
                            : theme.palette.mode === 'dark'
                              ? colors.primary[900]
                              : '#fff',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-6px) scale(1.04)',
                          boxShadow: '0 12px 32px 0 rgba(31, 38, 135, 0.18)',
                        },
                        display: 'flex',
                        flexDirection: 'column',
                        minHeight: 260,
                        position: 'relative',
                        color:
                          appointment.status === 'expired'
                            ? (theme.palette.mode === 'dark' ? '#fff' : '#000')
                            : undefined,
                      }}
                    >
                      <CardContent sx={{ pb: 7 }}>
                        <Box display="flex" alignItems="center" mb={2}>
                          <Avatar {...stringAvatar(appointment.user?.fullName)} sx={{ bgcolor: '#6D295A', color: '#fff', mr: 2, width: 48, height: 48, fontSize: 22, fontFamily: 'Poppins, sans-serif' }} />
                          <Box>
                            <Typography variant="h6" color={
                              appointment.status === 'expired'
                                ? (theme.palette.mode === 'dark' ? '#fff' : '#000')
                                : (theme.palette.mode === 'dark' ? colors.gray[100] : '#222')
                            } fontWeight="bold" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                              {appointment.user?.fullName || 'Unknown User'}
                            </Typography>
                            <Box display="flex" alignItems="center" color={colors.gray[300]}>
                              <EmailIcon sx={{ fontSize: 16, mr: 0.5, color: '#6D295A' }} />
                              <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif' }}>{appointment.user?.email}</Typography>
                            </Box>
                          </Box>
                        </Box>
                        <Box mb={1} display="flex" alignItems="center">
                          <PersonIcon sx={{ fontSize: 18, mr: 1, color: colors.greenAccent[400] }} />
                          <Typography variant="body1" color={theme.palette.mode === 'dark' ? colors.gray[200] : '#6D295A'} fontWeight="bold" sx={{ fontFamily: 'Poppins, sans-serif' }}>
                            {appointment.service?.name}
                          </Typography>
                        </Box>
                        <Box mb={1} display="flex" alignItems="center">
                          <EventIcon sx={{ fontSize: 18, mr: 1, color: colors.blueAccent[300] }} />
                          <Typography variant="body2" color={
                            appointment.status === 'expired'
                              ? (theme.palette.mode === 'dark' ? '#fff' : '#000')
                              : colors.gray[200]
                          } mr={2} sx={{ fontFamily: 'Poppins, sans-serif' }}>
                            {new Date(appointment.date).toLocaleDateString()}
                          </Typography>
                          <AccessTimeIcon sx={{ fontSize: 18, mr: 1, color: colors.greenAccent[400] }} />
                          <Typography variant="body2" color={
                            appointment.status === 'expired'
                              ? (theme.palette.mode === 'dark' ? '#fff' : '#000')
                              : colors.gray[200]
                          } sx={{ fontFamily: 'Poppins, sans-serif' }}>
                            {appointment.slot?.from} - {appointment.slot?.till}
                          </Typography>
                        </Box>
                        {appointment.notes && (
                          <Box mt={1} display="flex" alignItems="center">
                            <NotesIcon sx={{ fontSize: 16, mr: 1, color: colors.redAccent[400] }} />
                            <Typography variant="body2" color={
                              appointment.status === 'expired'
                                ? (theme.palette.mode === 'dark' ? '#fff' : '#000')
                                : colors.gray[300]
                            } sx={{ fontFamily: 'Poppins, sans-serif' }}>
                              {appointment.notes}
                            </Typography>
                          </Box>
                        )}
                        <Box mb={2} mt={2}>
                          {appointment.status !== 'expired' && (
                            <FormGroup row>
                              {statusOptions.map(option => (
                                <FormControlLabel
                                  key={option.value}
                                  control={
                                    <Checkbox
                                      checked={appointment.status === option.value}
                                      onChange={() => handleCheckboxClick(appointment._id, option.value)}
                                      disabled={loadingStatusId === appointment._id}
                                      color="primary"
                                    />
                                  }
                                  label={option.label}
                                />
                              ))}
                              {loadingStatusId === appointment._id && (
                                <CircularProgress size={24} sx={{ ml: 2 }} />
                              )}
                            </FormGroup>
                          )}
                        </Box>
                      </CardContent>
                      <Box sx={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        px: 2,
                        py: 1.5,
                        zIndex: 2,
                        background: 'linear-gradient(90deg, #6D295A 0%, #420C36 100%)',
                        color: '#fff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottomLeftRadius: 16,
                        borderBottomRightRadius: 16,
                      }}>
                        <Chip
                          label={appointment.status}
                          size="small"
                          sx={{
                            textTransform: 'capitalize',
                            fontWeight: 'bold',
                            fontFamily: 'Poppins, sans-serif',
                            color: '#fff',
                            backgroundColor:
                              appointment.status === 'expired' ? '#E53935' :
                                appointment.status === 'confirmed' ? '#43a047' : // success green
                                  appointment.status === 'pending' ? '#FFA726' :
                                    appointment.status === 'cancelled' ? '#E53935' :
                                      '#888',
                            boxShadow:
                              appointment.status === 'expired' ? '0 0 8px #E5393544' :
                                appointment.status === 'confirmed' ? '0 0 8px #43a04744' :
                                  appointment.status === 'pending' ? '0 0 8px #FFA72644' :
                                    appointment.status === 'cancelled' ? '0 0 8px #E5393544' :
                                      '0 0 8px #8884',
                          }}
                        />
                        <Tooltip title="Created At">
                          <Typography variant="caption" sx={{ color: '#fff', fontFamily: 'Poppins, sans-serif' }}>
                            {new Date(appointment.createdAt).toLocaleString()}
                          </Typography>
                        </Tooltip>
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" minHeight="200px">
                <Typography variant="h5" color={colors.gray[300]} mb={2} sx={{ fontFamily: 'Poppins, sans-serif' }}>
                  No appointments found.
                </Typography>
                <Typography variant="body2" color={colors.gray[400]} sx={{ fontFamily: 'Poppins, sans-serif' }}>
                  You have no appointment history yet. Book a service to see it here!
                </Typography>
              </Box>
            )}
          </Box>
          <Alert
            open={alertOpen}
            title="Change Status"
            description={`Are you sure you want to change the status to '${selectedStatus}'?`}
            onClose={handleAlertClose}
            onConfirm={handleAlertConfirm}
            loading={!!loadingStatusId}
            disableCancel={!!loadingStatusId}
          />
        </>
      )}
    </Box>
  );
};

export default Appointment;
