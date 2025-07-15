import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Stack, Switch, Chip, CircularProgress, Snackbar, Alert } from '@mui/material';
import { setCustomWorkingHours } from '../utils/apiConfig';

function CustomDateSchedule({ stylistId }) {
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [reason, setReason] = useState('');
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleAddSlot = () => setSlots([...slots, { time: '', enabled: true }]);
  const handleRemoveSlot = (idx) => setSlots(slots.filter((_, i) => i !== idx));
  const handleSlotChange = (idx, key, value) => {
    setSlots(slots.map((slot, i) => i === idx ? { ...slot, [key]: value } : slot));
  };

  const handleSave = () => {
    setLoading(true);
    setCustomWorkingHours(stylistId, {
      date,
      startTime,
      endTime,
      slots,
      reason
    })
      .then(() => setSnackbar({ open: true, message: 'Custom schedule saved!', severity: 'success' }))
      .catch(() => setSnackbar({ open: true, message: 'Error saving!', severity: 'error' }))
      .finally(() => setLoading(false));
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>Custom Date/Exception</Typography>
      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <TextField label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} size="small" />
        <TextField label="Start Time" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} size="small" />
        <TextField label="End Time" type="time" value={endTime} onChange={e => setEndTime(e.target.value)} size="small" />
        <TextField label="Reason" value={reason} onChange={e => setReason(e.target.value)} size="small" />
        <Button variant="outlined" size="small" onClick={handleAddSlot}>Add Slot</Button>
      </Stack>
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" mb={2}>
        {slots.map((slot, idx) => (
          <Chip
            key={idx}
            label={
              <span>
                <TextField
                  type="time"
                  value={slot.time}
                  onChange={e => handleSlotChange(idx, 'time', e.target.value)}
                  size="small"
                  sx={{ width: 90 }}
                />
                <Switch
                  checked={slot.enabled}
                  onChange={e => handleSlotChange(idx, 'enabled', e.target.checked)}
                  size="small"
                  color="success"
                />
              </span>
            }
            onDelete={() => handleRemoveSlot(idx)}
            sx={{ m: 0.5 }}
          />
        ))}
      </Stack>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSave}
        disabled={!date || !startTime || !endTime || loading}
        startIcon={loading ? <CircularProgress size={18} /> : null}
      >
        Save Custom Schedule
      </Button>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
export default CustomDateSchedule; 