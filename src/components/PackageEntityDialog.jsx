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
import { Box, Chip, Stack, Typography } from '@mui/material';
import { Close } from '@mui/icons-material';
import SelectInput from '../custom/Select';
import MultiSelectWithCheckbox from '../custom/MultiSelectWithCheckbox';

export default function PackageEntityDialog({ open, handleClose, onSuccess, viewMode = false, editMode = false, rowData = null }) {
    const [fields, setFields] = useState({
        title: '',
        about: '',
        serviceId: '',
        subServiceIds: [],
        date: '',
        duration: '',
        price: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [servicesLoading, setServicesLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [subServices, setSubServices] = useState([]);
    const [preview, setPreview] = useState(null);

    const authToken = Cookies.get("token");

    useEffect(() => {
        if (open) {
            setError(null);
            setFile(null);
            setPreview(null);
        }
        fetchAllServices();
    }, [open, viewMode, editMode, rowData]);

    useEffect(() => {
        if (open) {
            if (open && (viewMode || editMode) && rowData) {
                console.log("Edit/View Mode Row Data:", rowData);
                setFields({
                    title: rowData.title || rowData.name || '',
                    about: rowData.about || '',
                    serviceId: rowData.serviceId?._id || '',
                    subServiceIds: Array.isArray(rowData.subService)
                        ? rowData.subService.map((s) => s?._id)
                        : [],
                    date: Array.isArray(rowData.date)
                        ? new Date(rowData.date[0]).toISOString().slice(0, 10)
                        : typeof rowData.date === 'string'
                            ? rowData.date.slice(0, 10)
                            : '',
                    duration: rowData.duration || '',
                    price: rowData.price || '',
                });
                if (rowData.coverImage) { setPreview(rowData.coverImage); }
                if (rowData.serviceId?._id) { fetchSubServicesByServiceId(rowData.serviceId._id); }
            } else {
                setFields({
                    title: '',
                    about: '',
                    serviceId: '',
                    subServiceIds: [],
                    date: '',
                    duration: '',
                    price: ''
                });
                setSubServices([]);
            }

            setError(null);
            setFile(null);
        }
    }, [open, viewMode, editMode, rowData]);

    const serviceOptions = services.map((item) => ({
        label: item.name,
        value: item._id,
    }));

    const subServiceOptions = subServices.map((item) => ({
        label: item.name,
        value: item._id,
    }));

    const fetchAllServices = async () => {
        setServicesLoading(true);
        try {
            const response = await axios.get(`${API_BASE_URL}/service/get-active`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (response.data?.status === 200) {
                setServices(response.data.data || []);
                fetchSubServicesByServiceId(response?.data?.data?._id);
            } else {
                setServices([]);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
            setServices([]);
        } finally {
            setServicesLoading(false);
        }
    };

    const fetchSubServicesByServiceId = async (serviceId) => {
        if (!serviceId) return setSubServices([]);
        try {
            const response = await axios.get(`${API_BASE_URL}/service/subservice/active/get/${serviceId}`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });
            if (response.data?.status === 200) {
                const cleanedSubServices = response.data.data || [];
                setSubServices(cleanedSubServices);
            } else {
                setSubServices([]);
            }
        } catch (error) {
            console.error("Error fetching sub-services:", error);
            setSubServices([]);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFields({ ...fields, [name]: value });
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile || null);
        if (selectedFile) {
            setPreview(URL.createObjectURL(selectedFile));
        } else {
            setPreview(null);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('title', fields.title);
            formData.append('about', fields.about);
            formData.append('serviceId', fields.serviceId);
            formData.append('subServiceId', JSON.stringify(fields.subServiceIds));
            formData.append('date', fields.date);
            formData.append('duration', fields.duration);
            formData.append('price', fields.price);
            if (file) formData.append('files', file);

            if (editMode && rowData && rowData._id) {
                await axios.patch(`${API_BASE_URL}/package/update/${rowData._id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${authToken}`,
                    },
                });
            } else {
                await axios.post(`${API_BASE_URL}/package/create`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${authToken}`,
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
                            <Typography variant="body1" fontWeight="500">{rowData?.title || rowData?.name || 'N/A'}</Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">About</Typography>
                            <Typography variant="body1">{rowData?.about || 'N/A'}</Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">Service</Typography>
                            {rowData?.serviceId?.name ? (
                                <Chip
                                    label={rowData.serviceId.name}
                                    sx={{
                                        backgroundColor: '#6d295a',
                                        color: '#fff',
                                         fontWeight: 'bold',
                                        borderRadius: '8px'
                                    }}
                                />
                            ) : (
                                <Typography variant="body2" color="text.secondary">N/A</Typography>
                            )}
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">Sub Services</Typography>
                            {Array.isArray(rowData?.subService) && rowData.subService.length > 0 ? (
                                <Stack direction="row" spacing={1} flexWrap="wrap">
                                    {rowData?.subService?.map((s, i) => (
                                        <Chip
                                            key={s._id || i}
                                            label={s.name}
                                            size="small"
                                            sx={{
                                                bgcolor: 'info.main',
                                                color: 'white',
                                                fontWeight: 'bold',
                                            }}
                                        />
                                    ))}
                                </Stack>
                            ) : (
                                <Typography variant="body2" color="text.secondary">N/A</Typography>
                            )}
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">Date</Typography>
                            <Typography variant="body1">
                                {Array.isArray(rowData?.date)
                                    ? rowData.date.map((d, i) => new Date(d).toLocaleDateString()).join(', ')
                                    : rowData?.date
                                        ? new Date(rowData.date).toLocaleDateString()
                                        : 'N/A'}
                            </Typography>
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
                        <Box mb={1}>
                            <label style={{ fontWeight: 500 }}>Title</label>
                            <Input placeholder="Title" name="title" value={fields.title} onChange={handleChange} fullWidth margin="normal" />
                        </Box>
                        <Box mb={1}>
                            <label style={{ fontWeight: 500 }}>About</label>
                            <Input name="about" value={fields.about} onChange={handleChange} placeholder="About" multiline rows={2} />
                        </Box>
                        <Box mb={1}>
                            <Box mb={1}>
                                <SelectInput
                                    name="serviceId"
                                    value={fields.serviceId}
                                    onChange={(e) => {
                                        const selectedId = e.target.value;
                                        setFields({ ...fields, serviceId: selectedId, subServiceIds: [] });
                                        fetchSubServicesByServiceId(selectedId);
                                    }}
                                    options={serviceOptions}
                                    placeholder={servicesLoading ? 'Loading services...' : 'Select Service'}
                                    disabled={servicesLoading}
                                />
                            </Box>
                        </Box>
                        <Box mb={1}>
                            <MultiSelectWithCheckbox
                                options={subServiceOptions}
                                placeholder="Select Sub Services"
                                value={subServiceOptions.filter(opt =>
                                    fields.subServiceIds.includes(opt.value)
                                )}
                                onChange={(newValue) => {
                                    setFields({
                                        ...fields,
                                        subServiceIds: newValue.map(item => item.value),
                                    });
                                }}
                                disabled={!fields.serviceId}
                            />
                        </Box>
                        <Box mb={1}>
                            <label style={{ fontWeight: 500 }}>Date</label>
                            <Input placeholder="Date" name="date" type="date" value={fields.date} onChange={handleChange} fullWidth margin="normal" />
                        </Box>

                        <Box mb={1}>
                            <label style={{ fontWeight: 500 }}>Duration (min)</label>
                            <Input placeholder="Duration (min)" name="duration" type="number" value={fields.duration} onChange={handleChange} fullWidth margin="normal" />
                        </Box>

                        <Box mb={1}>
                            <label style={{ fontWeight: 500 }}>Price</label>
                            <Input placeholder="Price" name="price" type="number" value={fields.price} onChange={handleChange} fullWidth margin="normal" />
                        </Box>

                        <Box mb={1}>
                            <label style={{ fontWeight: 500 }}>Image</label>
                            <Box mt={2} mb={2}>
                                <input type="file" accept="image/*" onChange={handleFileChange} />
                            </Box>
                            {preview && (
                                <img
                                    src={preview}
                                    alt="Preview"
                                    style={{
                                        width: '120px',
                                        height: '120px',
                                        objectFit: 'cover',
                                        borderRadius: 8,
                                        border: '1px solid #ccc',
                                    }}
                                />
                            )}
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
