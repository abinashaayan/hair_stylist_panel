import React from "react";
import { Box, Card, CardContent, Grid, Typography, useTheme, LinearProgress } from "@mui/material";
import { tokens } from "../../theme";
import { Header } from "../../components";
import useStylistProfile from "../../hooks/useStylistProfile";

const portfolio = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { profile, loading, error } = useStylistProfile();
  console.log('Profile response', profile);

  return (
    <Box m="20px">
      {(loading || !profile) && <LinearProgress sx={{ mb: 2 }} />}
      <Header title="Portfolio" />
      {(!profile) ? null : (
        <Grid container spacing={2}>
          <Grid item xs={12} md={12} lg={12}>
            <Card sx={{ borderRadius: 4, backgroundColor: colors.cardBackground, boxShadow: '0 4px 24px rgba(31, 38, 135, 0.10)', mb: 3, p: 2, }}>
              <CardContent>
                <Grid container spacing={2}>
                  {profile?.doc?.portfolio?.length === 0 && (
                    <Grid item xs={12}>
                      <Typography color="textSecondary">No portfolio items available.</Typography>
                    </Grid>
                  )}
                  {profile?.doc?.portfolio?.map((item) => (
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
    </Box>
  );
};

export default portfolio; 