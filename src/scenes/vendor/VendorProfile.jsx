import React from 'react';
import {
  Box,
  Typography,
  useTheme,
  Grid,
  Avatar,
  Chip,
  IconButton,
  Divider,
  Card,
  CardMedia,
  CardContent,
  Tooltip,
  Stack,
  CircularProgress,
} from "@mui/material";
import {
  LocationOn,
  Phone,
  Email,
  Instagram,
  Facebook,
  Twitter,
  Edit,
  AccessTime,
  School,
  Work,
  Verified,
  PersonAdd,
  PhotoCamera,
  Delete,
} from "@mui/icons-material";
import { tokens } from "../../theme";
import { Header } from '../../components';
import bannerImage from '../../assets/images/banner.jpg';
import useStylistProfile from '../../hooks/useStylistProfile';
import { showErrorToast } from '../../Toast';
import { CustomIconButton } from '../../custom/Button';
import ProfileEntityDialog from './ProfileEntityDialog';
import { API_BASE_URL } from '../../utils/apiConfig';
import { useDispatch } from 'react-redux';
import { fetchStylistProfile } from '../../hooks/stylistProfileSlice';
import blak_image from '../../assets/images/blank_image.webp';
import profileimage from '../../assets/images/profileimage.png';
import Cookies from 'js-cookie';
import axios from 'axios';
import { Trash2 } from 'lucide-react';
import Alert from '../../custom/Alert';

const socialIcons = [
  { icon: <Instagram />, color: '#E1306C', url: '#' },
  { icon: <Facebook />, color: '#1877F3', url: '#' },
  { icon: <Twitter />, color: '#1DA1F2', url: '#' },
];

