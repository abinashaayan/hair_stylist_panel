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
    TextField
} from '@mui/material';
import { Briefcase, Building2, Calendar, GraduationCap, Mail, Phone, Sparkles, Star, User, Award, MapPin, Linkedin, Share2, Image, Pencil, Save, X } from 'lucide-react';
import { CustomIconButton } from '../custom/Button';
import { Close, Facebook, Instagram } from '@mui/icons-material';

function formatTime(time24) {
    const [hour, minute] = time24.split(':').map(Number);
    const period = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minute.toString().padStart(2, '0')} ${period}`;
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


const StylistDetailsView = ({ open, onClose, data }) => {
    if (!data || data.role !== 'stylist') return null;

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
            <DialogTitle sx={{ pb: 1, textTransform: 'capitalize' }}>{data.role} Details: {data.fullName}</DialogTitle>
            <Box sx={{ backgroundColor: '#f4f6f8', p: { xs: 1, md: 2 } }}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={5}>
                        <Section title="Personal Information" icon={<User size={24} />}>
                            <DetailItem icon={<User size={20} />} label="Full Name" value={data.fullName} />
                            <DetailItem icon={<Mail size={20} />} label="Email" value={data.email} />
                            <DetailItem icon={<Calendar size={20} />} label="DOB" value={data.dob ? new Date(data.dob).toLocaleDateString() : 'N/A'} />
                            <DetailItem icon={<Phone size={20} />} label="Phone" value={data.phoneNumber} />
                            <DetailItem icon={<MapPin size={20} />} label="Address" value={data.address} />
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
                        {data.socialMediaLinks && (
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
                                {data.education?.length > 0 && (
                                    <Section title="Education" icon={<GraduationCap size={24} />}>
                                        <Stack spacing={2}>
                                            {data.education.map((edu, index) => (
                                                <Box key={index} sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1.5 }}>
                                                    <Typography sx={{ fontWeight: 'bold' }}>{edu.degree}</Typography>
                                                    <Typography variant="body2">{edu.institute}, {edu.year}</Typography>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Section>
                                )}
                                {data.experience?.length > 0 && (
                                    <Section title="Experience" icon={<Briefcase size={24} />}>
                                        <Stack spacing={2}>
                                            {data.experience.map((exp, index) => (
                                                <Box key={index} sx={{ p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1.5 }}>
                                                    <Typography sx={{ fontWeight: 'bold' }}>{exp.role} at {exp.salon}</Typography>
                                                    <Typography variant="body2">Duration: {exp.duration}</Typography>
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
                <CustomIconButton icon={<Close />} color="red" text="Close" onClick={onClose} />
            </DialogActions>
        </Dialog>
    );
};

export default StylistDetailsView;