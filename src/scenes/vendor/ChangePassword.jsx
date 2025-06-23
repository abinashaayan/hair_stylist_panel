import React, { useState } from 'react';
import {
    Box,
    Typography,
    useTheme,
    TextField,
    Button,
    Paper,
    Tabs,
    Tab,
    Alert,
    CircularProgress,
    InputAdornment,
    IconButton,
} from "@mui/material";
import { tokens } from "../../theme";
import { Header } from '../../components';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const ChangePassword = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [activeTab, setActiveTab] = useState(0);
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState({ show: false, type: 'info', message: '' });
    const [showPassword, setShowPassword] = useState({
        current: false,
        new: false,
        confirm: false
    });

    // Direct Change Password States
    const [directChangeForm, setDirectChangeForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Forgot Password States
    const [forgotPasswordStep, setForgotPasswordStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [forgotPasswordForm, setForgotPasswordForm] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [token, setToken] = useState('');

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setAlert({ show: false, message: '', type: 'info' });
        setForgotPasswordStep(1);
    };

    const togglePasswordVisibility = (field) => {
        setShowPassword(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    // Direct Password Change
    const handleDirectChange = async (e) => {
        e.preventDefault();
        
        // Validation
        if (directChangeForm.newPassword !== directChangeForm.confirmPassword) {
            setAlert({
                show: true,
                type: 'error',
                message: 'New passwords do not match!'
            });
            return;
        }

        setLoading(true);
        try {
            // Add your direct password change API call here
            // const response = await axios.post('/api/auth/change-password', {
            //     currentPassword: directChangeForm.currentPassword,
            //     newPassword: directChangeForm.newPassword
            // });

            setAlert({
                show: true,
                type: 'success',
                message: 'Password changed successfully!'
            });
            setDirectChangeForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            setAlert({
                show: true,
                type: 'error',
                message: error.response?.data?.message || 'Failed to change password'
            });
        }
        setLoading(false);
    };

    // Forgot Password Flow
    const handleSendEmail = async () => {
        if (!forgotPasswordForm.email) {
            setAlert({
                show: true,
                type: 'error',
                message: 'Please enter your email'
            });
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:3512/api/auth/send-email', {
                email: forgotPasswordForm.email,
                role: 'stylist'
            });
            
            setAlert({
                show: true,
                type: 'success',
                message: 'OTP sent to your email!'
            });
            setForgotPasswordStep(2);
        } catch (error) {
            setAlert({
                show: true,
                type: 'error',
                message: error.response?.data?.message || 'Failed to send OTP'
            });
        }
        setLoading(false);
    };

    const handleVerifyOTP = async () => {
        if (!forgotPasswordForm.otp) {
            setAlert({
                show: true,
                type: 'error',
                message: 'Please enter OTP'
            });
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('http://localhost:3512/api/auth/verify-otp', {
                otp: forgotPasswordForm.otp,
                role: 'stylist'
            });
            
            setToken(response.data.token);
            setAlert({
                show: true,
                type: 'success',
                message: 'OTP verified successfully!'
            });
            setForgotPasswordStep(3);
        } catch (error) {
            setAlert({
                show: true,
                type: 'error',
                message: error.response?.data?.message || 'Invalid OTP'
            });
        }
        setLoading(false);
    };

    const handleResetPassword = async () => {
        if (forgotPasswordForm.newPassword !== forgotPasswordForm.confirmPassword) {
            setAlert({
                show: true,
                type: 'error',
                message: 'Passwords do not match!'
            });
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:3512/api/auth/reset-password', {
                token,
                newPassword: forgotPasswordForm.newPassword
            });
            
            setAlert({
                show: true,
                type: 'success',
                message: 'Password reset successfully!'
            });
            setForgotPasswordStep(1);
            setForgotPasswordForm({
                email: '',
                otp: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            setAlert({
                show: true,
                type: 'error',
                message: error.response?.data?.message || 'Failed to reset password'
            });
        }
        setLoading(false);
    };

    const renderForgotPasswordStep = () => {
        switch (forgotPasswordStep) {
            case 1:
                return (
                    <Box component="form" mt={2}>
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            value={forgotPasswordForm.email}
                            onChange={(e) => setForgotPasswordForm(prev => ({ ...prev, email: e.target.value }))}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleSendEmail}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Send OTP'}
                        </Button>
                    </Box>
                );
            case 2:
                return (
                    <Box component="form" mt={2}>
                        <TextField
                            fullWidth
                            label="Enter OTP"
                            variant="outlined"
                            value={forgotPasswordForm.otp}
                            onChange={(e) => setForgotPasswordForm(prev => ({ ...prev, otp: e.target.value }))}
                            sx={{ mb: 2 }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleVerifyOTP}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Verify OTP'}
                        </Button>
                    </Box>
                );
            case 3:
                return (
                    <Box component="form" mt={2}>
                        <TextField
                            fullWidth
                            type={showPassword.new ? 'text' : 'password'}
                            label="New Password"
                            variant="outlined"
                            value={forgotPasswordForm.newPassword}
                            onChange={(e) => setForgotPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                            sx={{ mb: 2 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => togglePasswordVisibility('new')}>
                                            {showPassword.new ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            type={showPassword.confirm ? 'text' : 'password'}
                            label="Confirm New Password"
                            variant="outlined"
                            value={forgotPasswordForm.confirmPassword}
                            onChange={(e) => setForgotPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            sx={{ mb: 2 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => togglePasswordVisibility('confirm')}>
                                            {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleResetPassword}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Reset Password'}
                        </Button>
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Box m="20px">
            <Header title="Change Password" subtitle="Update your account password" />
            <Paper sx={{ backgroundColor: colors.primary[400], p: "30px", borderRadius: "4px" }}>
                {alert.show && (
                    <Alert 
                        severity={alert.type} 
                        sx={{ mb: 2 }}
                        onClose={() => setAlert({ show: false, message: '', type: 'info' })}
                    >
                        {alert.message}
                    </Alert>
                )}

                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
                >
                    <Tab label="Change Password" />
                    <Tab label="Forgot Password" />
                </Tabs>

                {activeTab === 0 ? (
                    <Box component="form" onSubmit={handleDirectChange}>
                        <TextField
                            fullWidth
                            type={showPassword.current ? 'text' : 'password'}
                            label="Current Password"
                            variant="outlined"
                            value={directChangeForm.currentPassword}
                            onChange={(e) => setDirectChangeForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                            sx={{ mb: 2 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => togglePasswordVisibility('current')}>
                                            {showPassword.current ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            type={showPassword.new ? 'text' : 'password'}
                            label="New Password"
                            variant="outlined"
                            value={directChangeForm.newPassword}
                            onChange={(e) => setDirectChangeForm(prev => ({ ...prev, newPassword: e.target.value }))}
                            sx={{ mb: 2 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => togglePasswordVisibility('new')}>
                                            {showPassword.new ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <TextField
                            fullWidth
                            type={showPassword.confirm ? 'text' : 'password'}
                            label="Confirm New Password"
                            variant="outlined"
                            value={directChangeForm.confirmPassword}
                            onChange={(e) => setDirectChangeForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                            sx={{ mb: 2 }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => togglePasswordVisibility('confirm')}>
                                            {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Button
                            fullWidth
                            variant="contained"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : 'Change Password'}
                        </Button>
                    </Box>
                ) : (
                    renderForgotPasswordStep()
                )}
            </Paper>
        </Box>
    );
};

export default ChangePassword;