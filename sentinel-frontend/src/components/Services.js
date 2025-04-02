import React from 'react';
import { Box, Container, Typography, Grid, Card, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { FaUserFriends, FaCamera, FaCar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const services = [
  {
    icon: <FaUserFriends size={40} />,
    title: 'Person In/Out Detection',
    description: 'Advanced AI-powered system to track and analyze people entering and exiting specific areas. Perfect for security and crowd management.',
    color: '#4CAF50',
    route: '/people-detection'
  },
  {
    icon: <FaCamera size={40} />,
    title: 'Face Detection',
    description: 'State-of-the-art facial detection technology that can identify and track faces in real-time video streams with high accuracy.',
    color: '#2196F3',
    route: '/face-detection'
  },
  {
    icon: <FaCar size={40} />,
    title: 'Number Plate Detection',
    description: 'Automated number plate recognition system that can detect and read vehicle license plates in various conditions.',
    color: '#9C27B0',
    route: '/plate-detection'
  },
];

const Services = () => {
  const navigate = useNavigate();

  const handleServiceClick = (route) => {
    navigate(route);
  };

  return (
    <Box
      id="services"
      sx={{
        py: 12,
        background: 'linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%)',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                background: 'linear-gradient(45deg, #1a1a1a 30%, #007FFF 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Our Services
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#666',
                maxWidth: '800px',
                mx: 'auto',
                mb: 6,
              }}
            >
              Cutting-edge video analysis solutions powered by advanced AI technology
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={4}>
          {services.map((service, index) => (
            <Grid item xs={12} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <Card
                  sx={{
                    p: 4,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    background: '#fff',
                    borderRadius: 4,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      boxShadow: `0 8px 30px rgba(${service.color}, 0.2)`,
                    },
                  }}
                  onClick={() => handleServiceClick(service.route)}
                >
                  <Box
                    sx={{
                      color: service.color,
                      mb: 3,
                      transform: 'scale(1)',
                      transition: 'transform 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.1)',
                      },
                    }}
                  >
                    {service.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      mb: 2,
                      color: '#1a1a1a',
                    }}
                  >
                    {service.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#666',
                      mb: 3,
                      flex: 1,
                    }}
                  >
                    {service.description}
                  </Typography>
                  <Button
                    variant="outlined"
                    sx={{
                      color: service.color,
                      borderColor: service.color,
                      '&:hover': {
                        borderColor: service.color,
                        background: `${service.color}10`,
                      },
                    }}
                  >
                    Try Now
                  </Button>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Services;
