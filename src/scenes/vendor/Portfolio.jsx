import React, { useState } from "react";
import { Box, Card, CardContent, Grid, Typography, useTheme, LinearProgress, Button, Dialog, DialogTitle, TextField, DialogActions, IconButton } from "@mui/material";
import { tokens } from "../../theme";
import { Header } from "../../components";
import useStylistProfile from "../../hooks/useStylistProfile";
import AddIcon from '@mui/icons-material/Add';
import { CustomIconButton } from "../../custom/Button";
import { Close } from "@mui/icons-material";
import axios from "axios";
import { API_BASE_URL } from "../../utils/apiConfig";
import Cookies from "js-cookie";
import { DeleteIcon } from "lucide-react";
import { fetchStylistProfile } from "../../hooks/stylistProfileSlice";
import { useDispatch } from "react-redux";
import Alert from "../../custom/Alert";

const portfolio = () => {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { profile, loading } = useStylistProfile();
  const authToken = Cookies.get("token");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const type = file.type.startsWith("video") ? "video" : "image";
    setMediaFile(file);
    setMediaType(type);
    setMediaPreview(URL.createObjectURL(file));
  };

  const handleAddPortfolio = () => {
    setAddDialogOpen(true);
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType("");
    setName("");
    setDescription("");
  };


  const handleUpload = async () => {
    if (!mediaFile || !description) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("files", mediaFile);
      formData.append("descriptions", JSON.stringify([description]));
      formData.append("profileCompletionStep", "certifications");
      await axios.post(`${API_BASE_URL}/stylist/${profile?._id}/portfolio`, formData,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setAddDialogOpen(false);
      dispatch(fetchStylistProfile());
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (item) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };
  const confirmDelete = async () => {
    if (!itemToDelete || !profile?._id) return;
    setDeleteLoading(true);
    try {
      await axios.delete(`${API_BASE_URL}/stylist/${profile._id}/portfolio/${itemToDelete._id}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      dispatch(fetchStylistProfile());
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setDeleteLoading(false);
    }
  };


  return (
    <Box>
      {(loading || !profile) && <LinearProgress sx={{ mb: 2 }} />}
      <Header title="Portfolio" />
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <CustomIconButton icon={<AddIcon />} text="Add Portfolio" fontWeight="bold" color="#6d295a" variant="outlined"
          sx={{ width: { xs: '100%', sm: 'auto' } }} onClick={handleAddPortfolio} />
      </Box>
      {(!profile) ? null : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            <Card sx={{ borderRadius: 4, backgroundColor: colors.cardBackground, boxShadow: '0 4px 24px rgba(31, 38, 135, 0.10)', mb: 3, p: 2, }}>
              <CardContent>
                <Grid container spacing={2}>
                  {(!profile?.portfolio || profile.portfolio.length === 0) && (
                    <Grid item xs={12}>
                      <Typography color="textSecondary">No portfolio items available.</Typography>
                    </Grid>
                  )}
                  {profile?.portfolio?.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item._id}>
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
                          minHeight: 260,
                          position: 'relative',
                        }}
                      >
                        <Box sx={{ width: '100%', position: 'relative' }}>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteClick(item)}
                            sx={{
                              position: 'absolute',
                              top: 8,
                              left: 8,
                              zIndex: 3,
                              backgroundColor: 'rgba(255,0,0,0.7)',
                              color: '#fff',
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                          {item?.mediaType === 'video' ? (
                            <Box sx={{ position: 'relative', width: '100%' }}>
                              <video
                                src={item.url}
                                controls
                                style={{ width: '100%', borderRadius: '12px 12px 0 0', background: '#000', display: 'block' }}
                              />
                              <Box sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'rgba(0,0,0,0.5)', borderRadius: '50%', p: 1 }}>
                                <span role="img" aria-label="play" style={{ fontSize: 24, color: '#fff' }}>▶️</span>
                              </Box>
                            </Box>
                          ) : (
                            <Box sx={{ position: 'relative', width: '100%' }}>
                              <img
                                src={item.url}
                                alt={item.name}
                                onError={(e) => { e.target.onerror = null; e.target.src = "https://imgscf.slidemembers.com/docs/1/1/286/hair_styling_portfolio_presentation_285153.jpg"; }}
                                style={{ width: '100%', height: 180, objectFit: 'cover', borderRadius: '12px 12px 0 0', boxShadow: '0 1px 6px rgba(0,0,0,0.08)' }}
                              />
                              <Box sx={{
                                position: 'absolute',
                                left: 0,
                                right: 0,
                                bottom: 0,
                                height: '50%',
                                background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(109,41,90,0.5) 100%)',
                                borderRadius: '0 0 12px 12px',
                              }} />
                            </Box>
                          )}
                          {/* Floating info card */}
                          <Box sx={{ position: 'absolute', left: 0, right: 0, bottom: 0, px: 2, py: 1.5, zIndex: 2, color: '#fff', textAlign: 'center', }}>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ fontFamily: 'Poppins, sans-serif', textShadow: '0 2px 8px #000' }}>
                              {item.name}
                            </Typography>
                            <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', textShadow: '0 1px 4px #000', opacity: 0.85 }}>
                              {item.description}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Upload Image/Video Dialog */}
      <Dialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Portfolio Item</DialogTitle>
        <CardContent sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Button variant="outlined" component="label">
            Upload Image/Video
            <input hidden accept="image/*,video/*" type="file" onChange={handleFileChange} />
          </Button>
          {mediaPreview && mediaType === "image" && (
            <img src={mediaPreview} alt="preview" style={{ width: "100%", maxHeight: 300, objectFit: "contain" }} />
          )}
          {mediaPreview && mediaType === "video" && (
            <video controls src={mediaPreview} style={{ width: "100%", maxHeight: 300 }} />
          )}
          <TextField fullWidth value={name} onChange={(e) => setName(e.target.value)} />
          <TextField fullWidth multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
        </CardContent>
        <DialogActions>
          <CustomIconButton icon={<Close />} color="red" text="Close" onClick={() => setAddDialogOpen(false)} />
          <Button variant="contained" onClick={handleUpload} disabled={uploading}>
            {uploading ? "Uploading..." : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>

      <Alert
        open={deleteDialogOpen}
        title="Delete Portfolio Item"
        description={`Are you sure you want to delete "${itemToDelete?.name}"?`}
        onClose={() => {
          setDeleteDialogOpen(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDelete}
        loading={deleteLoading}
        confirmLabel="Delete"
      />
    </Box>
  );
};

export default portfolio; 