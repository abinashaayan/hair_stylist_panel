import React, { useState } from 'react';
import {
    Box,
    Card,
    Typography,
    Avatar,
    CardContent,
    Stack,
    Chip,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem
} from '@mui/material';
import { CalendarCheck, CalendarX2, PencilLine } from 'lucide-react';
import { Header } from '../../components';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const notifications = [
    {
        id: 1,
        type: 'booked',
        title: 'New Appointment Booked',
        description: 'A customer booked an appointment for Hair Styling.',
        time: '2 mins ago',
        date: '2025-08-05',
    },
    {
        id: 2,
        type: 'modified',
        title: 'Appointment Modified',
        description: 'An appointment was rescheduled to 5 PM today.',
        time: '15 mins ago',
        date: '2025-08-04',
    },
    {
        id: 3,
        type: 'canceled',
        title: 'Appointment Canceled',
        description: 'A customer canceled their appointment.',
        time: '1 hour ago',
        date: '2025-08-03',
    },
];

const getIcon = (type) => {
    switch (type) {
        case 'booked': return <CalendarCheck size={20} color="#4caf50" />;
        case 'modified': return <PencilLine size={20} color="#2196f3" />;
        case 'canceled': return <CalendarX2 size={20} color="#f44336" />;
        default: return null;
    }
};

const getChipColor = (type) => {
    switch (type) {
        case 'booked': return 'success';
        case 'modified': return 'info';
        case 'canceled': return 'error';
        default: return 'default';
    }
};

const Notification = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [filter, setFilter] = React.useState('all');

    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter((n) => n.type === filter);

    const handleFilterChange = (event) => {
        setFilter(event.target.value);
    };

    return (
        <Box>
            <Header title="Notifications" />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                    value={selectedDate}
                    onChange={(newValue) => setSelectedDate(newValue)}
                    slotProps={{ textField: { size: 'small', sx: { mb: 2, mr: 2 } } }}
                />
            </LocalizationProvider>

            <FormControl size="small" sx={{ width: 200, mb: 2 }}>
                <Select
                    value={filter}
                    label="Filter By"
                    onChange={handleFilterChange}
                >
                    <MenuItem value="all">All</MenuItem>
                    <MenuItem value="booked">Booked</MenuItem>
                    <MenuItem value="modified">Modified</MenuItem>
                    <MenuItem value="canceled">Canceled</MenuItem>
                </Select>
            </FormControl>


            <Stack spacing={1.5}>
                {filteredNotifications.length > 0 ? (
                    filteredNotifications.map((notification) => (
                        <Card
                            key={notification.id}
                            variant="outlined"
                            sx={{
                                borderRadius: 2,
                                boxShadow: 1,
                                px: 1,
                                py: 0.5,
                                border: '1px solid #420c36',
                            }}
                        >
                            <CardContent
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    py: '8px !important',
                                    px: 1,
                                    '&:last-child': {
                                        paddingBottom: '8px',
                                    },
                                }}
                            >
                                <Avatar sx={{ bgcolor: 'background.default', mr: 1, width: 30, height: 30, }}>
                                    {getIcon(notification.type)}
                                </Avatar>
                                <Box flex={1}>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                        {notification.title}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {notification.description}
                                    </Typography>
                                </Box>

                                <Box textAlign="right" ml={1}>
                                    <Chip
                                        size="small"
                                        label={notification.time}
                                        color={getChipColor(notification.type)}
                                        variant="outlined"
                                    />
                                </Box>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                        No notifications for selected date.
                    </Typography>
                )}
            </Stack>
        </Box>
    );
};

export default Notification;
