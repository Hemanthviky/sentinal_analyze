import React from 'react';
import { Box, Container, Grid, Typography, IconButton, Button, TextField } from '@mui/material';
import { motion } from 'framer-motion';
import { FaFacebook, FaTwitter, FaLinkedin, FaGithub, FaEye, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');

  const handleNavigation = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert('Thank you for subscribing to our newsletter!');
    setEmail('');
  };

  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d3436 100%)',
        color: '#fff',
        pt: 8,
        pb: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background element */}
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        sx={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, #007FFF 0%, transparent 70%)',
          filter: 'blur(60px)',
          top: '-20%',
          right: '-10%',
          zIndex: 0,
        }}
      />

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <FaEye size={24} color="#007FFF" />
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                Sentinel <span style={{ color: '#007FFF' }}>Vision</span>
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#999', maxWidth: 300, mb: 3 }}>
              Revolutionizing video analysis with cutting-edge AI technology.
              Our solutions provide accurate, real-time insights for enhanced security and analytics.
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FaMapMarkerAlt color="#007FFF" />
                <Typography variant="body2" sx={{ color: '#999' }}>
                  Coimbatore, Tamil Nadu, India
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FaPhone color="#007FFF" />
                <Typography variant="body2" sx={{ color: '#999' }}>
                  +91 000-00-00-000
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <FaEnvelope color="#007FFF" />
                <Typography variant="body2" sx={{ color: '#999' }}>
                  contact@sentinelvision.com
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Quick Links
            </Typography>
            {['Home', 'Services', 'How It Works', 'About Us'].map((item) => (
              <Button
                key={item}
                onClick={() => handleNavigation(`/${item.toLowerCase().replace(' ', '-')}`)}
                sx={{
                  color: '#999',
                  display: 'block',
                  textAlign: 'left',
                  '&:hover': {
                    color: '#007FFF',
                    background: 'transparent',
                  },
                }}
              >
                {item}
              </Button>
            ))}
          </Grid>

          {/* Services */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Our Services
            </Typography>
            {[
              'Person Detection',
              'Face Detection',
              'Number Plate Detection',
              'Video Analytics',
            ].map((service) => (
              <Button
                key={service}
                onClick={() => handleNavigation('/services')}
                sx={{
                  color: '#999',
                  display: 'block',
                  textAlign: 'left',
                  '&:hover': {
                    color: '#007FFF',
                    background: 'transparent',
                  },
                }}
              >
                {service}
              </Button>
            ))}
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 'bold' }}>
              Newsletter
            </Typography>
            <Typography variant="body2" sx={{ color: '#999', mb: 2 }}>
              Subscribe to our newsletter for updates, insights, and special offers.
            </Typography>
            <Box
              component="form"
              onSubmit={handleSubscribe}
              sx={{
                display: 'flex',
                gap: 1,
                mb: 3,
              }}
            >
              <TextField
                size="small"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.23)',
                    },
                    '&:hover fieldset': {
                      borderColor: '#007FFF',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#007FFF',
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                sx={{
                  background: '#007FFF',
                  '&:hover': {
                    background: '#0059B2',
                  },
                }}
              >
                Subscribe
              </Button>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              {[FaFacebook, FaTwitter, FaLinkedin, FaGithub].map((Icon, index) => (
                <IconButton
                  key={index}
                  sx={{
                    color: '#999',
                    '&:hover': {
                      color: '#007FFF',
                      background: 'rgba(0, 127, 255, 0.1)',
                    },
                  }}
                >
                  <Icon size={20} />
                </IconButton>
              ))}
            </Box>
          </Grid>
        </Grid>

        {/* Copyright */}
        <Box
          sx={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            mt: 6,
            pt: 3,
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: '#999' }}>
            {new Date().getFullYear()} Sentinel Vision. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
