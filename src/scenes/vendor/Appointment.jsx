import React, { useEffect, useState } from 'react';
import { Box, Typography, useTheme, Avatar, Chip, Tooltip, FormControl, Select, InputLabel, MenuItem, IconButton, Divider } from "@mui/material";
import { tokens } from "../../theme";
import Cookies from "js-cookie";
import axios from 'axios';
import { API_BASE_URL } from '../../utils/apiConfig';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import EventIcon from '@mui/icons-material/Event';
import { Header } from '../../components';
import { FormGroup, CircularProgress } from '@mui/material';
import Alert from '../../custom/Alert';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import { styled } from '@mui/material/styles';
import { Cancel, Notes, Pending, Schedule } from '@mui/icons-material';
import { CheckCircleIcon, HomeIcon, PhoneIcon } from 'lucide-react';

const statusOptions = [
  { value: 'completed', label: 'Completed', icon: <CheckCircleIcon />, color: '#4CAF50' },
  { value: 'confirmed', label: 'Confirmed', icon: <CheckCircleIcon />, color: '#2196F3' },
  { value: 'pending', label: 'Pending', icon: <Pending />, color: '#FF9800' },
  { value: 'cancelled', label: 'Cancelled', icon: <Cancel />, color: '#F44336' },
];

const statusColors = {
  completed: '#4caf50',
  confirmed: '#2196f3',
  pending: '#ff9800',
  cancelled: '#f44336',
  expired: '#9e9e9e'
};

function stringAvatar(name) {
  if (!name) return {};
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  return {
    children: initials,
  };
}

// Custom styled components
const StyledAccordion = styled(Box)(({ theme }) => ({
  borderRadius: '12px',
  marginBottom: '16px',
  overflow: 'hidden',
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease',
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-2px)'
  },
}));

const AccordionHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '16px 20px',
  cursor: 'pointer',
  backgroundColor: theme.palette.mode === 'dark' ?
    theme.palette.grey[800] : theme.palette.grey[100],
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ?
      theme.palette.grey[700] : theme.palette.grey[200],
  },
}));

