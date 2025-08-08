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
import { Box, Chip, Stack, Typography, Switch, FormControlLabel, Accordion, AccordionSummary, AccordionDetails, Divider } from '@mui/material';
import { Close, ExpandMore, AttachMoney, TrendingUp, LocalOffer, History } from '@mui/icons-material';
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
        price: '',
        discount: '',
        servicePricing: []
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const [servicesLoading, setServicesLoading] = useState(false);
    const [services, setServices] = useState([]);
    const [subServices, setSubServices] = useState([]);
    const [preview, setPreview] = useState(null);
    const [servicePricing, setServicePricing] = useState([]);
    const [promotionalPricing, setPromotionalPricing] = useState({
        name: '',
        description: '',
        discountPercentage: '',
        startDate: '',
        endDate: '',
        applicableServices: [],
        applicableSubServices: [],
        clientGroups: []
    });

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
                    discount: rowData.discount || '',
                    servicePricing: rowData.servicePricing || []
                });
                if (rowData.coverImage) { setPreview(rowData.coverImage); }
                if (rowData.serviceId?._id) { fetchSubServicesByServiceId(rowData.serviceId._id); }
                if (rowData.servicePricing) {
                    const transformedServicePricing = rowData.servicePricing.map(pricing => ({
                        serviceId: pricing.serviceId?._id || pricing.serviceId,
                        subServiceId: pricing.subServiceId?._id || pricing.subServiceId,
                        currentPrice: pricing.currentPrice,
                        basePrice: pricing.basePrice,
                        isDynamic: pricing.isDynamic,
                        peakHourMultiplier: pricing.peakHourMultiplier,
                        demandMultiplier: pricing.demandMultiplier,
                        reason: pricing.reason
                    }));
                    setServicePricing(transformedServicePricing);
                }
            } else {
                setFields({
                    title: '',
                    about: '',
                    serviceId: '',
                    subServiceIds: [],
                    date: '',
                    duration: '',
                    price: '',
                    discount: '',
                    servicePricing: []
                });
                setSubServices([]);
                setServicePricing([]);
            }

            setError(null);
            setFile(null);
        }
    }, [open, viewMode, editMode, rowData]);

    const serviceOptions = services?.map((item) => ({
        label: item.name,
        value: item._id,
    }));

    const subServiceOptions = subServices?.map((item) => ({
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

    const addServicePricing = () => {
        const newPricing = {
            serviceId: fields.serviceId || '',
            subServiceId: '',
            currentPrice: '',
            basePrice: '',
            isDynamic: false,
            peakHourMultiplier: 1.0,
            demandMultiplier: 1.0,
            reason: ''
        };
        setServicePricing([...servicePricing, newPricing]);
    };

    const updateServicePricing = (index, field, value) => {
        const updatedPricing = [...servicePricing];
        updatedPricing[index] = { ...updatedPricing[index], [field]: value };
        setServicePricing(updatedPricing);
    };

    const removeServicePricing = (index) => {
        setServicePricing(servicePricing.filter((_, i) => i !== index));
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
            formData.append('discount', fields.discount);

            if (servicePricing.length > 0) {
                const transformedServicePricing = servicePricing.map(pricing => ({
                    serviceId: pricing.serviceId,
                    subServiceId: pricing.subServiceId,
                    currentPrice: pricing.currentPrice,
                    basePrice: pricing.basePrice,
                    isDynamic: pricing.isDynamic,
                    peakHourMultiplier: pricing.peakHourMultiplier,
                    demandMultiplier: pricing.demandMultiplier,
                    reason: pricing.reason
                }));
                formData.append('servicePricing', JSON.stringify(transformedServicePricing));
            }

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

    const handlePromotionalPricingSubmit = async () => {
        if (!rowData?._id) return;

        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/package/${rowData._id}/promotional-pricing`, promotionalPricing, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`,
                },
            });
            setLoading(false);
            if (onSuccess) onSuccess();
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || 'Failed to add promotional pricing');
        }
    };


    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
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
                                    sx={{ backgroundColor: '#6d295a', color: '#fff', fontWeight: 'bold', borderRadius: '8px' }}
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
                                            sx={{ bgcolor: 'info.main', color: 'white', fontWeight: 'bold' }}
                                        />
                                    ))}
                                </Stack>
                            ) : (
                                <Typography variant="body2" color="text.secondary">N/A</Typography>
                            )}
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">Date(s)</Typography>
                            <Typography variant="body1">
                                {Array.isArray(rowData?.date)
                                    ? rowData.date.map((d, i) => new Date(d).toLocaleDateString()).join(', ')
                                    : rowData?.date
                                        ? new Date(rowData.date).toLocaleDateString()
                                        : 'N/A'}
                            </Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">Price</Typography>
                            <Typography variant="body1">₹{rowData?.price ?? 'N/A'}</Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">Discount</Typography>
                            <Typography variant="body1">{rowData?.discount ?? 0}% OFF</Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">Duration (min)</Typography>
                            <Typography variant="body1">{rowData?.duration !== undefined ? rowData.duration : 'N/A'}</Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">Cover Image</Typography>
                            {rowData?.coverImage ? (
                                <img src={rowData.coverImage} alt="Cover" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8, border: '1px solid #ccc' }} />
                            ) : (
                                <Typography variant="body2" color="text.secondary">N/A</Typography>
                            )}
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
                            <Typography variant="body1">{rowData?.createdAt ? new Date(rowData.createdAt).toLocaleString() : 'N/A'}</Typography>
                        </Box>
                        <Box mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">Updated At</Typography>
                            <Typography variant="body1">{rowData?.updatedAt ? new Date(rowData.updatedAt).toLocaleString() : 'N/A'}</Typography>
                        </Box>

                        {/* Service Pricing Section */}
                        {rowData?.servicePricing && rowData.servicePricing.length > 0 && (
                            <Accordion defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <AttachMoney />
                                        <Typography variant="subtitle1">Service Pricing</Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {rowData.servicePricing.map((pricing, index) => (
                                        <Box key={index} mb={2} p={2} border="1px solid #e0e0e0" borderRadius={1}>
                                            <Typography variant="subtitle2" fontWeight="bold">Service Pricing {index + 1}</Typography>
                                            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">Service</Typography>
                                                    <Typography variant="body2">{pricing.serviceId?.name || 'N/A'}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">Sub Service</Typography>
                                                    <Typography variant="body2">{pricing.subServiceId?.name || 'N/A'}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">Current Price</Typography>
                                                    <Typography variant="body2">₹{pricing.currentPrice}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">Base Price</Typography>
                                                    <Typography variant="body2">₹{pricing.basePrice}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">Dynamic Pricing</Typography>
                                                    <Typography variant="body2">{pricing.isDynamic ? 'Yes' : 'No'}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">Peak Hour Multiplier</Typography>
                                                    <Typography variant="body2">{pricing.peakHourMultiplier}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">Demand Multiplier</Typography>
                                                    <Typography variant="body2">{pricing.demandMultiplier}</Typography>
                                                </Box>
                                                {pricing.reason && (
                                                    <Box>
                                                        <Typography variant="caption" color="text.secondary">Reason</Typography>
                                                        <Typography variant="body2">{pricing.reason}</Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        )}

                        {/* Promotional Pricing Section */}
                        {rowData?.promotionalPricing && rowData.promotionalPricing.length > 0 && (
                            <Accordion defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <LocalOffer />
                                        <Typography variant="subtitle1">Promotional Pricing</Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {rowData.promotionalPricing.map((promo, index) => (
                                        <Box key={index} mb={2} p={2} border="1px solid #e0e0e0" borderRadius={1}>
                                            <Typography variant="subtitle2" fontWeight="bold">{promo.name}</Typography>
                                            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2} mt={1}>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">Discount</Typography>
                                                    <Typography variant="body2">{promo.discountPercentage}% OFF</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">Status</Typography>
                                                    <Typography variant="body2">{promo.isActive ? 'Active' : 'Inactive'}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">Start Date</Typography>
                                                    <Typography variant="body2">{new Date(promo.startDate).toLocaleDateString()}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">End Date</Typography>
                                                    <Typography variant="body2">{new Date(promo.endDate).toLocaleDateString()}</Typography>
                                                </Box>
                                                {promo.description && (
                                                    <Box gridColumn="span 2">
                                                        <Typography variant="caption" color="text.secondary">Description</Typography>
                                                        <Typography variant="body2">{promo.description}</Typography>
                                                    </Box>
                                                )}
                                                {promo.applicableServices && promo.applicableServices.length > 0 && (
                                                    <Box gridColumn="span 2">
                                                        <Typography variant="caption" color="text.secondary">Applicable Services</Typography>
                                                        <Typography variant="body2">{promo.applicableServices.join(', ')}</Typography>
                                                    </Box>
                                                )}
                                                {promo.applicableSubServices && promo.applicableSubServices.length > 0 && (
                                                    <Box gridColumn="span 2">
                                                        <Typography variant="caption" color="text.secondary">Applicable Sub Services</Typography>
                                                        <Typography variant="body2">{promo.applicableSubServices.join(', ')}</Typography>
                                                    </Box>
                                                )}
                                                {promo.clientGroups && promo.clientGroups.length > 0 && (
                                                    <Box gridColumn="span 2">
                                                        <Typography variant="caption" color="text.secondary">Client Groups</Typography>
                                                        <Typography variant="body2">{promo.clientGroups.join(', ')}</Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Box>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        )}

                        {/* Price History Section */}
                        {rowData?.priceHistory && rowData.priceHistory.length > 0 && (
                            <Accordion defaultExpanded>
                                <AccordionSummary expandIcon={<ExpandMore />}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <History />
                                        <Typography variant="subtitle1">Price History</Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    {rowData.priceHistory.map((history, index) => (
                                        <Box key={index} mb={2} p={2} border="1px solid #e0e0e0" borderRadius={1}>
                                            <Typography variant="subtitle2" fontWeight="bold">{history.type || 'Price Update'} - {history.timestamp ? new Date(history.timestamp).toLocaleDateString() : ''}</Typography>
                                            <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">Previous Price</Typography>
                                                    <Typography variant="body2">₹{history.previousPrice ?? 'N/A'}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">New Price</Typography>
                                                    <Typography variant="body2">₹{history.newPrice ?? 'N/A'}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">Reason</Typography>
                                                    <Typography variant="body2">{history.reason || 'N/A'}</Typography>
                                                </Box>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary">Updated By</Typography>
                                                    <Typography variant="body2">{history.updatedBy || 'System'}</Typography>
                                                </Box>
                                            </Box>
                                        </Box>
                                    ))}
                                </AccordionDetails>
                            </Accordion>
                        )}
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
                            <label style={{ fontWeight: 500 }}>Discount (%)</label>
                            <Input placeholder="Discount" name="discount" type="number" value={fields.discount} onChange={handleChange} fullWidth margin="normal" />
                        </Box>

                        {/* Service Pricing Section */}
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Box display="flex" alignItems="center" gap={1}>
                                    <AttachMoney />
                                    <Typography variant="subtitle1">Service Pricing</Typography>
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box mb={2}>
                                    <CustomIconButton
                                        text="Add Service Pricing"
                                        color="#6d295a"
                                        onClick={addServicePricing}
                                        disabled={!fields.serviceId}
                                    />
                                </Box>

                                {servicePricing?.map((pricing, index) => (
                                    <Box key={index} mb={2} p={2} border="1px solid #e0e0e0" borderRadius={1}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                            <Typography variant="subtitle2" fontWeight="bold">Service Pricing {index + 1}</Typography>
                                            <CustomIconButton
                                                text="Remove"
                                                color="red"
                                                onClick={() => removeServicePricing(index)}
                                                size="small"
                                            />
                                        </Box>

                                        <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                                            <Box>
                                                <label style={{ fontWeight: 500, fontSize: '12px' }}>Service</label>
                                                <SelectInput
                                                    value={pricing.serviceId}
                                                    onChange={(e) => {
                                                        updateServicePricing(index, 'serviceId', e.target.value);
                                                        updateServicePricing(index, 'subServiceId', '');
                                                        fetchSubServicesByServiceId(e.target.value);
                                                    }}
                                                    options={serviceOptions}
                                                    placeholder="Select Service"
                                                />
                                            </Box>
                                            <Box>
                                                <label style={{ fontWeight: 500, fontSize: '12px' }}>Sub Service</label>
                                                <SelectInput
                                                    value={pricing.subServiceId}
                                                    onChange={(e) => updateServicePricing(index, 'subServiceId', e.target.value)}
                                                    options={subServiceOptions}
                                                    placeholder="Select Sub Service"
                                                    disabled={!pricing.serviceId}
                                                />
                                            </Box>
                                            <Box>
                                                <label style={{ fontWeight: 500, fontSize: '12px' }}>Current Price</label>
                                                <Input
                                                    placeholder="Current Price"
                                                    type="number"
                                                    value={pricing.currentPrice}
                                                    onChange={(e) => updateServicePricing(index, 'currentPrice', e.target.value)}
                                                />
                                            </Box>
                                            <Box>
                                                <label style={{ fontWeight: 500, fontSize: '12px' }}>Base Price</label>
                                                <Input
                                                    placeholder="Base Price"
                                                    type="number"
                                                    value={pricing.basePrice}
                                                    onChange={(e) => updateServicePricing(index, 'basePrice', e.target.value)}
                                                />
                                            </Box>
                                            <Box>
                                                <label style={{ fontWeight: 500, fontSize: '12px' }}>Peak Hour Multiplier</label>
                                                <Input
                                                    placeholder="1.0"
                                                    type="number"
                                                    step="0.1"
                                                    value={pricing.peakHourMultiplier}
                                                    onChange={(e) => updateServicePricing(index, 'peakHourMultiplier', e.target.value)}
                                                />
                                            </Box>
                                            <Box>
                                                <label style={{ fontWeight: 500, fontSize: '12px' }}>Demand Multiplier</label>
                                                <Input
                                                    placeholder="1.0"
                                                    type="number"
                                                    step="0.1"
                                                    value={pricing.demandMultiplier}
                                                    onChange={(e) => updateServicePricing(index, 'demandMultiplier', e.target.value)}
                                                />
                                            </Box>
                                            <Box>
                                                <label style={{ fontWeight: 500, fontSize: '12px' }}>Reason</label>
                                                <Input
                                                    placeholder="Pricing reason"
                                                    value={pricing.reason}
                                                    onChange={(e) => updateServicePricing(index, 'reason', e.target.value)}
                                                />
                                            </Box>
                                            <Box>
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            checked={pricing.isDynamic}
                                                            onChange={(e) => updateServicePricing(index, 'isDynamic', e.target.checked)}
                                                        />
                                                    }
                                                    label="Dynamic Pricing"
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </AccordionDetails>
                        </Accordion>

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
