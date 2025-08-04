import React, { useState, useEffect } from 'react';
import {
    Box,
    Alert,
    CircularProgress,
    useTheme,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Typography,
    Tabs,
    Tab,
    Paper,
    Grid,
    Chip,
    Divider,
} from "@mui/material";
import { tokens } from "../../theme";
import { Header } from '../../components';
import axios from 'axios';
import Cookies from "js-cookie";
import { API_BASE_URL } from '../../utils/apiConfig';
import { allAppointmentStatusTableColumns } from '../../custom/TableColumns';
import CustomTable from '../../custom/Table';
import { showSuccessToast, showErrorToast } from '../../Toast';
import { Calendar, Clock, User, Mail, Phone, MapPin, CalendarDays, UserCheck, Scissors, FileText, AlertCircle } from 'lucide-react';

const AppointmentStatus = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('all');

    // Availability state
    const [availability, setAvailability] = useState([]);
    const [availabilityLoading, setAvailabilityLoading] = useState(false);
    const [availabilityError, setAvailabilityError] = useState(null);
    const [activeTab, setActiveTab] = useState(0);

    // Status update dialog state
    const [statusDialog, setStatusDialog] = useState({
        open: false,
        appointmentId: null,
        currentStatus: '',
        newStatus: '',
        notes: '',
        loading: false
    });

    // Reschedule dialog state
    const [rescheduleDialog, setRescheduleDialog] = useState({
        open: false,
        appointmentId: null,
        stylistId: null,
        stylistName: '',
        newDate: '',
        newSlotFrom: '',
        newSlotTill: '',
        notes: '',
        loading: false,
        availableDates: [],
        selectedDateSlots: []
    });

    // Delete dialog state
    const [deleteDialog, setDeleteDialog] = useState({
        open: false,
        appointmentId: null,
        appointmentDetails: null,
        reason: '',
        loading: false
    });

    // View dialog state
    const [viewDialog, setViewDialog] = useState({
        open: false,
        appointmentDetails: null
    });

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleDelete = (appointment) => {
        setDeleteDialog({
            open: true,
            appointmentId: appointment._id,
            appointmentDetails: appointment,
            reason: '',
            loading: false
        });
    };

    const handleView = (appointment) => {
        setViewDialog({
            open: true,
            appointmentDetails: appointment
        });
    };

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        setStatusDialog({
            open: true,
            appointmentId,
            currentStatus: appointments.find(appt => appt._id === appointmentId)?.status || '',
            newStatus,
            notes: '',
            loading: false
        });
    };

    const handleStatusUpdateConfirm = async () => {
        const { appointmentId, newStatus, notes } = statusDialog;
        setStatusDialog(prev => ({ ...prev, loading: true }));

        try {
            const response = await axios.patch(
                `${API_BASE_URL}/admin/appointments/${appointmentId}/status`,
                {
                    status: newStatus,
                    notes: notes || `${newStatus} by admin`
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            console.log('Appointment status updated successfully', response?.data);
            showSuccessToast(`Appointment ${newStatus} successfully`);

            // Update local state
            setAppointments((prev) =>
                prev.map((appt) =>
                    appt._id === appointmentId
                        ? { ...appt, status: newStatus, notes: notes || `${newStatus} by admin` }
                        : appt
                )
            );

            setStatusDialog(prev => ({ ...prev, open: false }));
        } catch (err) {
            console.error('Error updating appointment status:', err);
            showErrorToast('Failed to update appointment status');
        } finally {
            setStatusDialog(prev => ({ ...prev, loading: false }));
        }
    };

    const handleReschedule = (appointment) => {
        const stylistId = appointment.stylist?._id;
        const stylistName = appointment.stylist?.fullName || 'Unknown Stylist';

        // Get available dates for this stylist
        const stylistAvailability = availability.filter(item =>
            item.stylist?._id === stylistId && item.isActive
        );

        const availableDates = stylistAvailability.map(item => ({
            date: item.date,
            slots: item.slots
        }));

        setRescheduleDialog({
            open: true,
            appointmentId: appointment._id,
            stylistId,
            stylistName,
            newDate: '',
            newSlotFrom: '',
            newSlotTill: '',
            notes: '',
            loading: false,
            availableDates,
            selectedDateSlots: []
        });
    };

    const handleDateChange = (event) => {
        const selectedDate = event.target.value;
        const selectedDateData = rescheduleDialog.availableDates.find(
            item => item.date === selectedDate
        );

        setRescheduleDialog(prev => ({
            ...prev,
            newDate: selectedDate,
            selectedDateSlots: selectedDateData?.slots || [],
            newSlotFrom: '',
            newSlotTill: ''
        }));
    };

    const handleSlotChange = (event) => {
        const selectedSlot = event.target.value;
        const [from, till] = selectedSlot.split(' - ');

        setRescheduleDialog(prev => ({
            ...prev,
            newSlotFrom: from,
            newSlotTill: till
        }));
    };

    const handleRescheduleConfirm = async () => {
        const { appointmentId, newDate, newSlotFrom, newSlotTill, notes } = rescheduleDialog;
        setRescheduleDialog(prev => ({ ...prev, loading: true }));

        try {
            const response = await axios.patch(
                `${API_BASE_URL}/admin/appointments/${appointmentId}/reschedule`,
                {
                    newDate,
                    newSlot: {
                        from: newSlotFrom,
                        till: newSlotTill
                    },
                    notes: notes || 'Appointment rescheduled by admin'
                },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            console.log('Appointment rescheduled successfully', response?.data);
            showSuccessToast('Appointment rescheduled successfully');

            // Refresh appointments to get updated data
            fetchAppointments(selectedStatus);

            setRescheduleDialog(prev => ({ ...prev, open: false }));
        } catch (err) {
            console.error('Error rescheduling appointment:', err);
            showErrorToast('Failed to reschedule appointment');
        } finally {
            setRescheduleDialog(prev => ({ ...prev, loading: false }));
        }
    };

    const handleDeleteConfirm = async () => {
        const { appointmentId, reason } = deleteDialog;
        setDeleteDialog(prev => ({ ...prev, loading: true }));
        
        try {
            const requestBody = reason ? { reason } : {};
            const response = await axios.delete(
                `${API_BASE_URL}/admin/appointments/${appointmentId}`,
                {
                    data: requestBody,
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            
            console.log('Appointment deleted successfully', response?.data);
            showSuccessToast('Appointment deleted successfully');
            
            // Remove appointment from local state
            setAppointments((prev) =>
                prev.filter((appt) => appt._id !== appointmentId)
            );
            
            setDeleteDialog(prev => ({ ...prev, open: false }));
        } catch (err) {
            console.error('Error deleting appointment:', err);
            showErrorToast('Failed to delete appointment');
        } finally {
            setDeleteDialog(prev => ({ ...prev, loading: false }));
        }
    };

    const authToken = Cookies.get("token");

    const fetchAppointments = async (status = 'all') => {
        setLoading(true);
        setError(null);
        try {
            const params = status !== 'all' ? { status } : {};
            const response = await axios.get(`${API_BASE_URL}/admin/appointments`, {
                params,
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            console.log('appointment status', response.data);
            setAppointments(response.data.data || []);
        } catch (err) {
            setError('Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailability = async () => {
        setAvailabilityLoading(true);
        setAvailabilityError(null);
        try {
            const response = await axios.get(`${API_BASE_URL}/admin/all-availability`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            console.log('stylist availability', response.data);
            setAvailability(response.data.data || []);
        } catch (err) {
            console.error('Error fetching availability:', err);
            setAvailabilityError('Failed to fetch stylist availability');
        } finally {
            setAvailabilityLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments(selectedStatus);
        fetchAvailability();
    }, [selectedStatus]);

    const handleStatusFilterChange = (event) => {
        setSelectedStatus(event.target.value);
    };

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const formatTime = (time24) => {
        const [hour, minute] = time24.split(':').map(Number);
        const period = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
    };

    const columns = allAppointmentStatusTableColumns({
        handleDelete,
        handleView,
        handleStatusUpdate,
        handleReschedule
    });

    const renderAvailabilityCard = (availabilityItem) => (
        <Paper key={availabilityItem._id} elevation={2} sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <User size={20} style={{ marginRight: 8 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {availabilityItem.stylist?.fullName || 'Unknown Stylist'}
                </Typography>
                <Chip
                    label={availabilityItem.isActive ? 'Active' : 'Inactive'}
                    color={availabilityItem.isActive ? 'success' : 'default'}
                    size="small"
                    sx={{ ml: 2 }}
                />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Calendar size={16} style={{ marginRight: 4 }} />
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                    {new Date(availabilityItem.date).toLocaleDateString()}
                </Typography>
            </Box>

            {availabilityItem.slots && availabilityItem.slots.length > 0 ? (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {availabilityItem.slots.map((slot, slotIndex) => (
                        <Chip
                            key={slotIndex}
                            label={`${formatTime(slot.from)} - ${formatTime(slot.till)}`}
                            size="small"
                            variant="outlined"
                            color="primary"
                            icon={<Clock size={14} />}
                        />
                    ))}
                </Box>
            ) : (
                <Typography variant="body2" color="text.secondary">
                    No time slots available
                </Typography>
            )}
        </Paper>
    );

    return (
        <Box>
            <Header title="Appointment Status" />

            <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 3 }}>
                <Tab label="Appointments" />
                <Tab label="Stylist Availability" />
            </Tabs>

            {activeTab === 0 && (
                <>
                    {/* Status Filter */}
                    <Box sx={{ mb: 3, mt: 2 }}>
                        <Stack direction="row" spacing={2} alignItems="center">
                            <FormControl sx={{ minWidth: 200 }}>
                                <InputLabel id="status-filter-label">Filter by Status</InputLabel>
                                <Select
                                    labelId="status-filter-label"
                                    id="status-filter"
                                    value={selectedStatus}
                                    label="Filter by Status"
                                    onChange={handleStatusFilterChange}
                                >
                                    <MenuItem value="all">All Appointments</MenuItem>
                                    <MenuItem value="pending">Pending</MenuItem>
                                    <MenuItem value="confirmed">Confirmed</MenuItem>
                                    <MenuItem value="completed">Completed</MenuItem>
                                    <MenuItem value="cancelled">Cancelled</MenuItem>
                                    <MenuItem value="rejected">Rejected</MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>
                    </Box>

                    {loading && (
                        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                            <CircularProgress />
                        </Box>
                    )}
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
                    )}
                    {!loading && !error && (
                        <CustomTable
                            columns={columns}
                            rows={appointments.map(appt => ({ ...appt, id: appt._id }))}
                            loading={loading}
                            noRowsMessage={`No ${selectedStatus !== 'all' ? selectedStatus : ''} appointments found.`}
                        />
                    )}
                </>
            )}

            {activeTab === 1 && (
                <>
                    {availabilityLoading && (
                        <Box display="flex" justifyContent="center" alignItems="center" mt={2}>
                            <CircularProgress />
                        </Box>
                    )}
                    {availabilityError && (
                        <Alert severity="error" sx={{ mt: 2 }}>{availabilityError}</Alert>
                    )}
                    {!availabilityLoading && !availabilityError && (
                        <Box>
                            <Typography variant="h6" sx={{ mb: 2 }}>
                                All Stylist Availability ({availability.length} entries)
                            </Typography>
                            {availability.length > 0 ? (
                                availability.map(availabilityItem => renderAvailabilityCard(availabilityItem))
                            ) : (
                                <Alert severity="info">No stylist availability data found.</Alert>
                            )}
                        </Box>
                    )}
                </>
            )}

            {/* Status Update Dialog */}
            <Dialog open={statusDialog.open} onClose={() => setStatusDialog(prev => ({ ...prev, open: false }))} maxWidth="sm" fullWidth>
                <DialogTitle>Update Appointment Status</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                            Current Status: <strong>{statusDialog.currentStatus}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            New Status: <strong>{statusDialog.newStatus}</strong>
                        </Typography>
                        <TextField
                            label="Notes (Optional)"
                            multiline
                            rows={3}
                            value={statusDialog.notes}
                            onChange={(e) => setStatusDialog(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Add notes about this status change..."
                            fullWidth
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStatusDialog(prev => ({ ...prev, open: false }))} disabled={statusDialog.loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleStatusUpdateConfirm}
                        variant="contained"
                        color="primary"
                        disabled={statusDialog.loading}
                    >
                        {statusDialog.loading ? 'Updating...' : 'Update Status'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Reschedule Dialog */}
            <Dialog open={rescheduleDialog.open} onClose={() => setRescheduleDialog(prev => ({ ...prev, open: false }))} maxWidth="sm" fullWidth>
                <DialogTitle>Reschedule Appointment</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Stylist"
                            value={rescheduleDialog.stylistName}
                            InputProps={{
                                readOnly: true,
                            }}
                            fullWidth
                        />
                        {rescheduleDialog.availableDates.length > 0 ? (
                            <>
                                <TextField
                                    label="New Date"
                                    type="date"
                                    value={rescheduleDialog.newDate}
                                    onChange={handleDateChange}
                                    fullWidth
                                    InputLabelProps={{ shrink: true }}
                                    helperText={`${rescheduleDialog.availableDates.length} available date(s) found`}
                                />
                                {rescheduleDialog.newDate && rescheduleDialog.selectedDateSlots.length > 0 && (
                                    <Box sx={{ mt: 2 }}>
                                        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            Available Slots for {new Date(rescheduleDialog.newDate).toLocaleDateString()}
                                        </Typography>
                                        <Select
                                            value={rescheduleDialog.newSlotFrom && rescheduleDialog.newSlotTill
                                                ? `${rescheduleDialog.newSlotFrom} - ${rescheduleDialog.newSlotTill}`
                                                : ""}
                                            onChange={handleSlotChange}
                                            fullWidth
                                            displayEmpty
                                            renderValue={(selected) => {
                                                if (!selected) {
                                                    return <em>Select a slot</em>;
                                                }
                                                return selected;
                                            }}
                                        >
                                            <MenuItem value="" disabled>
                                                Select a slot
                                            </MenuItem>
                                            {rescheduleDialog.selectedDateSlots.map((slot, index) => (
                                                <MenuItem key={index} value={`${slot.from} - ${slot.till}`}>
                                                    {formatTime(slot.from)} - {formatTime(slot.till)}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </Box>
                                )}
                            </>
                        ) : (
                            <Alert severity="warning" sx={{ mt: 1 }}>
                                No available dates found for this stylist. Please check their availability first.
                            </Alert>
                        )}
                        <TextField
                            label="Notes (Optional)"
                            multiline
                            rows={3}
                            value={rescheduleDialog.notes}
                            onChange={(e) => setRescheduleDialog(prev => ({ ...prev, notes: e.target.value }))}
                            placeholder="Add notes about this reschedule..."
                            fullWidth
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRescheduleDialog(prev => ({ ...prev, open: false }))} disabled={rescheduleDialog.loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleRescheduleConfirm}
                        variant="contained"
                        color="primary"
                        disabled={rescheduleDialog.loading || !rescheduleDialog.newDate || !rescheduleDialog.newSlotFrom || !rescheduleDialog.newSlotTill || rescheduleDialog.availableDates.length === 0}
                    >
                        {rescheduleDialog.loading ? 'Rescheduling...' : 'Reschedule'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={deleteDialog.open} onClose={() => setDeleteDialog(prev => ({ ...prev, open: false }))} maxWidth="sm" fullWidth>
                <DialogTitle>Delete Appointment</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                                                 {deleteDialog.appointmentDetails && (
                             <>
                                 <Typography variant="body2" color="text.secondary">
                                     <strong>Appointment Details:</strong>
                                 </Typography>
                                 <Box sx={{ pl: 2, mb: 2 }}>
                                     <Typography variant="body2" color="text.secondary">
                                         <strong>User:</strong> {deleteDialog.appointmentDetails.user?.fullName || 'N/A'}
                                     </Typography>
                                     <Typography variant="body2" color="text.secondary">
                                         <strong>Stylist:</strong> {deleteDialog.appointmentDetails.stylist?.fullName || 'N/A'}
                                     </Typography>
                                     <Typography variant="body2" color="text.secondary">
                                         <strong>Service:</strong> {deleteDialog.appointmentDetails.service?.name || 'N/A'}
                                     </Typography>
                                     <Typography variant="body2" color="text.secondary">
                                         <strong>Date:</strong> {deleteDialog.appointmentDetails.date ? new Date(deleteDialog.appointmentDetails.date).toLocaleDateString() : 'N/A'}
                                     </Typography>
                                     <Typography variant="body2" color="text.secondary">
                                         <strong>Time:</strong> {deleteDialog.appointmentDetails.slot ? `${deleteDialog.appointmentDetails.slot.from} - ${deleteDialog.appointmentDetails.slot.till}` : 'N/A'}
                                     </Typography>
                                     <Typography variant="body2" color="text.secondary">
                                         <strong>Status:</strong> {deleteDialog.appointmentDetails.status || 'N/A'}
                                     </Typography>
                                 </Box>
                             </>
                         )}
                        <TextField
                            label="Reason for Deletion (Optional)"
                            multiline
                            rows={3}
                            value={deleteDialog.reason}
                            onChange={(e) => setDeleteDialog(prev => ({ ...prev, reason: e.target.value }))}
                            placeholder="Add a reason for deleting this appointment..."
                            fullWidth
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialog(prev => ({ ...prev, open: false }))} disabled={deleteDialog.loading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteConfirm}
                        variant="contained"
                        color="error"
                        disabled={deleteDialog.loading}
                    >
                        {deleteDialog.loading ? 'Deleting...' : 'Delete Appointment'}
                    </Button>
                                 </DialogActions>
             </Dialog>

             {/* View Dialog */}
             <Dialog 
                 open={viewDialog.open} 
                 onClose={() => setViewDialog(prev => ({ ...prev, open: false }))} 
                 maxWidth="md" 
                 fullWidth
                 PaperProps={{
                     sx: {
                         borderRadius: 3,
                         boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                         background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
                     }
                 }}
             >
                 <DialogTitle sx={{ 
                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                     color: 'white',
                     borderRadius: '12px 12px 0 0',
                     display: 'flex',
                     alignItems: 'center',
                     gap: 2,
                     pb: 3
                 }}>
                     <CalendarDays size={24} />
                     <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                         Appointment Details
                     </Typography>
                 </DialogTitle>
                 <DialogContent sx={{ p: 3 }}>
                     {viewDialog.appointmentDetails && (
                         <Stack spacing={3}>
                             {/* Status Banner */}
                             <Paper elevation={0} sx={{ 
                                 p: 2, 
                                 background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                 borderRadius: 2,
                                 color: 'white'
                             }}>
                                 <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                     <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                         <AlertCircle size={20} />
                                         <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                             Status: {viewDialog.appointmentDetails.status?.toUpperCase() || 'N/A'}
                                         </Typography>
                                     </Box>
                                     <Chip 
                                         label={viewDialog.appointmentDetails.status || 'N/A'} 
                                         color={
                                             viewDialog.appointmentDetails.status === 'confirmed' ? 'success' :
                                             viewDialog.appointmentDetails.status === 'pending' ? 'warning' :
                                             viewDialog.appointmentDetails.status === 'cancelled' ? 'error' :
                                             viewDialog.appointmentDetails.status === 'completed' ? 'primary' :
                                             'default'
                                         } 
                                         sx={{ 
                                             fontWeight: 'bold',
                                             '& .MuiChip-label': { color: 'white' }
                                         }}
                                     />
                                 </Box>
                             </Paper>

                             {/* User and Stylist Information */}
                             <Grid container spacing={3}>
                                 <Grid item xs={12} md={6}>
                                     <Paper elevation={2} sx={{ 
                                         p: 3, 
                                         borderRadius: 2,
                                         background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                         color: 'white'
                                     }}>
                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                             <User size={20} />
                                             <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                 Customer Information
                                             </Typography>
                                         </Box>
                                         <Stack spacing={2}>
                                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                 <UserCheck size={16} />
                                                 <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                     {viewDialog.appointmentDetails.user?.fullName || 'N/A'}
                                                 </Typography>
                                             </Box>
                                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                 <Mail size={16} />
                                                 <Typography variant="body2">
                                                     {viewDialog.appointmentDetails.user?.email || 'N/A'}
                                                 </Typography>
                                             </Box>
                                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                 <Phone size={16} />
                                                 <Typography variant="body2">
                                                     {viewDialog.appointmentDetails.user?.phoneNumber || 'N/A'}
                                                 </Typography>
                                             </Box>
                                         </Stack>
                                     </Paper>
                                 </Grid>
                                 
                                 <Grid item xs={12} md={6}>
                                     <Paper elevation={2} sx={{ 
                                         p: 3, 
                                         borderRadius: 2,
                                         background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                         color: 'white'
                                     }}>
                                         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                             <Scissors size={20} />
                                             <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                 Stylist Information
                                             </Typography>
                                         </Box>
                                         <Stack spacing={2}>
                                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                 <UserCheck size={16} />
                                                 <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                     {viewDialog.appointmentDetails.stylist?.fullName || 'N/A'}
                                                 </Typography>
                                             </Box>
                                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                 <Mail size={16} />
                                                 <Typography variant="body2">
                                                     {viewDialog.appointmentDetails.stylist?.email || 'N/A'}
                                                 </Typography>
                                             </Box>
                                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                 <Phone size={16} />
                                                 <Typography variant="body2">
                                                     {viewDialog.appointmentDetails.stylist?.phoneNumber || 'N/A'}
                                                 </Typography>
                                             </Box>
                                         </Stack>
                                     </Paper>
                                 </Grid>
                             </Grid>

                             {/* Appointment Details */}
                             <Paper elevation={2} sx={{ 
                                 p: 3, 
                                 borderRadius: 2,
                                 background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
                             }}>
                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                                     <Calendar size={20} />
                                     <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2c3e50' }}>
                                         Appointment Details
                                     </Typography>
                                 </Box>
                                 <Grid container spacing={3}>
                                     <Grid item xs={12} md={6}>
                                         <Stack spacing={2}>
                                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                 <Scissors size={16} />
                                                 <Box>
                                                     <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                                                         SERVICE
                                                     </Typography>
                                                     <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                         {viewDialog.appointmentDetails.service?.name || 'N/A'}
                                                     </Typography>
                                                 </Box>
                                             </Box>
                                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                 <CalendarDays size={16} />
                                                 <Box>
                                                     <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                                                         DATE
                                                     </Typography>
                                                     <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                         {viewDialog.appointmentDetails.date ? new Date(viewDialog.appointmentDetails.date).toLocaleDateString('en-US', { 
                                                             weekday: 'long', 
                                                             year: 'numeric', 
                                                             month: 'long', 
                                                             day: 'numeric' 
                                                         }) : 'N/A'}
                                                     </Typography>
                                                 </Box>
                                             </Box>
                                         </Stack>
                                     </Grid>
                                     <Grid item xs={12} md={6}>
                                         <Stack spacing={2}>
                                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                 <Clock size={16} />
                                                 <Box>
                                                     <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                                                         TIME SLOT
                                                     </Typography>
                                                     <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                         {viewDialog.appointmentDetails.slot ? `${viewDialog.appointmentDetails.slot.from} - ${viewDialog.appointmentDetails.slot.till}` : 'N/A'}
                                                     </Typography>
                                                 </Box>
                                             </Box>
                                             <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                 <FileText size={16} />
                                                 <Box>
                                                     <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                                                         NOTES
                                                     </Typography>
                                                     <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                                         {viewDialog.appointmentDetails.notes || 'No notes available'}
                                                     </Typography>
                                                 </Box>
                                             </Box>
                                         </Stack>
                                     </Grid>
                                 </Grid>
                             </Paper>

                             {/* Additional Info */}
                             <Paper elevation={1} sx={{ 
                                 p: 2, 
                                 borderRadius: 2,
                                 background: '#f8f9fa',
                                 border: '1px solid #e9ecef'
                             }}>
                                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                     <MapPin size={16} />
                                     <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                         <strong>Created:</strong> {viewDialog.appointmentDetails.createdAt ? new Date(viewDialog.appointmentDetails.createdAt).toLocaleString() : 'N/A'}
                                     </Typography>
                                 </Box>
                             </Paper>
                         </Stack>
                     )}
                 </DialogContent>
                 <DialogActions sx={{ p: 3, pt: 0 }}>
                     <Button 
                         onClick={() => setViewDialog(prev => ({ ...prev, open: false }))}
                         variant="contained"
                         sx={{
                             background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                             borderRadius: 2,
                             px: 4,
                             py: 1.5,
                             '&:hover': {
                                 background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)'
                             }
                         }}
                     >
                         Close
                     </Button>
                 </DialogActions>
             </Dialog>
         </Box>
     );
};

export default AppointmentStatus;