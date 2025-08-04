import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogActions,
    Typography,
    Box,
    Grid,
    Chip,
    Paper,
    Link,
    Avatar,
    Divider,
    Stack,
    TextField,
    Button
} from '@mui/material';
import { Briefcase, Building2, Calendar, GraduationCap, Mail, Phone, Sparkles, Star, User, Award, MapPin, Linkedin, Share2, Image, Pencil, Save, X, Plus } from 'lucide-react';
import { CustomIconButton } from '../custom/Button';
import { Close, Facebook, Instagram } from '@mui/icons-material';
import Input from '../custom/Input';

function formatTime(time24) {
    const [hour, minute] = time24.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
}

function formatAddress(address) {
    if (!address) return '';
    if (typeof address === 'string') return address;
    if (typeof address === 'object') {
        const parts = [
            address.street,
            address.house,
            address.city,
            address.province,
            address.zipCode,
            address.country
        ].filter(Boolean);
        return parts.join(', ');
    }
    return '';
}

const DetailItem = ({ icon, label, value, fullWidth = false, editMode = false, fieldName = null, formData = {}, handleChange = null }) => (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
        {icon && <Box sx={{ color: 'primary.main' }}>{icon}</Box>}
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', minWidth: '120px' }}>{label}</Typography>
        {editMode && fieldName ? (
            <TextField
                name={fieldName}
                value={formData[fieldName] || ''}
                onChange={handleChange}
                fullWidth
                size="small"
                variant="outlined"
                sx={{ flexGrow: 1 }}
            />
        ) : typeof value === 'boolean' ? (
            <Chip label={value ? 'Yes' : 'No'} color={value ? 'success' : 'default'} size="small" />
        ) : (
            <Typography variant="body2" sx={{ wordBreak: 'break-word', flexGrow: 1 }}>{value || 'N/A'}</Typography>
        )}
    </Stack>
);

const Section = ({ title, icon, children }) => (
    <Paper elevation={2} sx={{ p: 2, mb: 3, borderRadius: 2, background: 'linear-gradient(to right, #fdfbfb, #ebedee)' }}>
        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2 }}>
            <Box color="primary.main">{icon}</Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>{title}</Typography>
        </Stack>
        <Divider sx={{ mb: 2 }} />
        {children}
    </Paper>
);

