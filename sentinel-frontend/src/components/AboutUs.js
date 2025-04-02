import React from 'react';
import { Box, Container, Typography, Grid, Card, Avatar, Paper, Divider, Button, TextField, IconButton, Link } from '@mui/material';
import { motion } from 'framer-motion';
import { FaLinkedin, FaEnvelope, FaCheck, FaHistory, FaMapMarkerAlt, FaPhone, FaLightbulb, FaHandshake, FaAward, FaRocket } from 'react-icons/fa';

const team = [
  {
    name: 'Dineshkumar L',
    role: 'ML Engineer',
    email: 'ldineshkumar38@gmail.com',
    linkedin: 'https://www.linkedin.com/in/dineshkumar-l/',
    image: '',
  },
  {
    name: 'Hemanth N',
    role: 'UI/UX Designer',
    email: 'hemanthviky@gmail.com',
    linkedin: 'https://www.linkedin.com/in/hemanth-narayanan/',
    image: '',
  },
  {
    name: 'Navaneeth S',
    role: 'Backend Developer',
    email: 'navaneeth.wb@gmail.com',
    linkedin: 'https://www.linkedin.com/in/navaneethsuresh22/',
    image: '',
  },
  {
    name: 'Sridhar G',
    role: 'Full Stack Developer',
    email: 'sridharG@gmail.com',
    linkedin: 'https://www.linkedin.com/in/sridhar006/',
    image: '',
  },
];

const companyValues = [
  {
    title: 'Innovation',
    description: 'Pushing the boundaries of what\'s possible in video analysis technology',
    icon: <FaLightbulb size={24} />,
    color: '#FF6B6B',
    delay: 0.1,
  },
  {
    title: 'Integrity',
    description: 'Maintaining the highest ethical standards in all our operations',
    icon: <FaCheck size={24} />,
    color: '#4ECDC4',
    delay: 0.2,
  },
  {
    title: 'Excellence',
    description: 'Committed to delivering exceptional quality in everything we do',
    icon: <FaAward size={24} />,
    color: '#FFD166',
    delay: 0.3,
  },
  {
    title: 'Collaboration',
    description: 'Working together to achieve remarkable results for our clients',
    icon: <FaHandshake size={24} />,
    color: '#6A0572',
    delay: 0.4,
  },
];

