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
import { MenuItem, Select, FormControl, InputLabel, CircularProgress, Box } from '@mui/material';

export default function ServiceManagementEntityDialog({ open, handleClose, onSuccess, viewMode = false, rowData = null }) {
  const [services, setServices] = useState([]);
  const [fields, setFields] = useState({ serviceId: '', subServiceName: '', price: '', duration: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchingServices, setFetchingServices] = useState(false);

  useEffect(() => {
    if (open) {
      if (viewMode && rowData) {
        setFields({
          serviceId: rowData.serviceId || '',
          subServiceName: rowData.subServiceName || '',
          price: rowData.price || '',
          duration: rowData.duration || '',
        });
      } else {
        setFields({ serviceId: '', subServiceName: '', price: '', duration: '' });
      }
      setError(null);
      fetchServices();
    }
    // eslint-disable-next-line
  }, [open, viewMode, rowData]);

  const fetchServices = async () => {
    setFetchingServices(true);
    try {
      const token = Cookies.get('token');
      const response = await axios.get(`${API_BASE_URL}/service/admin/get`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (response?.data?.status === 200) {
        setServices(response.data.allServices || []);
      } else {
        setServices([]);
      }
    } catch (err) {
      setServices([]);
    } finally {
      setFetchingServices(false);
    }
  };

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get('token');
      await axios.post(`${API_BASE_URL}/stylist/add-service`, {
        serviceId: fields.serviceId,
        subServiceName: fields.subServiceName,
        price: Number(fields.price),
        duration: Number(fields.duration),
      }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      if (onSuccess) onSuccess();
      handleClose();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to add service management');
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>{viewMode ? 'View Service Management' : 'Add New Service Management'}</DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="service-select-label">Service</InputLabel>
          <Select
            labelId="service-select-label"
            name="serviceId"
            value={fields.serviceId}
            label="Service"
            onChange={handleChange}
            disabled={fetchingServices || viewMode}
          >
            {fetchingServices ? (
              <MenuItem value=""><Box display="flex" alignItems="center"><CircularProgress size={18} sx={{ mr: 1 }} />Loading...</Box></MenuItem>
            ) : (
              services.map((service) => (
                <MenuItem key={service._id} value={service._id}>{service.name}</MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        <Input placeholder="Sub Service Name" name="subServiceName" value={fields.subServiceName} onChange={handleChange} fullWidth margin="normal" disabled={viewMode} />
        <Input placeholder="Price" name="price" type="number" value={fields.price} onChange={handleChange} fullWidth margin="normal" disabled={viewMode} />
        <Input placeholder="Duration (min)" name="duration" type="number" value={fields.duration} onChange={handleChange} fullWidth margin="normal" disabled={viewMode} />
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </DialogContent>
      <DialogActions>
        <CustomIconButton text="Close" color="#bdbdbd" variant="outlined" onClick={handleClose} />
        {!viewMode && <CustomIconButton text="Add" color="#6d295a" onClick={handleSubmit} loading={loading} />}
      </DialogActions>
    </Dialog>
  );
}
