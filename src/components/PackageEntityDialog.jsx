import React, { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Input from '../custom/Input';
import { CustomIconButton } from '../custom/Button';
import axios from 'axios';
import { API_BASE_URL } from '../utils/apiConfig';
import Cookies from 'js-cookie';
import { Box, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';

export default function PackageEntityDialog({ open, handleClose, onSuccess, viewMode = false, editMode = false, rowData = null }) {
    const [fields, setFields] = useState({
        title: '',
        about: '',
        serviceId: '',
        subServiceId: '',
        date: '',
        duration: '',
        price: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [allServicesAndSubServicesName, setAllServicesAndSubServicesName] = useState([]);
    const [servicesLoading, setServicesLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setError(null);
            setFile(null);
        }
        fetchAllServicesAndSubServicesName();
    }, [open, viewMode, editMode, rowData]);

    useEffect(() => {
        if (open && allServicesAndSubServicesName.length > 0) {
            if ((viewMode || editMode) && rowData) {
                console.log("Row data in dialog:", rowData);
                setFields({
                    title: rowData.title || rowData.name || '',
                    about: rowData.about || '',
                    serviceId: rowData.service?._id || '',
                    subServiceId: rowData.subService?._id || '',
                    date: rowData.date ? (typeof rowData.date === 'string' ? rowData.date.slice(0, 10) : new Date(rowData.date).toISOString().slice(0, 10)) : '',
                    duration: rowData.duration || '',
                    price: rowData.price || ''
                });
            } else {
                setFields({
                    title: '',
                    about: '',
                    serviceId: '',
                    subServiceId: '',
                    date: '',
                    duration: '',
                    price: ''
                });
            }
        }
    }, [open, viewMode, editMode, rowData, allServicesAndSubServicesName]);
    useEffect(() => {
        if (
            open &&
            (editMode || viewMode) &&
            rowData &&
            allServicesAndSubServicesName.length > 0
        ) {
            setFields(prev => ({
                ...prev,
                serviceId: rowData.service?._id || '',
                subServiceId: rowData.subService?._id || '',
            }));
        }
        // eslint-disable-next-line
    }, [open, editMode, viewMode, rowData, allServicesAndSubServicesName]);

    const fetchAllServicesAndSubServicesName = async () => {
        setServicesLoading(true);
        try {
            const token = Cookies.get('token');
            const response = await axios.get(`${API_BASE_URL}/stylist/get-services`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response?.data?.status === 200) {
                const grouped = {};
                (response.data.data || []).forEach(item => {
                    const service = item.service;
                    const subService = item.subService;
                    if (!grouped[service.name]) {
                        grouped[service.name] = {
                            ...service,
                            subServices: [],
                        };
                    }
                    grouped[service.name].subServices.push(subService);
                });
                setAllServicesAndSubServicesName(Object.values(grouped));
            } else {
                setAllServicesAndSubServicesName([]);
            }
        } catch (err) {
            setAllServicesAndSubServicesName([]);
        } finally {
            setServicesLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields({ ...fields, [name]: value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0] || null);
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = Cookies.get('token');
            if (editMode && rowData && rowData._id) {
                const patchData = {
                    title: fields.title,
                    about: fields.about,
                    serviceId: fields.serviceId,
                    subServiceId: fields.subServiceId,
                    date: fields.date,
                    duration: fields.duration,
                    price: fields.price,
                };
                await axios.patch(`${API_BASE_URL}/package/update/${rowData._id}`, patchData, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                });
            } else if (!editMode) {
                const formData = new FormData();
                formData.append('title', fields.title);
                formData.append('about', fields.about);
                formData.append('serviceId', fields.serviceId);
                formData.append('subServiceId', fields.subServiceId);
                formData.append('date', fields.date);
                formData.append('duration', fields.duration);
                formData.append('price', fields.price);
                if (file) formData.append('files', file);
                await axios.post(`${API_BASE_URL}/package/create`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
            }
            setLoading(false);
            if (onSuccess) onSuccess();
            handleClose();
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Failed to add package');
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
            <DialogTitle>
                {viewMode ? 'View Package Details' : editMode ? 'Update Package' : 'Add New Package'}
            </DialogTitle>
            <DialogContent>
                {viewMode ? (
                    <Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">Title</Typography>
                            <Typography variant="body1">{rowData?.title || rowData?.name || 'N/A'}</Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">About</Typography>
                            <Typography variant="body1">{rowData?.about || 'N/A'}</Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">Service</Typography>
                            <Typography variant="body1">{rowData?.service?.name || rowData?.serviceName || 'N/A'}</Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">Sub Service</Typography>
                            <Typography variant="body1">{rowData?.subService?.name || rowData?.subServiceName || 'N/A'}</Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                            <Typography variant="body1">{rowData?.date ? new Date(rowData.date).toLocaleDateString() : 'N/A'}</Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">Duration (min)</Typography>
                            <Typography variant="body1">{rowData?.duration !== undefined ? rowData.duration : 'N/A'}</Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
                            <Typography variant="body1">{rowData?.createdAt ? new Date(rowData.createdAt).toLocaleDateString() : 'N/A'}</Typography>
                        </Box>
                    </Box>
                ) : (
                    <>
                        <Input placeholder="Title" name="title" value={fields.title} onChange={handleChange} fullWidth margin="normal" />
                        <Input placeholder="About" name="about" value={fields.about} onChange={handleChange} fullWidth margin="normal" />
                        <Box mt={2} mb={2}>
                            <label style={{ fontWeight: 500 }}>Service Name</label>
                            <select
                                name="serviceId"
                                value={fields.serviceId}
                                onChange={e => {
                                    setFields({ ...fields, serviceId: e.target.value, subServiceId: '' });
                                }}
                                style={{ width: '100%', padding: '8px', marginTop: 4 }}
                                disabled={servicesLoading}
                            >
                                <option value="">{servicesLoading ? 'Loading services...' : 'Select Service'}</option>
                                {allServicesAndSubServicesName.map(service => (
                                    <option key={service._id} value={service._id}>{service.name}</option>
                                ))}
                            </select>
                        </Box>
                        <Box mt={2} mb={2}>
                            <label style={{ fontWeight: 500 }}>Sub Service Name</label>
                            <select
                                name="subServiceId"
                                value={fields.subServiceId}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '8px', marginTop: 4 }}
                                disabled={servicesLoading || !fields.serviceId}
                            >
                                <option value="">{
                                    servicesLoading ? 'Loading sub-services...' :
                                        !fields.serviceId ? 'Select a service first' :
                                            'Select Sub Service'
                                }</option>
                                {(allServicesAndSubServicesName.find(s => s._id === fields.serviceId)?.subServices || []).map(sub => (
                                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                                ))}
                            </select>
                        </Box>
                        <Input placeholder="Date" name="date" type="date" value={fields.date} onChange={handleChange} fullWidth margin="normal" />
                        <Input placeholder="Duration (min)" name="duration" type="number" value={fields.duration} onChange={handleChange} fullWidth margin="normal" />
                        <Input placeholder="Price" name="price" type="number" value={fields.price} onChange={handleChange} fullWidth margin="normal" />
                        <Box mt={2} mb={2}>
                            <input type="file" accept="image/*" onChange={handleFileChange} />
                        </Box>
                    </>
                )}
                {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
            </DialogContent>
            <DialogActions>
                <CustomIconButton icon={<Close />} color="red" text="Close" onClick={handleClose} />
                {!viewMode && <CustomIconButton text={editMode ? 'Update' : 'Add'} color="#6d295a" onClick={handleSubmit} loading={loading} />}
            </DialogActions>
        </Dialog>
    );
}
