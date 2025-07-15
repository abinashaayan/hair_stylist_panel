import React, { useState } from 'react';
import { Box, Typography, Grid, TextField, Button, Stack, Switch, Chip, CircularProgress, Snackbar, Alert } from '@mui/material';
import { setDefaultWorkingHours } from '../utils/apiConfig';

const days = [
  { label: 'Sunday', value: 0 },
  { label: 'Monday', value: 1 },
  { label: 'Tuesday', value: 2 },
  { label: 'Wednesday', value: 3 },
  { label: 'Thursday', value: 4 },
  { label: 'Friday', value: 5 },
  { label: 'Saturday', value: 6 },
];

function WeeklySchedule({ stylistId }) {
  const [schedule, setSchedule] = useState({});
  const [loadingDay, setLoadingDay] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleChange = (day, field, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const handleSlotChange = (day, idx, key, value) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day]?.slots?.map((slot, i) => i === idx ? { ...slot, [key]: value } : slot) || []
      }
    }));
  };

  const handleAddSlot = (day) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: [...(prev[day]?.slots || []), { time: '', enabled: true }]
      }
    }));
  };

  const handleRemoveSlot = (day, idx) => {
    setSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        slots: prev[day]?.slots?.filter((_, i) => i !== idx) || []
      }
    }));
  };

  const handleSave = (day) => {
    setLoadingDay(day);
    setDefaultWorkingHours(stylistId, {
      dayOfWeek: day,
      startTime: schedule[day]?.startTime,
      endTime: schedule[day]?.endTime,
      slots: schedule[day]?.slots || []
    })
      .then(() => setSnackbar({ open: true, message: 'Saved!', severity: 'success' }))
      .catch(() => setSnackbar({ open: true, message: 'Error saving!', severity: 'error' }))
      .finally(() => setLoadingDay(null));
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>Weekly Schedule</Typography>
      <Grid container spacing={2}>
        {days.map(d => (
          <Grid item xs={12} md={6} key={d.value}>
            <Box p={2} border={1} borderRadius={2} borderColor="grey.300" mb={2}>
              <Typography fontWeight={600}>{d.label}</Typography>
              <Stack direction="row" spacing={2} alignItems="center" mt={1}>
                <TextField
                  label="Start Time"
                  type="time"
                  value={schedule[d.value]?.startTime || ''}
                  onChange={e => handleChange(d.value, 'startTime', e.target.value)}
                  size="small"
                />
                <TextField
                  label="End Time"
                  type="time"
                  value={schedule[d.value]?.endTime || ''}
                  onChange={e => handleChange(d.value, 'endTime', e.target.value)}
                  size="small"
                />
                <Button variant="outlined" size="small" onClick={() => handleAddSlot(d.value)}>Add Slot</Button>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" mt={1} flexWrap="wrap">
                {(schedule[d.value]?.slots || []).map((slot, idx) => (
                  <Chip
                    key={idx}
                    label={
                      <span>
                        <TextField
                          type="time"
                          value={slot.time}
                          onChange={e => handleSlotChange(d.value, idx, 'time', e.target.value)}
                          size="small"
                          sx={{ width: 90 }}
                        />
                        <Switch
                          checked={slot.enabled}
                          onChange={e => handleSlotChange(d.value, idx, 'enabled', e.target.checked)}
                          size="small"
                          color="success"
                        />
                      </span>
                    }
                    onDelete={() => handleRemoveSlot(d.value, idx)}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Stack>
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ mt: 2 }}
                onClick={() => handleSave(d.value)}
                disabled={!schedule[d.value]?.startTime || !schedule[d.value]?.endTime || loadingDay === d.value}
                startIcon={loadingDay === d.value ? <CircularProgress size={18} /> : null}
              >
                Save
              </Button>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
export default WeeklySchedule; 