const AccordionContent = styled(Box)(({ theme }) => ({
  padding: '16px',
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const DetailRow = ({ icon, label, value }) => (
  <Box display="flex" alignItems="flex-start" mb={2}>
    <Box mr={2} mt={0.5} color="text.secondary">
      {icon}
    </Box>
    <Box flex={1}>
      <Typography variant="caption" color="textSecondary" display="block">
        {label}
      </Typography>
      <Typography variant="body1">{value}</Typography>
    </Box>
  </Box>
);

const StatusBadge = ({ status }) => (
  <Chip
    label={status}
    size="small"
    sx={{
      textTransform: 'capitalize',
      fontWeight: '600',
      color: '#fff',
      backgroundColor: statusColors[status] || '#9e9e9e',
      px: 1,
      borderRadius: '8px'
    }}
  />
);


const AppointmentAccordion = ({ appointment, onStatusChange, loadingStatusId }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();

  const handleCheckboxClick = (status) => {
    onStatusChange(appointment._id, status);
  };

  const currentStatus = statusOptions.find(opt => opt.value === appointment.status);

  return (
    <StyledAccordion>
      <AccordionHeader onClick={() => setExpanded(!expanded)}>
        <Box display="flex" alignItems="center" width="100%">
          <Avatar
            {...stringAvatar(appointment?.user?.fullName)}
            sx={{
              bgcolor: theme.palette.primary.main,
              color: '#fff',
              mr: 2,
              width: 40,
              height: 40,
              fontSize: '1rem',
              fontWeight: 500
            }}
          />

          <Box flexGrow={1}>
            <Box display="flex" alignItems="center" mb={0.5}>
              <Typography variant="subtitle1" fontWeight="600" mr={2}>
                {appointment?.user?.fullName || 'Unknown User'}
              </Typography>
              <Typography variant="subtitle1" fontWeight="600" mr={2}>
                {appointment?.user?.phoneNumber || 'Unknown User'}
              </Typography>
              <Chip
                label={currentStatus?.label}
                size="small"
                icon={currentStatus?.icon}
                sx={{
                  backgroundColor: currentStatus?.color,
                  color: '#fff',
                  fontWeight: 600,
                }}
              />
            </Box>

            <Box display="flex" alignItems="center">
              <Box display="flex" alignItems="center" mr={3}>
                <EventIcon sx={{ fontSize: 16, mr: 1, color: theme.palette.text.secondary }} />
                <Typography variant="body2">
                  {new Date(appointment?.date).toLocaleDateString()}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center">
                <Schedule sx={{ fontSize: 16, mr: 1, color: theme.palette.text.secondary }} />
                <Typography variant="body2">
                  {appointment?.slot?.from} - {appointment?.slot?.till}
                </Typography>
              </Box>
            </Box>
          </Box>

          <IconButton size="small" onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}>
            {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
      </AccordionHeader>

      {expanded && (
        <AccordionContent>
          <Box mb={3}>
            <Typography variant="subtitle2" color="textSecondary" fontWeight="600" gutterBottom>
              SERVICE DETAILS
            </Typography>
            <DetailRow icon={<PersonIcon fontSize="small" />} label="Service" value={appointment?.service?.name} />
          </Box>

          <Divider sx={{ my: 2 }} />
          <Box mb={3}>
            <Typography variant="subtitle2" color="textSecondary" fontWeight="600" gutterBottom>
              CLIENT INFORMATION
            </Typography>
            <DetailRow
              icon={<EmailIcon fontSize="small" />}
              label="Email"
              value={appointment?.user?.email}
            />

            {appointment?.bookingUserDetails?.phone && (
              <DetailRow
                icon={<PhoneIcon fontSize="small" />}
                label="Phone"
                value={appointment?.bookingUserDetails?.phone}
              />
            )}

            {appointment?.bookingUserDetails?.address && (
              <DetailRow
                icon={<HomeIcon fontSize="small" />}
                label="Address"
                value={appointment?.bookingUserDetails?.address}
              />
            )}
          </Box>

          {appointment?.notes && (
            <>
              <Divider sx={{ my: 2 }} />
              <Box>
                <Typography variant="subtitle2" color="textSecondary" fontWeight="600" gutterBottom>
                  ADDITIONAL NOTES
                </Typography>
                <DetailRow
                  icon={<Notes fontSize="small" />}
                  label="Notes"
                  value={appointment?.notes}
                />
              </Box>
            </>
          )}

          {appointment?.status !== 'expired' && (
            <>
              <Divider sx={{ my: 3 }} />
              <Box>
                <Typography variant="subtitle2" color="textSecondary" fontWeight="600" gutterBottom>
                  UPDATE STATUS
                </Typography>
                <FormGroup row sx={{ gap: 2 }}>
                  {statusOptions?.map(option => (
                    <Chip
                      key={option.value}
                      label={option.label}
                      icon={option.icon}
                      onClick={() => handleCheckboxClick(option.value)}
                      sx={{
                        backgroundColor: appointment.status === option.value ? option.color : 'transparent',
                        color: appointment.status === option.value ? '#fff' : option.color,
                        border: `1px solid ${option.color}`,
                        '&:hover': {
                          backgroundColor: `${option.color}20`
                        }
                      }}
                    />
                  ))}
                  {loadingStatusId === appointment?._id && (
                    <CircularProgress size={24} sx={{ ml: 1 }} />
                  )}
                </FormGroup>
              </Box>
            </>
          )}
        </AccordionContent>
      )}
    </StyledAccordion>
  );
};

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [loadingStatusId, setLoadingStatusId] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

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

  const handleStatusChange = (appointmentId, status) => {
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

  const filteredAppointments = filterStatus === 'all'
    ? appointments
    : appointments.filter(app => app?.status === filterStatus);

  // Group appointments by status for accordion sections
  const groupedAppointments = {
    pending: filteredAppointments.filter(app => app.status === 'pending'),
    confirmed: filteredAppointments.filter(app => app.status === 'confirmed'),
    completed: filteredAppointments.filter(app => app.status === 'completed'),
    cancelled: filteredAppointments.filter(app => app.status === 'cancelled'),
    expired: filteredAppointments.filter(app => app.status === 'expired'),
  };

  const renderAppointmentList = (appointments) => {
    if (appointments.length === 0) {
      return (
        <Box display="flex" justifyContent="center" py={4}>
          <Typography color="textSecondary">
            No appointments in this category
          </Typography>
        </Box>
      );
    }

    return (
      <Box>
        {appointments.map((appointment) => (
          <AppointmentAccordion
            key={appointment._id}
            appointment={appointment}
            onStatusChange={handleStatusChange}
            loadingStatusId={loadingStatusId}
          />
        ))}
      </Box>
    );
  };

  return (
    <Box>
      <Header title="Appointment Management" />

      {loading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Box mb={3}>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <InputLabel>Filter by Status</InputLabel>
              <Select
                value={filterStatus}
                label="Filter by Status"
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">All Appointments</MenuItem>
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
                <MenuItem value="expired">Expired</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {filterStatus === 'all' ? (
            <>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Pending Appointments ({groupedAppointments.pending.length})
              </Typography>
              {renderAppointmentList(groupedAppointments.pending)}

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Confirmed Appointments ({groupedAppointments.confirmed.length})
              </Typography>
              {renderAppointmentList(groupedAppointments.confirmed)}

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Completed Appointments ({groupedAppointments.completed.length})
              </Typography>
              {renderAppointmentList(groupedAppointments.completed)}

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Cancelled Appointments ({groupedAppointments.cancelled.length})
              </Typography>
              {renderAppointmentList(groupedAppointments.cancelled)}

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Expired Appointments ({groupedAppointments.expired.length})
              </Typography>
              {renderAppointmentList(groupedAppointments.expired)}
            </>
          ) : (
            renderAppointmentList(filteredAppointments)
          )}

          <Alert
            open={alertOpen}
            title="Change Status"
            confirmLabel="Update"
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