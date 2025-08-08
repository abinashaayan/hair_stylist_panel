import React, { useState, useEffect } from "react";
import { Box, Card, CardContent, Grid, Typography, Divider, Chip, useTheme, LinearProgress, CircularProgress, InputBase, IconButton, Dialog, DialogTitle, DialogContent, InputLabel, Select, MenuItem, DialogActions, Button, FormControlLabel, Switch } from "@mui/material";
import { tokens } from "../../theme";
import { Header } from "../../components";
import useStylistProfile from "../../hooks/useStylistProfile";
import { Close, PersonAdd, SearchOutlined } from "@mui/icons-material";
import { CustomIconButton } from "../../custom/Button";
import { Delete } from "lucide-react";
import Input from "../../custom/Input";
import { API_BASE_URL } from "../../utils/apiConfig";
import axios from "axios";
import MultiSelectWithCheckbox from "../../custom/MultiSelectWithCheckbox";
import SelectInput from '../../custom/Select';
import Cookies from 'js-cookie';
import { fetchStylistProfile } from "../../hooks/stylistProfileSlice";
import { useDispatch } from "react-redux";
import Alert from "../../custom/Alert";
import { showErrorToast, showSuccessToast } from "../../Toast";

const Services = () => {
  const [searchText, setSearchText] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [newService, setNewService] = useState({
    serviceId: "",
    subServiceIds: [],
    price: "",
    duration: "",
    isActive: true
  });

  const [services, setServices] = useState([]);
  const [subServices, setSubServices] = useState([]);
  const [alertOpen, setAlertOpen] = useState(false);

  const theme = useTheme();
  const dispatch = useDispatch();
  const authToken = Cookies.get("token");
  const colors = tokens(theme.palette.mode);
  const { profile, loading } = useStylistProfile();

  const handleSearch = (event) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    fetchAllServices();
  }, [authToken]);

  const serviceOptions = services?.map((item) => ({
    label: item.name,
    value: item._id,
  })) || [];

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

  const handleAddService = () => {
    setNewService({
      serviceId: "",
      subServiceId: "",
      price: "",
      duration: "",
      isActive: true
    });
    setOpenDialog(true);
  };

  const handleServiceChange = (e) => {
    const { name, value } = e.target;
    setNewService(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClose = () => {
    setOpenDialog(false);
    setNewService({
      serviceId: "",
      subServiceIds: [],
      price: "",
      duration: "",
      isActive: true
    });
    setSubServices([]);
  };

  const handleSubmitService = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        serviceId: newService.serviceId,
        subServiceId: newService.subServiceIds,
        price: Number(newService.price),
        duration: String(newService.duration),
        isActive: newService.isActive
      };
      const response = await axios.post(`${API_BASE_URL}/stylist/add-service`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      if (response.data.success) {
        showSuccessToast(response.data.message || "Service updated successfully!");
        setOpenDialog(false);
        dispatch(fetchStylistProfile());
      } else {
        showErrorToast(response.data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Update Error:", error);
    }
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    setAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    try {
      const response = await axios.delete(`${API_BASE_URL}/stylist/delete-service/${deletingId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        }
      });
      if (response?.data?.success) {
        showSuccessToast(response?.data?.message || "Service deleted successfully!");
      }
      dispatch(fetchStylistProfile());
    } catch (error) {
      console.log("Delete Error:", error);
      showErrorToast(error.message);
    } finally {
      setDeleting(false);
      setAlertOpen(false);
      setDeletingId(null);
    }
  };

  if (loading) return <CircularProgress />;

  return (
    <Box>
      {(loading || !profile) && <LinearProgress sx={{ mb: 2 }} />}
      <Header title="Services" />
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexDirection: { xs: "column", sm: "row" }, gap: 2, }}>
        <Box display="flex" alignItems="center" bgcolor={colors.primary[400]} sx={{ border: '1px solid purple', borderRadius: '10px', width: { xs: '100%', sm: 'auto' }, }}>
          <InputBase placeholder="Search Services" value={searchText} onChange={handleSearch} sx={{ ml: 2, flex: 1 }} />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchOutlined />
          </IconButton>
        </Box>
        <CustomIconButton icon={<PersonAdd />} text="Add New Service" fontWeight="bold" color="#6d295a" variant="outlined" onClick={handleAddService} sx={{ width: { xs: '100%', sm: 'auto' } }} />
      </Box>

      <Alert
        open={alertOpen}
        title="Delete Review"
        description="Are you sure you want to delete this service? This action cannot be undone."
        onClose={deletingId ? undefined : () => setAlertOpen(false)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        disableCancel={deleting}
      />

      {(!profile) ? null : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={12} lg={12}>
            <Grid container spacing={2}>
              {profile?.services?.length === 0 && (
                <Grid item xs={12}>
                  <Typography color="textSecondary">No services available.</Typography>
                </Grid>
              )}
              {profile?.services?.map((item, idx) => (
                <Grid item xs={12} sm={6} md={3} key={idx}>
                  <Box
                    sx={{
                      borderRadius: 3,
                      boxShadow: '0 2px 12px rgba(31,38,135,0.08)',
                      overflow: 'hidden',
                      background: theme.palette.mode === 'dark' ? colors.primary[900] : '#fff',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-6px) scale(1.04)',
                        boxShadow: '0 12px 32px 0 rgba(31, 38, 135, 0.18)',
                      },
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      p: 0,
                      minHeight: 190,
                      position: 'relative',
                    }}
                  >
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        zIndex: 3,
                        color: colors.redAccent[500],
                        backgroundColor: 'rgba(255,255,255,0.8)',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.9)',
                        }
                      }}
                      onClick={() => handleDelete(item._id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>

                    <Box sx={{ width: '100%', position: 'relative', minHeight: 120, background: theme.palette.mode === 'dark' ? colors.primary[800] : colors.primary[100] }}>
                      <Box sx={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        height: '60%',
                        background: theme.palette.mode === 'dark'
                          ? 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(109,41,90,0.85) 100%)'
                          : 'linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(109,41,90,0.85) 100%)',
                        borderRadius: '0 0 12px 12px',
                        zIndex: 1,
                      }} />
                      <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, px: 2, py: 1.5, zIndex: 2, color: '#fff', textAlign: 'center', }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ fontFamily: 'Poppins, sans-serif', textShadow: '0 2px 8px #000', color: '#fff' }}>
                          Service: {item.serviceDetails?.name || <span style={{ color: '#eee' }}>No Service</span>}
                        </Typography>
                        {item.subServiceDetails?.name && (
                          <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', textShadow: '0 1px 4px #000', opacity: 0.85, color: '#fff' }}>
                            Subservice: {item.subServiceDetails.name}
                          </Typography>
                        )}
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center', mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <span role="img" aria-label="price">💲</span>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#fff' }}>
                              <span style={{ fontWeight: 700 }}>${item.price}</span>
                            </Typography>
                          </Box>
                          <Divider orientation="vertical" flexItem sx={{ mx: 1, borderColor: 'rgba(255,255,255,0.3)' }} />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <span role="img" aria-label="duration">⏱️</span>
                            <Typography variant="body2" sx={{ fontWeight: 500, color: '#fff' }}>
                              <span style={{ fontWeight: 700 }}>{item.duration} min</span>
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, alignItems: 'center', mt: 1 }}>
                          <Chip
                            label={item.isActive ? 'Active' : 'Inactive'}
                            color={item.isActive ? 'success' : 'error'}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              fontFamily: 'Poppins, sans-serif',
                              fontSize: 14,
                              px: 1.5,
                              boxShadow: item.isActive ? '0 0 8px #4caf50aa' : '0 0 8px #f44336aa',
                              color: '#fff',
                              background: item.isActive ? colors.greenAccent[600] : colors.redAccent[600]
                            }}
                          />
                          {item.coupons && item.coupons.length > 0 && (
                            <Chip label={`Coupons: ${item.coupons.length}`} color="secondary" size="small" sx={{ fontWeight: 600, fontFamily: 'Poppins, sans-serif', fontSize: 14, px: 1.5, boxShadow: '0 0 8px #7c3aed44', color: '#fff', background: colors.primary[600] }} title="Number of coupons available for this service" />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      )}

      <Dialog open={openDialog} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Add New Service</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <InputLabel>Service Name</InputLabel>
            <SelectInput
              name="serviceId"
              value={newService.serviceId}
              onChange={(e) => {
                const selectedId = e.target.value;
                setNewService({ ...newService, serviceId: selectedId, subServiceIds: [] });
                fetchSubServicesByServiceId(selectedId);
              }}
              options={serviceOptions}
              placeholder="Select Service"
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <InputLabel>Sub Service (Optional)</InputLabel>
            <MultiSelectWithCheckbox
              options={subServiceOptions}
              placeholder="Select Sub Services"
              value={subServiceOptions.filter(opt =>
                newService.subServiceIds.includes(opt.value)
              )}
              onChange={(newValue) => {
                setNewService({
                  ...newService,
                  subServiceIds: newValue.map(item => item.value),
                });
              }}
              disabled={!newService.serviceId}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <InputLabel>Price ($)</InputLabel>
            <Input fullWidth type="number" name="price" value={newService.price} onChange={handleServiceChange} sx={{ mb: 2 }} />
          </Box>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <InputLabel>Duration (minutes)</InputLabel>
            <Box sx={{ width: '300px' }}>
              <Input type="number" name="duration" placeholder="Durations (mins)" value={newService.duration} onChange={handleServiceChange} sx={{ mb: 2 }} />
            </Box>
          </Box>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={newService.isActive}
                  onChange={(e) => setNewService(prev => ({
                    ...prev,
                    isActive: e.target.checked
                  }))}
                  color="primary"
                />
              }
              label="Active Service"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <CustomIconButton icon={<Close />} color="red" text="Close" onClick={() => setOpenDialog(false)} />
          <CustomIconButton
            icon={<PersonAdd />}
            color="black"
            text="Add Service"
            onClick={handleSubmitService}
            disabled={!newService.serviceId || !newService.price || !newService.duration}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Services;