const VendorProfile = () => {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogType, setDialogType] = React.useState(null);
  const [uploading, setUploading] = React.useState(false);
  const [currentSectionData, setCurrentSectionData] = React.useState(null);
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, id: null, type: null });
  const [deletingExpertiseId, setDeletingExpertiseId] = React.useState(null);

  const { profile, loading, error } = useStylistProfile();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const fileInputRef = React.useRef();
  const authToken = Cookies.get("token");
  const dispatch = useDispatch();

  const handleOpenDialog = (type) => {
    let dataToSend = null;
    if (type === 'expertise') {
      dataToSend = profile?.expertise || [];
    } else if (type === 'experience') {
      dataToSend = profile?.experience || [];
    } else if (type === 'certificate') {
      dataToSend = profile?.certificates || [];
    }
    setCurrentSectionData(dataToSend);
    setDialogType(type);
    setDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setDialogType(null);
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('files', file);
      const response = await axios.post(
        `${API_BASE_URL}/stylist/profile-image`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      );
      if (response?.data?.status === 200 && response?.data?.success === true) {
        dispatch(fetchStylistProfile());
        showSuccessToast(response?.data?.data?.message || "Profile image updated!");
      }
    } catch (err) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteItem = async (stylistId, itemId, type) => {
    if (type === 'expertise') setDeletingExpertiseId(itemId);
    try {
      await axios.delete(`${API_BASE_URL}/stylist/item/delete/${stylistId}/${itemId}?type=${type}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        withCredentials: true,
      });
      dispatch(fetchStylistProfile());
    } catch (err) {
      showErrorToast(err.response?.data?.message || `Failed to delete ${type}`);
    } finally {
      if (type === 'expertise') setDeletingExpertiseId(null);
    }
  };

  React.useEffect(() => {
    if (error) {
      showErrorToast(error);
    }
  }, [error]);

  if (loading) return <CircularProgress />;
  if (!profile) return null;

  return (
    <Box m={{ xs: 1, md: 4 }}>
      <Header title="My Profile" subtitle="View and manage your profile information" />
      <Box sx={{ position: 'relative', width: '100%', mb: 6, borderRadius: '24px', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)', overflow: 'hidden' }}>
        <Box
          sx={{
            position: 'absolute',
            height: 200,
            width: '100%',
            backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.4), transparent), url(${bannerImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            top: 0, left: 0,
          }}
        />
        <Box sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: 4,
          px: { xs: 2, md: 6 },
          pt: 6,
          pb: 3,
          '@supports (backdrop-filter: blur(8px))': {
            backdropFilter: 'blur(8px)',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4, position: 'relative' }}>
            <Box sx={{ position: 'relative', width: 140, height: 140 }}>
              <Avatar
                src={profile?.profilePicture || profileimage}
                onError={(e) => { e.target.onerror = null; e.target.src = profileimage; }}
                sx={{ width: 140, height: 140, border: '6px solid #fff', boxShadow: '0 4px 24px rgba(0,0,0,0.12)', background: '#fff' }}
              />
              {/* Upload Icon Overlay */}
              <IconButton
                sx={{ position: 'absolute', bottom: 8, right: 8, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', p: 1, zIndex: 3, }}
                onClick={handleUploadClick}
                disabled={uploading}
              >
                <PhotoCamera sx={{ color: uploading ? '#aaa' : '#6D295A' }} />
              </IconButton>
              {/* Hidden file input */}
              <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} disabled={uploading} />
              {/* Loading overlay */}
              {uploading && (
                <Box sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  bgcolor: 'rgba(255,255,255,0.6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '50%',
                  zIndex: 4,
                }}>
                  <CircularProgress />
                </Box>
              )}
            </Box>
            <Box>
              <Typography variant="h3" fontWeight={700} color="#fff" sx={{}}>
                {profile?.fullName}
              </Typography>
              <Typography variant="h5" color="#fff" fontWeight={500} sx={{ mb: 1 }}>
                {profile?.about?.shopName || 'Professional Hair Stylist'}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <LocationOn sx={{ color: theme.palette.mode === 'dark' ? colors.greenAccent[400] : colors.greenAccent[500] }} />
                <Typography color="#fff">{profile?.about?.address || profile?.address}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Email sx={{ color: theme.palette.mode === 'dark' ? colors.blueAccent[400] : colors.blueAccent[500] }} />
                <Typography color="#fff">{profile?.email}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Phone sx={{ color: theme.palette.mode === 'dark' ? colors.redAccent[400] : colors.redAccent[500] }} />
                <Typography color="#fff">{profile?.phoneNumber}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <AccessTime sx={{ color: theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[600] }} />
                <Typography color="#fff">{profile?.about?.timings?.from} - {profile?.about?.timings?.till}</Typography>
              </Stack>
            </Box>
          </Box>
          <Box>
            <Stack direction="row" spacing={1}>
              {socialIcons?.map((item, idx) => (
                <Tooltip title={item.icon.type.displayName} key={idx}>
                  <IconButton sx={{ color: item.color, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                    {item.icon}
                  </IconButton>
                </Tooltip>
              ))}
              <IconButton sx={{ background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
                <Edit sx={{ color: '#6D295A' }} />
              </IconButton>
            </Stack>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 4, backgroundColor: colors.cardBackground, boxShadow: '0 4px 24px rgba(31, 38, 135, 0.10)', mb: 3, p: 2, }}>
            <CardContent>
              <Typography variant="h4" fontWeight={600} color={theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[600]} gutterBottom>About</Typography>
              <Typography variant="body1" color={theme.palette.mode === 'dark' ? colors.gray[200] : colors.gray[700]} gutterBottom>{profile?.about?.about}</Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" fontWeight={600} color={theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[600]} gutterBottom>Expertise</Typography>
                <CustomIconButton size="small" icon={<PersonAdd />} text="Update Expertise" fontWeight="bold" color="#6d295a" variant="outlined" onClick={() => handleOpenDialog('expertise')} />
              </Box>
              <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                {profile?.expertise?.map((exp) => (
                  <Chip
                    key={exp}
                    label={exp}
                    variant="outlined"
                    onDelete={() => setDeleteDialog({ open: true, id: exp, type: 'expertise' })}
                    deleteIcon={
                      deletingExpertiseId === exp ? (
                        <CircularProgress size={18} sx={{ color: '#ff4d4f' }} />
                      ) : (
                        <Trash2 size={18} color="#ff4d4f" />
                      )
                    }
                    sx={{ fontWeight: "bold", color: "#6d295a", borderRadius: 2 }}
                    disabled={deletingExpertiseId === exp}
                  />
                ))}
              </Box>

              {/* Subservices as chips */}
              {profile?.expertise?.map((exp, idx) => (
                exp.subServices && exp.subServices.length > 0 && (
                  <Box key={idx} mt={1} display="flex" flexWrap="wrap" gap={1}>
                    {exp?.subServices?.map((s) => (
                      <Chip
                        key={s._id}
                        label={s.name}
                        size="small"
                        variant="outlined"
                        sx={{

                          borderRadius: 2,
                          border: '1px solid orange',
                          color: theme.palette.mode === 'dark' ? '#fff' : '#000',
                          backgroundColor: 'transparent',
                          '& .MuiChip-label': {
                            padding: '0 8px',
                          },
                        }}
                      />
                    ))}
                  </Box>
                )
              ))}
            </CardContent>
          </Card>

          {/* Experience Timeline */}
          <Card sx={{ borderRadius: 4, backgroundColor: colors.cardBackground, boxShadow: '0 4px 24px rgba(31, 38, 135, 0.10)', mb: 3, p: 2, }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" fontWeight={600} color={theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[600]} gutterBottom>Experience</Typography>
                <CustomIconButton size="small" icon={<PersonAdd />} text="Update Experience" fontWeight="bold" color="#6d295a" variant="outlined" onClick={() => handleOpenDialog('experience')} />
              </Box>
              <Box>
                {profile?.experience?.map((exp, idx) => (
                  <Stack direction="row" alignItems="center" spacing={2} key={exp._id} mb={1} justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                      <Work sx={{ color: '#6D295A' }} />
                      <Typography color={theme.palette.mode === 'dark' ? colors.gray[200] : colors.gray[700]}>
                        {exp.role} at {exp.salon} ({exp.duration})
                      </Typography>
                    </Stack>
                    <IconButton onClick={e => { e.preventDefault(); setDeleteDialog({ open: true, id: exp._id, type: 'experience' }); }} sx={{ backgroundColor: "#6d295a", color: "#fff", '&:hover': { backgroundColor: "#5c2350" } }}>
                      <Trash2 size={20} color="white" />
                    </IconButton>
                  </Stack>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Certificates & Photos Gallery */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 4, backgroundColor: colors.cardBackground, boxShadow: '0 4px 24px rgba(31, 38, 135, 0.10)', mb: 3, p: 0, }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h4" fontWeight={600} color={theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[600]} gutterBottom>Certificates</Typography>
                <CustomIconButton size="small" icon={<PersonAdd />} text="Update Certificates" fontWeight="bold" color="#6d295a" variant="outlined" onClick={() => handleOpenDialog('certificate')} />
              </Box>
              <Grid container spacing={2}>
                {profile?.certificates?.map((cert) => (
                  <Grid item xs={4} key={cert._id}>
                    <Box sx={{ position: 'relative' }}>
                      <a href={cert.url} target="_blank" rel="noopener noreferrer">
                        <CardMedia
                          component="img"
                          height="90"
                          image={cert.url}
                          alt={cert.name}
                          onError={(e) => { e.target.onerror = null; e.target.src = blak_image; }}
                          sx={{ borderRadius: 3, border: cert.verified ? `2px solid ${colors.greenAccent[500]}` : `2px solid ${colors.primary[400]}` }}
                        />
                      </a>
                      <IconButton
                        size="small"
                        sx={{ position: 'absolute', top: 6, left: 6, background: '#fff', zIndex: 2, '&:hover': { background: '#fff' } }}
                        onClick={e => { e.preventDefault(); setDeleteDialog({ open: true, id: cert._id, type: 'certificate' }); }}
                      >
                        <Trash2 size={20} color="#ff4d4f" />
                      </IconButton>
                      {cert.verified && (
                        <Verified sx={{ position: 'absolute', top: 6, right: 6, color: colors.greenAccent[500], fontSize: 20 }} />
                      )}
                    </Box>
                    <Typography variant="caption" display="block" align="center" color={theme.palette.mode === 'dark' ? colors.gray[200] : colors.gray[700]}>{cert.name}</Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 4, backgroundColor: colors.cardBackground, boxShadow: '0 4px 24px rgba(31, 38, 135, 0.10)', p: 2, }}>
            <CardContent>
              <Typography variant="h6" fontWeight={600} color={theme.palette.mode === 'dark' ? colors.primary[200] : colors.primary[600]} gutterBottom>Photos</Typography>
              <Grid container spacing={2}>
                {profile?.photos?.map((photo) => (
                  <Grid item xs={6} key={photo._id}>
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="90"
                        image={photo.url}
                        alt={photo.name}
                        onError={(e) => { e.target.onerror = null; e.target.src = blak_image; }}
                        sx={{ borderRadius: 3, border: photo.verified ? `2px solid ${colors.greenAccent[500]}` : `2px solid ${colors.primary[400]}` }}
                      />
                      <IconButton
                        size="small"
                        sx={{ position: 'absolute', top: 6, left: 6, background: '#fff', zIndex: 2, '&:hover': { background: '#fff' } }}
                        onClick={e => { e.preventDefault(); setDeleteDialog({ open: true, id: photo._id, type: 'photo' }); }}
                      >
                        <Trash2 size={20} color="#ff4d4f" />
                      </IconButton>
                      {photo.verified && (
                        <Verified sx={{ position: 'absolute', top: 6, right: 6, color: colors.greenAccent[500], fontSize: 20 }} />
                      )}
                    </Box>
                    <Typography variant="caption" display="block" align="center" color={theme.palette.mode === 'dark' ? colors.gray[200] : colors.gray[700]}>{photo.name}</Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <ProfileEntityDialog open={dialogOpen} type={dialogType} profileData={currentSectionData} onClose={handleCloseDialog} onSuccess={() => dispatch(fetchStylistProfile())} />
      {/* Alert for delete confirmation */}
      {deleteDialog.open && (
        <Alert
          open={deleteDialog.open}
          title={`Delete ${deleteDialog.type.charAt(0).toUpperCase() + deleteDialog.type.slice(1)}`}
          description={`Are you sure you want to delete this ${deleteDialog.type}? This action cannot be undone.`}
          onClose={() => setDeleteDialog({ open: false, id: null, type: null })}
          onConfirm={e => {
            if (e && e.preventDefault) e.preventDefault();
            handleDeleteItem(profile?._id, deleteDialog.id, deleteDialog.type);
            setDeleteDialog({ open: false, id: null, type: null });
          }}
          type="warning"
        />
      )}
    </Box>
  );
};

export default VendorProfile;