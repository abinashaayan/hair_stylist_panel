import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Grid, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography, useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { tokens } from "../theme";
import Input from "../custom/Input";
import { CustomIconButton } from "../custom/Button";
import { EditIcon } from "lucide-react";
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import { showErrorToast, showSuccessToast } from "../Toast";
import useStylistProfile from "../hooks/useStylistProfile";
import axios from "axios";
import { API_BASE_URL } from "../utils/apiConfig";
import { fetchStylistProfile } from "../hooks/stylistProfileSlice";
import { useDispatch } from "react-redux";

const StylistProfileEntityDialog = ({ open, handleClose, profileData }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        address: {
            street: '',
            house: '',
            city: '',
            province: '',
            zipCode: '',
            country: '',
        },
        socialMediaLinks: {
            facebook: '',
            instagram: '',
            linkedin: '',
        },
        about: {
            shopName: '',
            startFrom: new Date().getFullYear().toString(),
            about: '',
            address: '',
            schedule: 'Mon-Sat',
            customDays: '',
            timings: {
                from: '09:00',
                till: '18:00',
            },
        },
    });

    const [socialMediaErrors, setSocialMediaErrors] = useState({
        facebook: '',
        instagram: '',
        linkedin: '',
    });

    const theme = useTheme();
    const { profile } = useStylistProfile();

    const dispatch = useDispatch();
    const colors = tokens(theme.palette.mode);

    const isValidUrl = (url) => {
        const pattern = new RegExp(
            '^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$', 'i'
        );
        return !!pattern.test(url);
    };

    useEffect(() => {
        if (profileData) {
            setFormData({
                fullName: profileData?.fullName || '',
                phoneNumber: profileData?.phoneNumber || '',
                address: {
                    street: profileData?.address?.street || '',
                    house: profileData?.address?.house || '',
                    city: profileData?.address?.city || '',
                    province: profileData?.address?.province || '',
                    zipCode: profileData?.address?.zipCode || '',
                    country: profileData?.address?.country || '',
                },
                socialMediaLinks: {
                    facebook: profileData?.socialMediaLinks?.facebook || '',
                    instagram: profileData?.socialMediaLinks?.instagram || '',
                    linkedin: profileData?.socialMediaLinks?.linkedin || '',
                },
                about: {
                    shopName: profileData?.shopDetails?.shopName || '',
                    startFrom: profileData?.shopDetails?.startFrom || new Date().getFullYear().toString(),
                    about: profileData?.shopDetails.about || '', 
                    address: profileData?.shopDetails?.address || '',
                    schedule: profileData?.shopDetails?.schedule || 'Mon-Sat',
                    customDays: profileData?.shopDetails?.customDays || '',
                    timings: {
                        from: profileData?.shopDetails?.timings?.from || '09:00',
                        till: profileData?.shopDetails?.timings?.till || '18:00',
                    },
                },
            });
        }
    }, [profileData]);

    const handleChange = (field, value, isSocialMedia = false, isAddress = false, isAbout = false, isTiming = false) => {
        if (isSocialMedia) {
            setFormData((prev) => ({
                ...prev,
                socialMediaLinks: {
                    ...prev.socialMediaLinks,
                    [field]: value,
                },
            }));
            if (value && !isValidUrl(value)) {
                setSocialMediaErrors((prev) => ({
                    ...prev,
                    [field]: 'Invalid URL format',
                }));
            } else {
                setSocialMediaErrors((prev) => ({
                    ...prev,
                    [field]: '',
                }));
            }
        } else if (isAddress) {
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [field]: value,
                },
            }));
        } else if (isAbout) {
            setFormData((prev) => ({
                ...prev,
                about: {
                    ...prev.about,
                    [field]: value,
                },
            }));
        } else if (isTiming) {
            setFormData((prev) => ({
                ...prev,
                about: {
                    ...prev.about,
                    timings: {
                        ...prev.about.timings,
                        [field]: value,
                    },
                },
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [field]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { facebook, instagram, linkedin } = formData.socialMediaLinks;
        if ((facebook && !isValidUrl(facebook)) || (instagram && !isValidUrl(instagram)) || (linkedin && !isValidUrl(linkedin))) {
            showErrorToast("Please enter valid URLs for social media links.");
            return;
        }
        try {
            const payload = {
                fullName: formData.fullName,
                phoneNumber: formData.phoneNumber,
                address: formData.address,
                socialMediaLinks: formData.socialMediaLinks,
                shopDetails: formData.about,
            };
            const response = await axios.patch(`${API_BASE_URL}/stylist/profile/${profile._id}`, payload);
            if (response.data.success) {
                showSuccessToast("Profile updated successfully!");
                handleClose();
                dispatch(fetchStylistProfile());
            } else {
                showErrorToast("Failed to update profile.");
            }
        } catch (error) {
            console.error("Update Error:", error);
            showErrorToast("Something went wrong while updating the profile.");
        }
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
            <DialogTitle>Edit Stylist Profile</DialogTitle>
            <DialogContent>
                <InputLabel>Full Name</InputLabel>
                <Input value={formData.fullName} onChange={(e) => handleChange('fullName', e.target.value)} fullWidth />

                <InputLabel sx={{ mt: 2 }}>Phone Number</InputLabel>
                <Input value={formData.phoneNumber} onChange={(e) => handleChange('phoneNumber', e.target.value)} fullWidth />

                {/* Address */}
                <InputLabel sx={{ mt: 2 }}>Street</InputLabel>
                <Input value={formData.address.street} onChange={(e) => handleChange('street', e.target.value, false, true)} fullWidth />

                <InputLabel sx={{ mt: 2 }}>House</InputLabel>
                <Input value={formData.address.house} onChange={(e) => handleChange('house', e.target.value, false, true)} fullWidth />

                <InputLabel sx={{ mt: 2 }}>City</InputLabel>
                <Input value={formData.address.city} onChange={(e) => handleChange('city', e.target.value, false, true)} fullWidth />

                <InputLabel sx={{ mt: 2 }}>Province</InputLabel>
                <Input value={formData.address.province} onChange={(e) => handleChange('province', e.target.value, false, true)} fullWidth />

                <InputLabel sx={{ mt: 2 }}>Zip Code</InputLabel>
                <Input value={formData.address.zipCode} type="number" onChange={(e) => handleChange('zipCode', e.target.value, false, true)} fullWidth />

                <InputLabel sx={{ mt: 2 }}>Country</InputLabel>
                <Input value={formData.address.country} onChange={(e) => handleChange('country', e.target.value, false, true)} fullWidth />

                {/* Social Media */}
                <Divider sx={{ my: 3 }} />
                <Typography variant="h4" fontWeight={600} color={colors.primary[600]} gutterBottom>Social Media</Typography>
                <Divider sx={{ mb: 2 }} />

                <InputLabel sx={{ color: "black", fontWeight: 500 }}>Facebook</InputLabel>
                <Input
                    placeholder="Facebook"
                    value={formData.socialMediaLinks?.facebook}
                    onChange={(e) => handleChange('facebook', e.target.value, true)}
                    icon={<FacebookRoundedIcon sx={{ color: "#1877F2" }} />}
                    error={!!socialMediaErrors.facebook}
                    helperText={socialMediaErrors.facebook}
                />

                <InputLabel sx={{ color: "black", fontWeight: 500, mt: 2 }}>Instagram</InputLabel>
                <Input
                    placeholder="Instagram"
                    value={formData.socialMediaLinks?.instagram}
                    onChange={(e) => handleChange('instagram', e.target.value, true)}
                    icon={<InstagramIcon sx={{ color: "#E1306C" }} />}
                    error={!!socialMediaErrors.instagram}
                    helperText={socialMediaErrors.instagram}
                />

                <InputLabel sx={{ color: "black", fontWeight: 500, mt: 2 }}>LinkedIn</InputLabel>
                <Input
                    placeholder="LinkedIn"
                    value={formData.socialMediaLinks?.linkedin}
                    onChange={(e) => handleChange('linkedin', e.target.value, true)}
                    icon={<LinkedInIcon sx={{ color: "#0077B5" }} />}
                    error={!!socialMediaErrors.linkedin}
                    helperText={socialMediaErrors.linkedin}
                />

                {/* About Section */}
                <Divider sx={{ my: 3 }} />
                <Typography variant="h4" fontWeight={600} color={colors.primary[600]} gutterBottom>Shop Information</Typography>
                <Divider sx={{ mb: 2 }} />

                <InputLabel>Shop Name</InputLabel>
                <Input value={formData.about.shopName} placeholder="Shop Name" onChange={(e) => handleChange('shopName', e.target.value, false, false, true)} fullWidth />

                <InputLabel sx={{ mt: 2 }}>Start From (Year)</InputLabel>
                <Select
                    value={formData.about.startFrom}
                    onChange={(e) => handleChange('startFrom', e.target.value, false, false, true)}
                    fullWidth
                >
                    {years.map((year) => (
                        <MenuItem key={year} value={year.toString()}>
                            {year}
                        </MenuItem>
                    ))}
                </Select>

                <InputLabel sx={{ mt: 2 }}>About</InputLabel>
                <Input multiline rows={3} value={formData.about.about} placeholder="About" onChange={(e) => handleChange('about', e.target.value, false, false, true)} fullWidth />

                <InputLabel sx={{ mt: 2 }}>Shop Address</InputLabel>
                <Input value={formData.about.address} placeholder="Shop Address" onChange={(e) => handleChange('address', e.target.value, false, false, true)} fullWidth />

                <InputLabel sx={{ mt: 2 }}>Schedule</InputLabel>
                <Select
                    value={formData.about.schedule}
                    onChange={(e) => handleChange('schedule', e.target.value, false, false, true)}
                    fullWidth
                >
                    <MenuItem value="Mon-Fri">Monday to Friday</MenuItem>
                    <MenuItem value="Mon-Sat">Monday to Saturday</MenuItem>
                    <MenuItem value="Daily">Daily</MenuItem>
                    <MenuItem value="Custom">Custom</MenuItem>
                </Select>

                {formData.about.schedule === 'Custom' && (
                    <>
                        <InputLabel sx={{ mt: 2 }}>Custom Days</InputLabel>
                        <Input
                            placeholder="e.g., Monday, Wednesday"
                            value={formData.about.customDays}
                            onChange={(e) => handleChange('customDays', e.target.value, false, false, true)}
                            fullWidth
                        />
                    </>
                )}

                <Typography variant="h6" mt={3}>Timings</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <InputLabel sx={{ mt: 1 }}>From</InputLabel>
                        <TextField
                            type="time"
                            value={formData.about.timings.from}
                            onChange={(e) => handleChange('from', e.target.value, false, false, false, true)}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300,
                            }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <InputLabel sx={{ mt: 1 }}>Till</InputLabel>
                        <TextField
                            type="time"
                            value={formData.about.timings.till}
                            onChange={(e) => handleChange('till', e.target.value, false, false, false, true)}
                            fullWidth
                            InputLabelProps={{
                                shrink: true,
                            }}
                            inputProps={{
                                step: 300,
                            }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <CustomIconButton size="small" text="Close" fontWeight="bold" color="red" variant="outlined" onClick={handleClose} />
                <CustomIconButton size="small" icon={<EditIcon size={16} />} text="Update" fontWeight="bold" color="black" variant="outlined" onClick={handleSubmit} />
            </DialogActions>
        </Dialog>
    );
};

export default StylistProfileEntityDialog;



