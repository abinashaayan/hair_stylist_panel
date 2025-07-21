import React, { useState, useEffect } from 'react';
import {
    Box,
    Alert,
    CircularProgress,
    useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import { Header } from '../../components';
import axios from 'axios';
import Cookies from "js-cookie";
import { API_BASE_URL } from '../../utils/apiConfig';
import { allAppointmentStatusTableColumns } from '../../custom/TableColumns';
import CustomTable from '../../custom/Table';

const AppointmentStatus = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const handleDelete = () => { };
    const handleView = () => { };

    const handleStatusUpdate = async (appointmentId, newStatus) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.patch(
                `${API_BASE_URL}/admin/appointments/${appointmentId}/status`,
                { status: newStatus },
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );
            console.log('Appointment status updated successfully', response?.data);
            setAppointments((prev) =>
                prev.map((appt) =>
                    appt._id === appointmentId ? { ...appt, status: newStatus } : appt
                )
            );
        } catch (err) {
            setError('Failed to update appointment status');
        } finally {
            setLoading(false);
        }
    };

    const authToken = Cookies.get("token");

    useEffect(() => {
        const fetchAppointments = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(`${API_BASE_URL}/admin/appointments`, {
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
        fetchAppointments();
    }, []);

    const columns = allAppointmentStatusTableColumns({ handleDelete, handleView, handleStatusUpdate });

    return (
        <Box m="20px">
            <Header title="Appointment Status" />
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
                    noRowsMessage="No appointments found."
                />
            )}
        </Box>
    );
};

export default AppointmentStatus;