const StylistDetailsView = ({ open, onClose, data, onSave, editMode = false }) => {
    const [formData, setFormData] = useState({});
    const [isEditMode, setIsEditMode] = useState(editMode);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (data) {
            setFormData({
                fullName: data.fullName || '',
                email: data.email || '',
                phoneNumber: data.phoneNumber || '',
                address: formatAddress(data.address),
                education: data.education || '',
                expertise: data.expertise || '',
                experience: data.experience || [],
                instagramLink: data.socialMediaLinks?.instagram || '',
                facebookLink: data.socialMediaLinks?.facebook || '',
                linkedinLink: data.socialMediaLinks?.linkedin || '',
                locationCategory: data.locationCategory || '',
                profileCompletionStep: data.profileCompletionStep || '',
                parking: data.parking || false,
                busStop: data.busStop || false
            });
        }
    }, [data]);

    useEffect(() => {
        setIsEditMode(editMode);
    }, [editMode]);

    if (!data || data.role !== 'stylist') return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleExperienceChange = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.map((exp, i) => 
                i === index ? { ...exp, [field]: value } : exp
            )
        }));
    };

    const addExperience = () => {
        setFormData(prev => ({
            ...prev,
            experience: [...prev.experience, { role: '', salon: '', duration: '' }]
        }));
    };

    const removeExperience = (index) => {
        setFormData(prev => ({
            ...prev,
            experience: prev.experience.filter((_, i) => i !== index)
        }));
    };

    const handleSave = async () => {
        if (!onSave) return;
        
        setIsSaving(true);
        try {
            // Prepare the data according to the API structure
            const updateData = {
                education: formData.education,
                expertise: Array.isArray(formData.expertise) ? formData.expertise : [formData.expertise].filter(Boolean),
                experience: formData.experience,
                instagramLink: formData.instagramLink,
                facebookLink: formData.facebookLink,
                linkedinLink: formData.linkedinLink,
                address: formData.address,
                locationCategory: formData.locationCategory,
                profileCompletionStep: formData.profileCompletionStep,
                parking: formData.parking,
                busStop: formData.busStop
            };

            await onSave(updateData);
            setIsEditMode(false);
        } catch (error) {
            console.error('Error saving stylist:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setIsEditMode(false);
        // Reset form data to original values
        if (data) {
            setFormData({
                fullName: data.fullName || '',
                email: data.email || '',
                phoneNumber: data.phoneNumber || '',
                address: formatAddress(data.address),
                education: data.education || '',
                expertise: data.expertise || '',
                experience: data.experience || [],
                instagramLink: data.socialMediaLinks?.instagram || '',
                facebookLink: data.socialMediaLinks?.facebook || '',
                linkedinLink: data.socialMediaLinks?.linkedin || '',
                locationCategory: data.locationCategory || '',
                profileCompletionStep: data.profileCompletionStep || '',
                parking: data.parking || false,
                busStop: data.busStop || false
            });
        }
    };

    const isAllEmpty = [
        data.expertise,
        data.education,
        data.experience,
        data.certificates,
        data.portfolio,
        data.photos
    ].every(arr => !arr || arr.length === 0);

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ pb: 1, textTransform: 'capitalize', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{data.role} Details: {data.fullName}</span>
                {!isEditMode && onSave && (
                    <CustomIconButton 
                        icon={<Pencil size={20} />} 
                        color="primary" 
                        text="Edit" 
                        onClick={() => setIsEditMode(true)} 
                    />
                )}
            </DialogTitle>
            <Box sx={{ backgroundColor: '#f4f6f8', p: { xs: 1, md: 2 } }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={5}>
                        <Section title="Personal Information" icon={<User size={24} />}>
                            <DetailItem 
                                icon={<User size={20} />} 
                                label="Full Name" 
                                value={data.fullName} 
                                editMode={isEditMode}
                                fieldName="fullName"
                                formData={formData}
                                handleChange={handleChange}
                            />
                            <DetailItem 
                                icon={<Mail size={20} />} 
                                label="Email" 
                                value={data.email} 
                                editMode={isEditMode}
                                fieldName="email"
                                formData={formData}
                                handleChange={handleChange}
                            />
                            <DetailItem 
                                icon={<Calendar size={20} />} 
                                label="DOB" 
                                value={data.dob ? new Date(data.dob).toLocaleDateString() : 'N/A'} 
                            />
                            <DetailItem 
                                icon={<Phone size={20} />} 
                                label="Phone" 
                                value={data.phoneNumber} 
                                editMode={isEditMode}
                                fieldName="phoneNumber"
                                formData={formData}
                                handleChange={handleChange}
                            />
                            <DetailItem 
                                icon={<MapPin size={20} />} 
                                label="Address" 
                                value={formatAddress(data.address)} 
                                editMode={isEditMode}
                                fieldName="address"
                                formData={formData}
                                handleChange={handleChange}
                            />
                        </Section>
                        


                        {data?.about && (
                            <Section title="Shop Details" icon={<Building2 size={24} />}>
                                <DetailItem icon={<Star size={20} />} label="Shop Name" value={data.about.shopName} />
                                <DetailItem
                                    icon={<Phone size={20} />}
                                    label="Timings"
                                    value={
                                        data.about.timings
                                            ? `${data.about.timings.from} - ${data.about.timings.till} - ${data.about.schedule}`
                                            : 'N/A'
                                    }
                                />
                                <DetailItem
                                    icon={<Star size={20} />}
                                    label="Availability"
                                    value={
                                        data?.availability?.length > 0 ? (
                                            <Box>
                                                {data.availability.map((item, index) => (
                                                    <Box key={index} sx={{ mb: 1 }}>
                                                        <Typography variant="caption" sx={{ display: 'block', mb: 0.5 }}>
                                                            {new Date(item.date).toDateString()}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                                            {item.slots.map((slot, i) => (
                                                                <Chip
                                                                    key={i}
                                                                    label={`${formatTime(slot.from)} - ${formatTime(slot.till)}`}
                                                                    size="small"
                                                                    variant="outlined"
                                                                    color="primary"
                                                                />
                                                            ))}
                                                        </Box>
                                                    </Box>
                                                ))}
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" color="text.secondary">
                                                No availability added yet.
                                            </Typography>
                                        )
                                    }
                                />

                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1, p: 1, background: '#fff', borderRadius: 1 }}>{data.about.about}</Typography>
                            </Section>
                        )}
                        
                        {isEditMode && (
                            <Section title="Social Media Links" icon={<Share2 size={24} />}>
                                <DetailItem 
                                    icon={<Instagram size={20} />} 
                                    label="Instagram" 
                                    value={data.socialMediaLinks?.instagram || ''} 
                                    editMode={isEditMode}
                                    fieldName="instagramLink"
                                    formData={formData}
                                    handleChange={handleChange}
                                />
                                <DetailItem 
                                    icon={<Facebook size={20} />} 
                                    label="Facebook" 
                                    value={data.socialMediaLinks?.facebook || ''} 
                                    editMode={isEditMode}
                                    fieldName="facebookLink"
                                    formData={formData}
                                    handleChange={handleChange}
                                />
                                <DetailItem 
                                    icon={<Linkedin size={20} />} 
                                    label="LinkedIn" 
                                    value={data.socialMediaLinks?.linkedin || ''} 
                                    editMode={isEditMode}
                                    fieldName="linkedinLink"
                                    formData={formData}
                                    handleChange={handleChange}
                                />
                            </Section>
                        )}

                        {data.socialMediaLinks && !isEditMode && (
                            <Section title="Social Media" icon={<Share2 size={24} />}>
                                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                                    {data.socialMediaLinks.instagram && (
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Avatar sx={{ bgcolor: '#E1306C', width: 32, height: 32 }}>
                                                <Instagram size={18} color="white" />
                                            </Avatar>
                                            <Link href={data.socialMediaLinks.instagram} target="_blank" rel="noopener noreferrer" underline="hover" color="primary">
                                                Instagram
                                            </Link>
                                        </Box>
                                    )}
                                    {data.socialMediaLinks.facebook && (
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Avatar sx={{ bgcolor: '#3b5998', width: 32, height: 32 }}>
                                                <Facebook size={18} color="white" />
                                            </Avatar>
                                            <Link href={data.socialMediaLinks.facebook} target="_blank" rel="noopener noreferrer" underline="hover" color="primary">
                                                Facebook
                                            </Link>
                                        </Box>
                                    )}
                                    {data.socialMediaLinks.linkedin && (
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Avatar sx={{ bgcolor: '#0e76a8', width: 32, height: 32 }}>
                                                <Linkedin size={18} color="white" />
                                            </Avatar>
                                            <Link href={data.socialMediaLinks.linkedin} target="_blank" rel="noopener noreferrer" underline="hover" color="primary">
                                                LinkedIn
                                            </Link>
                                        </Box>
                                    )}
                                </Stack>
                            </Section>
                        )}
                        {data.portfolio?.length > 0 && (
                            <Section title="Portfolio Gallery" icon={<Image size={24} />}>
                                <Grid container spacing={2}>
                                    {data.portfolio.map((item, index) => (
                                        <Grid item xs={12} sm={6} md={4} key={index}>
                                            <Box
                                                sx={{
                                                    textAlign: 'center',
                                                    border: '1px solid #e0e0e0',
                                                    borderRadius: 2,
                                                    p: 1,
                                                    backgroundColor: '#fff',
                                                    boxShadow: 1,
                                                    transition: 'transform 0.2s',
                                                    '&:hover': { transform: 'scale(1.02)', boxShadow: 3 },
                                                }}
                                            >
                                                {item.mediaType === 'video' ? (
                                                    <video src={item.url} controls style={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 8, }} />
                                                ) : (
                                                    <Box component="img" src={item.url} alt={item.name || `portfolio-${index}`} sx={{ width: '100%', height: 140, objectFit: 'cover', borderRadius: 1.5, }} />
                                                )}
                                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }} noWrap>
                                                    {item.description || item.name}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    ))}
                                </Grid>
                            </Section>
                        )}
                    </Grid>
                    <Grid item xs={12} md={7}>
                        {isAllEmpty ? (
                            <Box sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="h6" color="text.secondary">
                                    No additional details available for this stylist.
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                {data.expertise?.length > 0 && (
                                    <Section title="Expertise" icon={<Sparkles size={24} />}>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {data.expertise.map((exp, i) => {
                                                let label = '';
                                                if (typeof exp === 'string') {
                                                    label = exp;
                                                } else if (exp && typeof exp === 'object') {
                                                    label = [
                                                        exp.service ? `Service: ${exp.service}` : null,
                                                        exp.price !== undefined ? `Price: ₹${exp.price}` : null,
                                                        exp.duration !== undefined ? `Duration: ${exp.duration} min` : null,
                                                        exp.isActive !== undefined ? (exp.isActive ? 'Active' : 'Inactive') : null
                                                    ].filter(Boolean).join(' | ');
                                                } else {
                                                    label = 'N/A';
                                                }
                                                return (
                                                    <Chip key={i} label={label} color="primary" variant="outlined" />
                                                );
                                            })}
                                        </Box>
                                    </Section>
                                )}
                                {(data.experience?.length > 0 || (isEditMode && formData.experience?.length > 0)) && (
                                    <Section title="Experience" icon={<Briefcase size={24} />}>
                                        {isEditMode && (
                                            <Box sx={{ mb: 2 }}>
                                                <CustomIconButton 
                                                    icon={<Plus size={20} />} 
                                                    color="primary" 
                                                    text="Add Experience" 
                                                    onClick={addExperience}
                                                />
                                            </Box>
                                        )}
                                        <Stack spacing={2}>
                                            {(isEditMode ? formData.experience : data.experience).map((exp, index) => (
                                                <Box key={index} sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1.5 }}>
                                                    {isEditMode ? (
                                                        <Stack spacing={1}>
                                                            <Input
                                                                label="Role"
                                                                placeholder="e.g., Senior Stylist, Hair Colorist"
                                                                value={exp.role || ''}
                                                                onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
                                                                size="small"
                                                                fullWidth
                                                            />
                                                            <Input
                                                                label="Salon/Company"
                                                                placeholder="e.g., Beauty Salon, Hair Studio"
                                                                value={exp.salon || ''}
                                                                onChange={(e) => handleExperienceChange(index, 'salon', e.target.value)}
                                                                size="small"
                                                                fullWidth
                                                            />
                                                            <Input
                                                                label="Duration"
                                                                placeholder="e.g., 3 years, 2 years 6 months"
                                                                value={exp.duration || ''}
                                                                onChange={(e) => handleExperienceChange(index, 'duration', e.target.value)}
                                                                size="small"
                                                                fullWidth
                                                            />
                                                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                                                <CustomIconButton 
                                                                    icon={<X size={16} />} 
                                                                    color="error" 
                                                                    text="Remove" 
                                                                    onClick={() => removeExperience(index)}
                                                                />
                                                            </Box>
                                                        </Stack>
                                                    ) : (
                                                        <>
                                                            <Typography sx={{ fontWeight: 'bold' }}>{exp.role} at {exp.salon}</Typography>
                                                            <Typography variant="body2">Duration: {exp.duration}</Typography>
                                                        </>
                                                    )}
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Section>
                                )}
                                {data.certificates?.length > 0 && (
                                    <Section title="Certificates & Portfolio" icon={<Award size={24} />}>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                                            {data.certificates.map((cert, index) => (
                                                <Link href={cert.url} target="_blank" rel="noopener noreferrer" key={index}>
                                                    <Avatar variant="rounded" src={cert.url} alt={cert.name} sx={{ width: 120, height: 120, border: '2px solid', borderColor: 'primary.main', transition: 'transform 0.2s ease-in-out', '&:hover': { transform: 'scale(1.05)' } }} />
                                                </Link>
                                            ))}
                                        </Box>
                                    </Section>
                                )}
                            </>
                        )}
                    </Grid>
                </Grid>
            </Box>
            <DialogActions>
                {isEditMode ? (
                    <>
                        <Button onClick={handleCancel} disabled={isSaving}>
                            Cancel
                        </Button>
                        <CustomIconButton 
                            icon={<Save size={20} />} 
                            color="primary" 
                            text={isSaving ? "Saving..." : "Save"} 
                            onClick={handleSave}
                            disabled={isSaving}
                        />
                    </>
                ) : (
                    <CustomIconButton icon={<Close />} color="red" text="Close" onClick={onClose} />
                )}
            </DialogActions>
        </Dialog>
    );
};

export default StylistDetailsView;