import React from 'react';
import { Box, Container, Typography, Grid, Card } from '@mui/material';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaCogs, FaChartLine } from 'react-icons/fa';

const steps = [
  {
    icon: <FaCloudUploadAlt size={40} />,
    title: 'Upload Your Video',
    description: 'Simply upload your video file through our secure platform. We support all major video formats.',
  },
  {
    icon: <FaCogs size={40} />,
    title: 'AI Processing',
    description: 'Our advanced AI algorithms analyze your video content in real-time, extracting valuable insights.',
  },
  {
    icon: <FaChartLine size={40} />,
    title: 'Get Results',
    description: 'Receive detailed analysis reports and actionable insights about your video content.',
  },
];

const HowItWorks = () => {
  return (
    <Box
      id="how-it-works"
      sx={{
        py: 12,
        background: '#f8f9fa',
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
                color: '#1a1a1a',
              }}
            >
              How It Works
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: '#666',
                maxWidth: '600px',
                mx: 'auto',
              }}
            >
              Get started with Sentinel Analysis in three simple steps
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={4}>
          {steps.map((step, index) => (
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
                    borderRadius: 2,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                    },
                  }}
                >
                  <Box
                    sx={{
                      color: '#007FFF',
                      mb: 2,
                    }}
                  >
                    {step.icon}
                  </Box>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 'bold',
                      mb: 2,
                      color: '#1a1a1a',
                    }}
                  >
                    {step.title}
                  </Typography>
                  <Typography
                    sx={{
                      color: '#666',
                    }}
                  >
                    {step.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default HowItWorks;
