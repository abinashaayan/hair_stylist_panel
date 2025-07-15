import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Input from '../../custom/Input';
import { CustomIconButton } from '../../custom/Button';
import axios from 'axios';
import { API_BASE_URL } from '../../utils/apiConfig';
import Cookies from 'js-cookie';

const getInitialFields = (type) => {
  switch (type) {
    case 'expertise':
      return { service: '', price: '', duration: '' };
    case 'experience':
      return { role: '', salon: '', duration: '' };
    case 'certificate':
      return { name: '', institution: '', year: '' };
    default:
      return {};
  }
};

const getDialogTitle = (type) => {
  switch (type) {
    case 'expertise':
      return 'Add New Expertise';
    case 'experience':
      return 'Add New Experience';
    case 'certificate':
      return 'Add New Certificate';
    default:
      return '';
  }
};

const getApiEndpoint = (type) => {
  switch (type) {
    case 'expertise':
      return '/stylist/add-expertise';
    case 'experience':
      return '/stylist/add-experience';
    case 'certificate':
      return '/stylist/add-certificate';
    default:
      return '';
  }
};

export default function ProfileEntityDialog({ open, type, onClose, profileData }) {
  const [fields, setFields] = useState(getInitialFields(type));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  console.log(profileData,'profileData')

  React.useEffect(() => {
    if (open) {
      setFields(getInitialFields(type));
      setError(null);
    }
  }, [open, type]);

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = Cookies.get('token');
      const endpoint = getApiEndpoint(type);
      await axios.post(`${API_BASE_URL}${endpoint}`, fields, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Failed to add entity');
    }
  };


  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{getDialogTitle(type)}</DialogTitle>
      <DialogContent>
        {type === 'expertise' && (
          <>
            <Input placeholder="Service" name="service" value={fields.service} onChange={handleChange} />
            <Input placeholder="Price" name="price" type="number" value={fields.price} onChange={handleChange} />
            <Input placeholder="Duration (min)" name="duration" type="number" value={fields.duration} onChange={handleChange} />
          </>
        )}
        {type === 'experience' && (
          <>
            <Input placeholder="Role" name="role" value={fields.role} onChange={handleChange} />
            <Input placeholder="Salon" name="salon" value={fields.salon} onChange={handleChange} />
            <Input placeholder="Duration" name="duration" value={fields.duration} onChange={handleChange} />
          </>
        )}
        {type === 'certificate' && (
          <>
            <Input placeholder="Certificate Name" name="name" value={fields.name} onChange={handleChange} />
            <Input placeholder="Institution" name="institution" value={fields.institution} onChange={handleChange} />
            <Input placeholder="Year" name="year" type="number" value={fields.year} onChange={handleChange} />
          </>
        )}
        {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
      </DialogContent>
      <DialogActions>
        <CustomIconButton text="Cancel" color="#bdbdbd" variant="outlined" onClick={onClose} />
        <CustomIconButton text="Submit" color="#6d295a" onClick={handleSubmit} loading={loading} />
      </DialogActions>
    </Dialog>
  );
}
