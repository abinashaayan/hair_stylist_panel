import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid,
    Chip,
    Paper,
    Link,
    Avatar,
    Divider,
    Stack
} from '@mui/material';
import { Briefcase, Building2, Calendar, CheckCircle2, GraduationCap, Mail, Phone, Sparkles, Star, User, Award, MapPin } from 'lucide-react';

const DetailItem = ({ icon, label, value, fullWidth = false }) => (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ py: 1.5, borderBottom: '1px solid #f0f0f0' }}>
        {icon && <Box sx={{ color: 'primary.main' }}>{icon}</Box>}
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', minWidth: '120px' }}>{label}</Typography>
        {typeof value === 'boolean' ? (
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
        <Divider sx={{ mb: 2 }}/>
        {children}
    </Paper>
);

const CustomerDetailsView = ({ data }) => (
    <Box sx={{ backgroundColor: '#f4f6f8', p: { xs: 1, md: 2 } }}>
        <Section title="Customer Information" icon={<User size={24} />}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <DetailItem icon={<User size={20} />} label="Full Name" value={data.fullName} />
                    <DetailItem icon={<Mail size={20} />} label="Email" value={data.email} />
                    <DetailItem icon={<Calendar size={20} />} label="Age" value={data.age} />
                    <DetailItem icon={<User size={20} />} label="Gender" value={data.gender} />
                </Grid>
                <Grid item xs={12} md={6}>
                    <DetailItem icon={<Phone size={20} />} label="Phone" value={data.phoneNumber} />
                    <DetailItem icon={<CheckCircle2 size={20} />} label="Verified" value={data.isPhoneVerified} />
                    <DetailItem icon={<Calendar size={20} />} label="Joined On" value={new Date(data.createdAt).toLocaleString()} />
                </Grid>
                <Grid item xs={12}>
                    <DetailItem 
                        icon={<MapPin size={20} />} 
                        label="Address" 
                        value={`${data.addressLine1 || ''}, ${data.addressLine2 || ''}, ${data.city || ''}, ${data.region || ''} - ${data.postalCode || ''}`} 
                    />
                </Grid>
            </Grid>
        </Section>
    </Box>
);

const StylistDetailsView = ({ data }) => (
    <Box sx={{ backgroundColor: '#f4f6f8', p: { xs: 1, md: 2 } }}>
        <Grid container spacing={3}>
            <Grid item xs={12} md={5}>
                 <Section title="Personal Information" icon={<User size={24}/>}>
                    <DetailItem icon={<User size={20}/>} label="Full Name" value={data.fullName} />
                    <DetailItem icon={<Mail size={20}/>} label="Email" value={data.email} />
                    <DetailItem icon={<Calendar size={20}/>} label="DOB" value={data.dob ? new Date(data.dob).toLocaleDateString() : 'N/A'} />
                    <DetailItem icon={<Phone size={20}/>} label="Phone" value={data.phoneNumber} />
                    <DetailItem icon={<MapPin size={20}/>} label="Address" value={data.address} />
                 </Section>
                 
                 {data.about && (
                    <Section title="Shop Details" icon={<Building2 size={24}/>}>
                        <DetailItem icon={<Star size={20}/>} label="Shop Name" value={data.about.shopName} />
                        <DetailItem icon={<Phone size={20}/>} label="Timings" value={data.about.timings ? `${data.about.timings.from} - ${data.about.timings.till}` : 'N/A'} />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, p: 1, background: '#fff', borderRadius: 1 }}>{data.about.about}</Typography>
                    </Section>
                 )}
            </Grid>

            <Grid item xs={12} md={7}>
                {data.expertise?.length > 0 && (
                    <Section title="Expertise" icon={<Sparkles size={24} />}>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {data.expertise.map((exp, i) => <Chip key={i} label={exp} color="primary" variant="outlined" />)}
                        </Box>
                    </Section>
                )}

                {data.education?.length > 0 && (
                    <Section title="Education" icon={<GraduationCap size={24}/>}>
                        <Stack spacing={2}>
                            {data.education.map((edu, index) => (
                                <Box key={index} sx={{p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1.5}}>
                                    <Typography sx={{ fontWeight: 'bold' }}>{edu.degree}</Typography>
                                    <Typography variant="body2">{edu.institute}, {edu.year}</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Section>
                )}
                
                {data.experience?.length > 0 && (
                     <Section title="Experience" icon={<Briefcase size={24}/>}>
                        <Stack spacing={2}>
                            {data.experience.map((exp, index) => (
                                <Box key={index} sx={{p: 1.5, border: '1px solid #e0e0e0', borderRadius: 1.5}}>
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
            </Grid>
        </Grid>
    </Box>
);

const ShowDetailsDialog = ({ open, onClose, data }) => {
    if (!data) {
        return null;
    }

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle sx={{ pb: 1, textTransform: 'capitalize' }}>{data.role} Details: {data.fullName}</DialogTitle>
            <DialogContent dividers sx={{ p: 0, '&.MuiDialogContent-root': { p: 0 } }}>
                {data.role === 'stylist' 
                    ? <StylistDetailsView data={data} /> 
                    : <CustomerDetailsView data={data} />
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ShowDetailsDialog;
