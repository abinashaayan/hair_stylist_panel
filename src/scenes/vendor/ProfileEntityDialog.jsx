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
import { useSelector } from 'react-redux';

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

export default function ProfileEntityDialog({ open, type, onClose, profileData, onSuccess }) {
  const [fields, setFields] = useState(getInitialFields(type));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  const authToken = Cookies.get("token");
  const stylistId = useSelector(state => state.stylistProfile?.profile?._id);

  React.useEffect(() => {
    if (open) {
      setFields(getInitialFields(type));
      setError(null);
    }
  }, [open, type]);

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      if (type === 'experience') {
        await axios.patch(`${API_BASE_URL}/stylist/add-experience`, { newExperience: [fields] }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
        );
      } else if (type === 'expertise') {
        await axios.patch(`${API_BASE_URL}/stylist/add-expertise`, { newExpertise: [fields] }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
        );
      } else if (type === 'certificate') {
        if (!file) throw new Error('Please select a certificate file');
        const formData = new FormData();
        formData.append('files', file);
        await axios.post(`${API_BASE_URL}/stylist/${stylistId}/certificates`, formData, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        });
      } else {
        const endpoint = getApiEndpoint(type);
        await axios.post(`${API_BASE_URL}${endpoint}`, fields, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
        });
      }
      setLoading(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || err.message || 'Failed to add entity');
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{getDialogTitle(type)}</DialogTitle>
      <DialogContent>
        {type === 'expertise' && (
          <>
            <Input placeholder="Expertise" name="service" value={fields.service} onChange={handleChange} />
          </>
        )}
        {type === 'experience' && (
          <>
            <Input placeholder="Role" name="role" value={fields.role} onChange={handleChange} />
            <Input placeholder="Salon" name="salon" value={fields.salon} onChange={handleChange} />
            <Input placeholder="Duration (min)" name="duration" type="number" value={fields.duration} onChange={handleChange} />
          </>
        )}
        {type === 'certificate' && (
          <>
            <input type="file" accept="image/*" onChange={handleFileChange} style={{ marginTop: 8 }} />
            {file && (
              <img
                src={URL.createObjectURL(file)}
                alt="Certificate Preview"
                style={{ marginTop: 12, maxWidth: '100%', maxHeight: 180, borderRadius: 8, border: '1px solid #eee' }}
              />
            )}
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