const AboutUs = () => {
  return (
    <Box
      id="about-us"
      sx={{
        py: 12,
        background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              mb: 2,
              background: 'linear-gradient(45deg, #1a1a1a 30%, #007FFF 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            About Us
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: '#666',
              maxWidth: '800px',
              mx: 'auto',
              mb: 8,
            }}
          >
            Meet our team of experts dedicated to revolutionizing video analysis technology
          </Typography>
        </motion.div>

        {/* Mission Statement Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 5 },
              mb: 8,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
              overflow: 'hidden',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '5px',
                background: 'linear-gradient(90deg, #007FFF, #00E5FF)',
              },
            }}
          >
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Box sx={{ position: 'relative' }}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 'bold',
                        mb: 3,
                        color: '#1a1a1a',
                        position: 'relative',
                        display: 'inline-block',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          bottom: -8,
                          left: 0,
                          width: '60px',
                          height: '4px',
                          background: '#007FFF',
                          borderRadius: '2px',
                        },
                      }}
                    >
                      Our Mission
                    </Typography>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#555',
                        lineHeight: 1.8,
                        mb: 3,
                        fontSize: '1.05rem',
                      }}
                    >
                      At <Box component="span" sx={{ color: '#007FFF', fontWeight: 'bold' }}>Sentinel Analysis</Box>, our mission is to transform the landscape of video analytics through cutting-edge AI technology. We strive to provide intelligent, accurate, and actionable insights from video data, empowering organizations to make informed decisions and enhance security measures.
                    </Typography>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    viewport={{ once: true }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: '#555',
                        lineHeight: 1.8,
                        fontSize: '1.05rem',
                      }}
                    >
                      We are committed to innovation, excellence, and integrity in all aspects of our work, ensuring that our solutions meet the highest standards of quality and reliability.
                    </Typography>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    viewport={{ once: true }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 3, gap: 2 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: 'rgba(0, 127, 255, 0.1)',
                      }}>
                        <FaRocket size={20} color="#007FFF" />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#666', fontStyle: 'italic' }}>
                        "Pioneering the future of intelligent video analysis"
                      </Typography>
                    </Box>
                  </motion.div>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Box
                    sx={{
                      width: '100%',
                      height: '100%',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: 4,
                      overflow: 'hidden',
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                      p: 4,
                    }}
                  >
                    <svg
                      width="100%"
                      height="300"
                      viewBox="0 0 800 600"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {/* Main Camera/Video Frame */}
                      <rect x="150" y="100" width="500" height="350" rx="20" fill="#f5f7fa" stroke="#007FFF" strokeWidth="8" />
                      
                      {/* Camera Lens */}
                      <circle cx="400" cy="275" r="100" fill="#e0e0e0" stroke="#333" strokeWidth="5" />
                      <circle cx="400" cy="275" r="80" fill="#f0f0f0" stroke="#555" strokeWidth="3" />
                      <circle cx="400" cy="275" r="60" fill="#fff" stroke="#777" strokeWidth="2" />
                      <circle cx="400" cy="275" r="40" fill="#007FFF" opacity="0.7" />
                      
                      {/* Scan Lines */}
                      <motion.line
                        x1="150"
                        y1="200"
                        x2="650"
                        y2="200"
                        stroke="#007FFF"
                        strokeWidth="2"
                        strokeDasharray="10,5"
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: 0.8 }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                      />
                      <motion.line
                        x1="150"
                        y1="350"
                        x2="650"
                        y2="350"
                        stroke="#007FFF"
                        strokeWidth="2"
                        strokeDasharray="10,5"
                        initial={{ opacity: 0.8 }}
                        animate={{ opacity: 0.3 }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                      />
                      
                      {/* Vertical Scan */}
                      <motion.line
                        x1="400"
                        y1="100"
                        x2="400"
                        y2="450"
                        stroke="#FF6B6B"
                        strokeWidth="2"
                        strokeDasharray="10,5"
                        initial={{ x1: 150, x2: 150 }}
                        animate={{ x1: 650, x2: 650 }}
                        transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                      />
                      
                      {/* Data Points */}
                      {[...Array(8)].map((_, i) => (
                        <motion.circle
                          key={i}
                          cx={250 + (i * 50)}
                          cy={150 + (i % 3) * 100}
                          r="6"
                          fill="#4ECDC4"
                          initial={{ opacity: 0.3, r: 3 }}
                          animate={{ opacity: 1, r: 6 }}
                          transition={{ 
                            duration: 0.8, 
                            repeat: Infinity, 
                            repeatType: "reverse",
                            delay: i * 0.2
                          }}
                        />
                      ))}
                      
                      {/* AI Processing Box */}
                      <rect x="300" y="480" width="200" height="60" rx="10" fill="#007FFF" opacity="0.9" />
                      <text x="400" y="520" fontFamily="Arial" fontSize="24" fill="white" textAnchor="middle">AI PROCESSING</text>
                      
                      {/* Connection Lines */}
                      <motion.path
                        d="M400 450 L400 480"
                        stroke="#007FFF"
                        strokeWidth="3"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: "loop", repeatDelay: 1 }}
                      />
                      
                      {/* Data Flow Indicators */}
                      {[...Array(3)].map((_, i) => (
                        <motion.circle
                          key={i}
                          cx="400"
                          cy="465"
                          r="4"
                          fill="white"
                          initial={{ cy: 450, opacity: 0 }}
                          animate={{ cy: 480, opacity: [0, 1, 0] }}
                          transition={{ 
                            duration: 1, 
                            repeat: Infinity, 
                            delay: i * 0.3,
                            times: [0, 0.5, 1]
                          }}
                        />
                      ))}
                      
                      {/* Recognition Boxes */}
                      <motion.rect
                        x="220"
                        y="200"
                        width="80"
                        height="80"
                        rx="5"
                        fill="none"
                        stroke="#FFD166"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 2 }}
                      />
                      <motion.rect
                        x="500"
                        y="250"
                        width="60"
                        height="60"
                        rx="5"
                        fill="none"
                        stroke="#FFD166"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse", repeatDelay: 1.5 }}
                      />
                    </svg>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Company Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Box sx={{ mb: 6, textAlign: 'center' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 'bold',
                  color: '#1a1a1a',
                  position: 'relative',
                  display: 'inline-block',
                  mb: 2,
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '80px',
                    height: '4px',
                    background: '#007FFF',
                    borderRadius: '2px',
                  },
                }}
              >
                Our Core Values
              </Typography>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Typography variant="body1" sx={{ maxWidth: '700px', mx: 'auto', color: '#666', mt: 3 }}>
                These principles guide everything we do, from product development to customer service
              </Typography>
            </motion.div>
          </Box>
          <Grid container spacing={3} sx={{ mb: 8 }}>
            {companyValues.map((value, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: value.delay }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      borderRadius: 4,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      },
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '4px',
                        background: value.color,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        backgroundColor: `${value.color}20`,
                        color: value.color,
                        mb: 2,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'rotate(10deg)',
                        },
                      }}
                    >
                      {value.icon}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        mb: 1,
                        color: '#1a1a1a',
                      }}
                    >
                      {value.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#666',
                        lineHeight: 1.6,
                      }}
                    >
                      {value.description}
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              mb: 6,
              color: '#1a1a1a',
            }}
          >
            Meet Our Team
          </Typography>
          <Grid container spacing={4} sx={{ mb: 8 }}>
            {team.map((member, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      p: 3,
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      background: '#fff',
                      borderRadius: 4,
                      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-10px)',
                      },
                    }}
                  >
                    <Avatar
                      src={member.image}
                      sx={{
                        width: 120,
                        height: 120,
                        mb: 2,
                        border: '4px solid #fff',
                        boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 'bold',
                        mb: 1,
                        color: '#1a1a1a',
                      }}
                    >
                      {member.name}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: '#007FFF',
                        mb: 2,
                        fontWeight: 500,
                      }}
                    >
                      {member.role}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 2,
                        color: '#666',
                        '& svg': {
                          cursor: 'pointer',
                          transition: 'color 0.3s ease',
                          '&:hover': {
                            color: '#007FFF',
                          },
                        },
                      }}
                    >
                      <Link 
                        href={`mailto:${member.email}?subject=Inquiry from Sentinel Analysis Website`} 
                        color="inherit"
                        aria-label={`Email ${member.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <FaEnvelope size={20} title={`Email ${member.name} at ${member.email}`} />
                      </Link>
                      <Link 
                        href={member.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        color="inherit"
                        aria-label={`${member.name}'s LinkedIn Profile`}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        <FaLinkedin size={20} title={`${member.name}'s LinkedIn Profile`} />
                      </Link>
                    </Box>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 5,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #f5f7fa 100%)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.05)',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                mb: 4,
                color: '#1a1a1a',
              }}
            >
              Get In Touch
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Box sx={{ mb: 3 }}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Your Email"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Subject"
                    variant="outlined"
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Message"
                    variant="outlined"
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                  />
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor: '#007FFF',
                      py: 1.5,
                      px: 4,
                      borderRadius: 2,
                      '&:hover': {
                        backgroundColor: '#0059b3',
                      },
                    }}
                  >
                    Send Message
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} md={6}>
                <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      mb: 3,
                      color: '#1a1a1a',
                    }}
                  >
                    Contact Information
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconButton
                      sx={{
                        backgroundColor: '#f5f5f5',
                        mr: 2,
                        '&:hover': {
                          backgroundColor: '#e0e0e0',
                        },
                      }}
                    >
                      <FaMapMarkerAlt color="#007FFF" />
                    </IconButton>
                    <Typography variant="body1" color="#666">
                      Coimbatore, Tamil Nadu, India
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <IconButton
                      sx={{
                        backgroundColor: '#f5f5f5',
                        mr: 2,
                        '&:hover': {
                          backgroundColor: '#e0e0e0',
                        },
                      }}
                    >
                      <FaEnvelope color="#007FFF" />
                    </IconButton>
                    <Typography variant="body1" color="#666">
                      contact@sentinelanalysis.com
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      sx={{
                        backgroundColor: '#f5f5f5',
                        mr: 2,
                        '&:hover': {
                          backgroundColor: '#e0e0e0',
                        },
                      }}
                    >
                      <FaPhone color="#007FFF" />
                    </IconButton>
                    <Typography variant="body1" color="#666">
                      +91 000-00-00-000
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default AboutUs;
