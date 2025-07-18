import { useState, useEffect } from 'react';
import { Box, Typography, IconButton, CircularProgress, Switch, Card, CardContent, Divider, Tooltip, Snackbar, Alert as MuiAlert, Chip, Checkbox, FormControlLabel } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import dayjs from 'dayjs';
import { Header } from '../../components';
import { CustomIconButton } from '../../custom/Button';
import { showSuccessToast, showErrorToast } from '../../Toast';
import axios from 'axios';
import Cookies from "js-cookie";
import { API_BASE_URL } from '../../utils/apiConfig';
import { Trash2 } from 'lucide-react';

const TIME_SLOTS = {
  Morning: [
    { from: '09:00', till: '10:00' },
    { from: '10:00', till: '11:00' },
    { from: '11:00', till: '12:00' }
  ],
  Afternoon: [
    { from: '12:00', till: '13:00' },
    { from: '13:00', till: '14:00' },
    { from: '14:00', till: '15:00' },
    { from: '15:00', till: '16:00' }
  ],
  Evening: [
    { from: '16:00', till: '17:00' },
    { from: '17:00', till: '18:00' },
    { from: '18:00', till: '19:00' }
  ]
};


const Availability = () => {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [availability, setAvailability] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiData, setApiData] = useState([]);

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
      console.log('Availability data fetched:', res.data);
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


  const startOfWeek = currentDate.startOf('week');
  const dates = Array.from({ length: 7 }, (_, i) => startOfWeek.add(i, 'day'));

  const handlePrevWeek = () => setCurrentDate(prev => prev.subtract(7, 'day'));
  const handleNextWeek = () => setCurrentDate(prev => prev.add(7, 'day'));

  const currentAvailability = availability[selectedDate.format('YYYY-MM-DD')] || { slots: [], isClosed: false };

  const toggleSlot = (slotObj) => {
    const dateKey = selectedDate.format('YYYY-MM-DD');
    const current = availability[dateKey] || { slots: [], isClosed: false };

    const slotExists = current.slots.some(s => s.from === slotObj.from && s.till === slotObj.till);

    const updatedSlots = slotExists
      ? current.slots.filter(s => !(s.from === slotObj.from && s.till === slotObj.till))
      : [...current.slots, slotObj];

    setAvailability({
      ...availability,
      [dateKey]: { ...current, slots: updatedSlots }
    });
  };


  const toggleClosed = () => {
    const dateKey = selectedDate.format('YYYY-MM-DD');
    const current = availability[dateKey] || { slots: [], isClosed: false };

    setAvailability({
      ...availability,
      [dateKey]: {
        ...current,
        isClosed: !current.isClosed,
        slots: current.isClosed ? current.slots : []
      }
    });
  };

  const handleSaveSlotAvailable = async () => {
    setLoading(true);
    try {
      const availabilityPayload = Object.entries(availability).map(([date, data]) => ({
        date,
        slots: data.slots,
        isActive: !data.isClosed
      }));

      await axios.post(`${API_BASE_URL}/stylist/set-availability`,
        { availability: availabilityPayload },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );

      showSuccessToast('Availability saved successfully');
      fetchAvailability();
    } catch (error) {
      console.error(error);
      showErrorToast('Failed to save availability');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSlot = async (date, slot) => {
    try {
      setLoading(true);
      if (slot) {
        // Delete specific slot for a date
        await axios.delete(`${API_BASE_URL}/stylist/delete-availability-slot/${date}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          data: {
            from: slot.from,
            till: slot.till,
          },
          withCredentials: true,
        });
        showSuccessToast('Slot deleted successfully');
      } else {
        // Delete entire availability for a date
        await axios.delete(`${API_BASE_URL}/stylist/delete-availability/${date}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        });
        showSuccessToast('Availability deleted successfully');
      }
      fetchAvailability();
    } catch (error) {
      showErrorToast('Failed to delete availability');
    } finally {
      setLoading(false);
    }
  };


  return (
    <Box>
      <Header title="Availability Management" />
      <Box display="flex" justifyContent="center" alignItems="flex-start" minHeight="80vh" p={2} gap={3}>
        {/* Left column: Availability Management */}
        <Box flex={1} minWidth={350} maxWidth={600}>
          <Card sx={{ minWidth: 350, maxWidth: 600, width: '100%', boxShadow: 4, borderRadius: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2} color="primary.main">
                Availability Management
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box display="flex" alignItems="center" gap={2} justifyContent="center" mb={2}>
                <IconButton onClick={handlePrevWeek} size="small" color="primary">
                  <ArrowBackIosIcon />
                </IconButton>
                <Typography variant="h6" fontWeight={600} color="primary.main">
                  {currentDate.format('MMM, YYYY')}
                </Typography>
                <IconButton onClick={handleNextWeek} size="small" color="primary">
                  <ArrowForwardIosIcon />
                </IconButton>
              </Box>
              <Box display="flex" gap={1} justifyContent="center" mb={2}>
                {dates?.map(date => {
                  const isSelected = selectedDate.isSame(date, 'day');
                  const isPastDate = date.isBefore(dayjs().startOf('day'), 'day');
                  return (
                    <Box
                      key={date.format('DD-MM-YYYY')}
                      onClick={() => !isPastDate && setSelectedDate(date)}
                      sx={{
                        p: 1.2,
                        borderRadius: 2,
                        border: isSelected ? '2px solid #6d295a' : '1px solid #e0e0e0',
                        bgcolor: isSelected ? '#6d295a' : '#fff',
                        color: isPastDate ? 'grey.500' : isSelected ? 'white' : 'text.primary',
                        cursor: isPastDate ? 'not-allowed' : 'pointer',
                        textAlign: 'center',
                        minWidth: 54,
                        boxShadow: isSelected ? 2 : 0,
                        opacity: isPastDate ? 0.5 : 1,
                        transition: 'all 0.2s',
                      }}
                    >
                      <Typography fontWeight={600}>{date.format('DD')}</Typography>
                      <Typography variant="caption">{date.format('ddd')}</Typography>
                    </Box>
                  );
                })}
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Box mt={1} display="flex" alignItems="center" gap={1}>
                <Tooltip title="Mark this day as closed for appointments">
                  <Typography fontWeight={500} color="text.secondary">Closed</Typography>
                </Tooltip>
                <Switch checked={currentAvailability.isClosed} onChange={toggleClosed} color="error" />
              </Box>
              {!currentAvailability.isClosed && (
                <Box mt={2}>
                  {Object.entries(TIME_SLOTS).map(([period, slots]) => {
                    const now = dayjs();
                    const availableSlots = slots.filter(slot => {
                      const slotDateTime = selectedDate
                        .hour(Number(slot.from.split(':')[0]))
                        .minute(Number(slot.from.split(':')[1]))
                        .second(0)
                        .millisecond(0);

                      if (selectedDate.isBefore(dayjs(), 'day')) return false;
                      if (selectedDate.isSame(dayjs(), 'day')) return slotDateTime.isAfter(dayjs());
                      return true;
                    });

                    const selectedSlots = currentAvailability.slots.filter(slot => slots.includes(slot));
                    const selectedAvailableSlots = selectedSlots.filter(slot => availableSlots.includes(slot));
                    const allSelected = availableSlots.length > 0 && selectedAvailableSlots.length === availableSlots.length;
                    const someSelected = selectedAvailableSlots.length > 0 && !allSelected;

                    const handlePeriodCheckbox = (e) => {
                      const checked = e.target.checked;
                      if (checked) {
                        const newSlots = Array.from(new Set([...currentAvailability.slots, ...availableSlots]));
                        setAvailability({
                          ...availability,
                          [selectedDate.format('YYYY-MM-DD')]: {
                            ...currentAvailability,
                            slots: newSlots
                          }
                        });
                      } else {
                        const newSlots = currentAvailability.slots.filter(slot => !slots.includes(slot));
                        setAvailability({
                          ...availability,
                          [selectedDate.format('YYYY-MM-DD')]: {
                            ...currentAvailability,
                            slots: newSlots
                          }
                        });
                      }
                    };
                    return (
                      <Box key={period} mb={2}>
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Tooltip title={availableSlots.length === 0 ? 'All slots expired for today' : ''}>
                            <span>
                              <FormControlLabel
                                control={
                                  <Checkbox
                                    checked={allSelected}
                                    indeterminate={someSelected}
                                    onChange={handlePeriodCheckbox}
                                    disabled={availableSlots.length === 0}
                                    size="small"
                                  />
                                }
                                label={<Typography fontWeight="bold" color="primary.main" display="flex" alignItems="center" gap={1}><AccessTimeIcon fontSize="small" /> {period}</Typography>}
                              />
                            </span>
                          </Tooltip>
                        </Box>
                        <Box display="flex" gap={1} flexWrap="wrap">
                          {slots?.map(slot => {
                            const selected = currentAvailability.slots.some(s => s.from === slot.from && s.till === slot.till);
                            const slotDateTime = selectedDate
                              .hour(Number(slot.from.split(':')[0]))
                              .minute(Number(slot.from.split(':')[1]))
                              .second(0)
                              .millisecond(0);
                            const isPastSlot = selectedDate.isBefore(dayjs(), 'day') || (selectedDate.isSame(dayjs(), 'day') && slotDateTime.isBefore(dayjs()));

                            // Disable if slot is already present in apiData for the selected date
                            let isAlreadyAvailable = false;
                            const apiDate = apiData.find(item => item.date === selectedDate.format('YYYY-MM-DD'));
                            if (apiDate && apiDate.slots) {
                              isAlreadyAvailable = apiDate.slots.some(s => s.from === slot.from && s.till === slot.till);
                            }

                            const slotLabel = `${dayjs(`2000-01-01T${slot.from}`).format('hh:mm A')} - ${dayjs(`2000-01-01T${slot.till}`).format('hh:mm A')}`;
                            return (
                              <Chip
                                key={`${slot.from}-${slot.till}`}
                                label={slotLabel}
                                onClick={() => !isPastSlot && !isAlreadyAvailable && toggleSlot(slot)}
                                icon={selected ? <CheckCircleIcon fontSize="small" sx={{ color: 'white' }} /> : null}
                                variant={selected ? 'filled' : 'outlined'}
                                disabled={isPastSlot || isAlreadyAvailable}
                                sx={{
                                  minWidth: 90,
                                  fontWeight: 'bold',
                                  boxShadow: selected ? 2 : 0,
                                  backgroundColor: selected ? '#6d295a' : undefined,
                                  color: selected ? 'white' : '#6d295a',
                                  border: selected ? undefined : '1px solid #6d295a',
                                  opacity: isPastSlot || isAlreadyAvailable ? 0.5 : 1,
                                  cursor: isPastSlot || isAlreadyAvailable ? 'not-allowed' : 'pointer',
                                }}
                              />
                            );
                          })}
                        </Box>
                      </Box>
                    );
                  })}
                </Box>
              )}
              <Divider sx={{ my: 2 }} />
              <Box display="flex" justifyContent="center">
                <CustomIconButton
                  icon={<EventAvailableIcon />}
                  onClick={handleSaveSlotAvailable}
                  text={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Save Availability'}
                  color="#6d295a"
                  disabled={loading || currentAvailability.isClosed || currentAvailability.slots.length === 0}
                  size="large"
                  fontWeight={600}
                  variant="contained"
                  sx={{ minWidth: 200, fontSize: '1rem', borderRadius: '20px', padding: '8px 24px' }}
                />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box flex={1} minWidth={350}>
          <Card sx={{ minWidth: 350, width: '100%', boxShadow: 2, borderRadius: 4, p: 1 }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2} color="primary.main">
                All Availability Slots
              </Typography>
              {apiData?.length === 0 ? (
                <Typography color="text.secondary">No availability data found.</Typography>
              ) : (
                apiData?.map((item) => (
                  <Box key={item._id} mb={2} p={2} borderRadius={2} bgcolor="#f8f8fa" boxShadow={1}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Typography fontWeight={600} color="#6d295a">
                        {item.date}
                      </Typography>
                      <IconButton size="small" onClick={() => handleDeleteSlot(item.date)} sx={{ color: '#6d295a', p: 0.5 }}>
                        <Trash2 size={16} />
                      </IconButton>
                    </Box>
                    <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                      {item.slots.map(slot => (
                        <Chip
                          key={slot._id}
                          label={`${slot.from} - ${slot.till}`}
                          color="primary"
                          size="small"
                          sx={{
                            bgcolor: '#6d295a',
                            color: 'white',
                            fontWeight: 600,
                            '& .MuiChip-deleteIcon': {
                              marginLeft: '5px'
                            }
                          }}
                          deleteIcon={<Trash2 size={16} />}
                          onDelete={() => handleDeleteSlot(item.date, slot)}
                        />
                      ))}
                    </Box>
                    <Typography variant="caption" color={item.isActive ? 'green' : 'red'} mt={1} display="block">
                      {item.isActive ? 'Active' : 'Closed'}
                    </Typography>
                  </Box>
                ))
              )}
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default Availability;
