import React from "react";
import { Box, Card, CardContent, Grid, Typography, Divider, Chip, useTheme, LinearProgress, CircularProgress } from "@mui/material";
import { tokens } from "../../theme";
import { Header } from "../../components";
import useStylistProfile from "../../hooks/useStylistProfile";

const Services = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { profile, loading, error } = useStylistProfile();

    if (loading) return <CircularProgress />;

  return (
    <Box m="20px">
      {(loading || !profile) && <LinearProgress sx={{ mb: 2 }} />}
      <Header title="Services" />
      {(!profile) ? null : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={12} lg={12}>
            <Card
              sx={{
                borderRadius: 4,
                backgroundColor: colors.cardBackground,
                boxShadow: "0 4px 24px rgba(31, 38, 135, 0.10)",
                mb: 3,
                p: 2,
              }}
            >
              <CardContent>
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
                          {/* Floating info card */}
                          <Box sx={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            px: 2,
                            py: 1.5,
                            zIndex: 2,
                            color: '#fff',
                            textAlign: 'center',
                          }}>
                            <Typography variant="subtitle1" fontWeight={700} sx={{ fontFamily: 'Poppins, sans-serif', textShadow: '0 2px 8px #000', color: '#fff' }}>
                              {item.service?.name || <span style={{ color: '#eee' }}>No Service</span>}
                            </Typography>
                            {item?.subService?.name && (
                              <Typography variant="body2" sx={{ fontFamily: 'Poppins, sans-serif', textShadow: '0 1px 4px #000', opacity: 0.85, color: '#fff' }}>
                                {item.subService.name}
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
                                sx={{ fontWeight: 600, fontFamily: 'Poppins, sans-serif', fontSize: 14, px: 1.5, boxShadow: item.isActive ? '0 0 8px #4caf50aa' : '0 0 8px #f44336aa', color: '#fff', background: item.isActive ? colors.greenAccent[600] : colors.redAccent[600] }}
                              />
                              {item.coupons && item.coupons.length > 0 && (
                                <Chip
                                  label={`Coupons: ${item.coupons.length}`}
                                  color="secondary"
                                  size="small"
                                  sx={{ fontWeight: 600, fontFamily: 'Poppins, sans-serif', fontSize: 14, px: 1.5, boxShadow: '0 0 8px #7c3aed44', color: '#fff', background: colors.primary[600] }}
                                  title="Number of coupons available for this service"
                                />
                              )}
                            </Box>
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
    </Box>
  );
};

export default Services;
