import React, { useCallback } from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { FaShieldAlt, FaChartLine, FaRobot, FaVideo, FaServer, FaLock } from 'react-icons/fa';

const features = [
  {
    icon: <FaShieldAlt size={30} />,
    title: 'Enhanced Security',
    description: 'Real-time monitoring and instant alerts for security threats',
  },
  {
    icon: <FaChartLine size={30} />,
    title: 'Advanced Analytics',
    description: 'Detailed insights and patterns from video data',
  },
  {
    icon: <FaRobot size={30} />,
    title: 'AI-Powered',
    description: 'State-of-the-art machine learning algorithms',
  },
];

// Theme colors
const theme = {
  primary: '#6200EA', // Deep purple
  secondary: '#00E5FF', // Cyan
  dark: '#1A1A2E', // Dark blue-black
  light: '#FFFFFF',
  accent: '#FF4081', // Pink accent
  gradient: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
};

// Optimized animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Hero = () => {
  // Memoized SVG elements for better performance
  const renderDataPoints = useCallback(() => {
    return [...Array(12)].map((_, index) => {
      const angle = (index * 30 * Math.PI) / 180;
      const radius = 120;
      return (
        <motion.circle
          key={index}
          cx={250 + radius * Math.cos(angle)}
          cy={250 + radius * Math.sin(angle)}
          r="4"
          fill={index % 3 === 0 ? theme.accent : theme.secondary}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0.5, 1, 0.5]
          }}
          transition={{ 
            duration: 2,
            delay: index * 0.15,
            repeat: Infinity
          }}
        />
      );
    });
  }, []);

  const renderScanLines = useCallback(() => {
    return [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, index) => (
      <motion.line
        key={index}
        x1="250"
        y1="250"
        x2={250 + 150 * Math.cos((angle * Math.PI) / 180)}
        y2={250 + 150 * Math.sin((angle * Math.PI) / 180)}
        stroke={index % 3 === 0 ? `${theme.accent}40` : `${theme.secondary}40`}
        strokeWidth="2"
        initial={{ pathLength: 0 }}
        animate={{ 
          pathLength: [0, 1],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{ 
          duration: 2,
          delay: index * 0.08,
          repeat: Infinity,
          repeatType: "reverse"
        }}
      />
    ));
  }, []);

  // New function to render data nodes
  const renderDataNodes = useCallback(() => {
    return [...Array(6)].map((_, index) => {
      const angle = (index * 60 * Math.PI) / 180;
      const radius = 180;
      const x = 250 + radius * Math.cos(angle);
      const y = 250 + radius * Math.sin(angle);
      
      return (
        <React.Fragment key={`node-${index}`}>
          {/* Node */}
          <motion.circle
            cx={x}
            cy={y}
            r="8"
            fill={theme.primary}
            stroke={theme.light}
            strokeWidth="1"
            initial={{ scale: 0 }}
            animate={{ 
              scale: [0, 1, 0.8, 1],
              opacity: [0, 1]
            }}
            transition={{ 
              duration: 1.5,
              delay: 1 + index * 0.2,
              repeat: Infinity,
              repeatDelay: 5,
            }}
          />
          
          {/* Connection line to center */}
          <motion.line
            x1="250"
            y1="250"
            x2={x}
            y2={y}
            stroke={`${theme.primary}60`}
            strokeWidth="1"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ 
              duration: 1,
              delay: 1.5 + index * 0.2
            }}
          />
          
          {/* Data flow along connection */}
          <motion.circle
            cx="250"
            cy="250"
            r="3"
            fill={theme.accent}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              x: [0, x - 250],
              y: [0, y - 250]
            }}
            transition={{ 
              duration: 2,
              delay: 2 + index * 0.3,
              repeat: Infinity,
              repeatDelay: 3
            }}
          />
        </React.Fragment>
      );
    });
  }, []);

  // Binary data visualization
  const renderBinaryData = useCallback(() => {
    const binaryElements = [];
    const binaryChars = ['0', '1'];
    
    for (let i = 0; i < 20; i++) {
      const x = 150 + Math.random() * 200;
      const y = 150 + Math.random() * 200;
      const char = binaryChars[Math.floor(Math.random() * binaryChars.length)];
      
      binaryElements.push(
        <motion.text
          key={`binary-${i}`}
          x={x}
          y={y}
          fill={`${theme.light}40`}
          fontSize="10"
          fontFamily="monospace"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.7, 0],
          }}
          transition={{ 
            duration: 3,
            delay: Math.random() * 5,
            repeat: Infinity,
            repeatDelay: Math.random() * 2
          }}
        >
          {char}
        </motion.text>
      );
    }
    
    return binaryElements;
  }, []);

  // AI processing visualization
  const renderAIProcessing = useCallback(() => {
    return (
      <g>
        {/* Central processing unit */}
        <motion.rect
          x="225"
          y="225"
          width="50"
          height="50"
          rx="5"
          fill={`${theme.primary}30`}
          stroke={theme.primary}
          strokeWidth="2"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ 
            opacity: 1,
            scale: 1,
            rotate: [0, 0, 180, 180, 0],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            times: [0, 0.4, 0.5, 0.9, 1]
          }}
        />
        
        {/* Processing pulses */}
        <motion.circle
          cx="250"
          cy="250"
          r="15"
          fill="none"
          stroke={theme.accent}
          strokeWidth="2"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.2],
            opacity: [0, 0.8, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 0.5
          }}
        />
        
        {/* CPU connection lines */}
        {[0, 45, 90, 135].map((angle, i) => (
          <motion.line
            key={`cpu-line-${i}`}
            x1="250"
            y1="250"
            x2={250 + 30 * Math.cos((angle * Math.PI) / 180)}
            y2={250 + 30 * Math.sin((angle * Math.PI) / 180)}
            stroke={theme.accent}
            strokeWidth="1.5"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
            }}
            transition={{ 
              duration: 1,
              delay: i * 0.25,
              repeat: Infinity,
              repeatDelay: 1
            }}
          />
        ))}
      </g>
    );
  }, []);

  // Video feed frames
  const renderVideoFrames = useCallback(() => {
    return [...Array(3)].map((_, index) => {
      const offsetX = 80 * (index - 1);
      
      return (
        <motion.g key={`frame-${index}`}>
          <motion.rect
            x={250 + offsetX - 25}
            y={150}
            width="50"
            height="35"
            rx="2"
            fill="none"
            stroke={`${theme.secondary}80`}
            strokeWidth="1"
            initial={{ opacity: 0, y: -20 }}
            animate={{ 
              opacity: [0, 1, 0],
              y: [-20, 0, 20]
            }}
            transition={{ 
              duration: 3,
              delay: index * 1,
              repeat: Infinity,
              repeatDelay: 2
            }}
          />
          
          {/* Frame content lines */}
          {[...Array(3)].map((_, lineIndex) => (
            <motion.line
              key={`frame-line-${index}-${lineIndex}`}
              x1={250 + offsetX - 20}
              y1={158 + lineIndex * 10}
              x2={250 + offsetX + 20}
              y2={158 + lineIndex * 10}
              stroke={`${theme.secondary}60`}
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ 
                duration: 3,
                delay: index * 1 + 0.2,
                repeat: Infinity,
                repeatDelay: 2
              }}
            />
          ))}
        </motion.g>
      );
    });
  }, []);

  return (
    <Box
      sx={{
        background: theme.gradient,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 4, md: 8 },
      }}
    >
      {/* Animated background elements */}
      <Box
        component={motion.div}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        sx={{
          position: 'absolute',
          width: { xs: '300px', md: '500px' },
          height: { xs: '300px', md: '500px' },
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.secondary} 0%, transparent 70%)`,
          filter: 'blur(60px)',
          top: '-20%',
          right: '-10%',
        }}
      />

      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <motion.div
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
                    lineHeight: 1.2,
                    color: theme.light,
                    mb: 3,
                  }}
                >
                  Intelligent Video Analysis with{' '}
                  <Box
                    component="span"
                    sx={{
                      color: theme.secondary,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: '-4px',
                        left: 0,
                        width: '100%',
                        height: '2px',
                        background: theme.secondary,
                      },
                    }}
                  >
                    AI Technology
                  </Box>
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    color: `${theme.light}CC`,
                    mb: 4,
                    fontSize: { xs: '1rem', sm: '1.2rem', md: '1.4rem' },
                    lineHeight: 1.6,
                  }}
                >
                  Transform your surveillance system with cutting-edge AI technology for real-time threat detection and advanced analytics.
                </Typography>

                <Grid container spacing={3} sx={{ mt: 2 }}>
                  {features.map((feature, index) => (
                    <Grid item xs={12} sm={4} key={index}>
                      <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                        transition={{ duration: 0.5, delay: index * 0.2 }}
                      >
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            p: 2,
                            backgroundColor: `${theme.light}0A`,
                            borderRadius: '12px',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              backgroundColor: `${theme.light}15`,
                              boxShadow: `0 10px 20px -10px ${theme.secondary}40`,
                            },
                          }}
                        >
                          <Box sx={{ color: theme.secondary, mb: 2 }}>{feature.icon}</Box>
                          <Typography
                            variant="h6"
                            sx={{ color: theme.light, mb: 1, fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' } }}
                          >
                            {feature.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: `${theme.light}B3`, fontSize: { xs: '0.875rem', sm: '0.9rem', md: '1rem' } }}
                          >
                            {feature.description}
                          </Typography>
                        </Box>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box
                sx={{
                  position: 'relative',
                  width: '100%',
                  height: { xs: '300px', sm: '400px', md: '500px' },
                  display: { xs: 'none', sm: 'block' },
                }}
              >
                <svg
                  viewBox="0 0 500 500"
                  style={{
                    width: '100%',
                    height: '100%',
                    filter: `drop-shadow(0px 4px 20px ${theme.secondary}40)`,
                  }}
                >
                  {/* Background grid */}
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.15 }}
                    transition={{ duration: 2 }}
                  >
                    {[...Array(10)].map((_, i) => (
                      <line
                        key={`grid-h-${i}`}
                        x1="50"
                        y1={50 + i * 40}
                        x2="450"
                        y2={50 + i * 40}
                        stroke={theme.light}
                        strokeWidth="0.5"
                        strokeDasharray="2,8"
                      />
                    ))}
                    {[...Array(10)].map((_, i) => (
                      <line
                        key={`grid-v-${i}`}
                        x1={50 + i * 40}
                        y1="50"
                        x2={50 + i * 40}
                        y2="450"
                        stroke={theme.light}
                        strokeWidth="0.5"
                        strokeDasharray="2,8"
                      />
                    ))}
                  </motion.g>

                  {/* Binary data visualization */}
                  {renderBinaryData()}
                  
                  {/* Video feed frames */}
                  {renderVideoFrames()}

                  {/* Outer eye shape - optimized path */}
                  <motion.path
                    d="M100,250 C100,250 250,400 400,250 C400,250 250,100 100,250"
                    fill="none"
                    stroke={theme.secondary}
                    strokeWidth="4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                  
                  {/* Iris */}
                  <motion.circle
                    cx="250"
                    cy="250"
                    r="60"
                    fill={`${theme.secondary}1A`}
                    stroke={theme.secondary}
                    strokeWidth="3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1, delay: 1 }}
                  />

                  {/* Pupil */}
                  <motion.circle
                    cx="250"
                    cy="250"
                    r="25"
                    fill={theme.secondary}
                    initial={{ scale: 0 }}
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{ 
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  />

                  {/* AI processing visualization in the center */}
                  {renderAIProcessing()}

                  {/* Scanning lines - using memoized function */}
                  <motion.g
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 2 }}
                  >
                    {renderScanLines()}
                  </motion.g>

                  {/* Circular scan effect */}
                  <motion.circle
                    cx="250"
                    cy="250"
                    r="100"
                    fill="none"
                    stroke={`${theme.secondary}33`}
                    strokeWidth="2"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ 
                      scale: [0.5, 1.5],
                      opacity: [0.5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                  />

                  {/* Data points - using memoized function */}
                  {renderDataPoints()}
                  
                  {/* Data nodes and connections */}
                  {renderDataNodes()}
                  
                  {/* Security shield icon */}
                  <motion.g
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 3 }}
                  >
                    <path
                      d="M250,350 L230,340 L250,330 L270,340 Z"
                      fill={theme.accent}
                      stroke={theme.light}
                      strokeWidth="1"
                    />
                    <motion.path
                      d="M250,350 L230,340 L250,330 L270,340 Z"
                      fill="none"
                      stroke={theme.light}
                      strokeWidth="1"
                      initial={{ opacity: 0 }}
                      animate={{ 
                        opacity: [0, 1, 0],
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    />
                  </motion.g>
                  
                  {/* Connection lines between components */}
                  <motion.path
                    d="M250,350 C250,350 300,320 320,280 C340,240 330,200 320,180"
                    fill="none"
                    stroke={`${theme.accent}60`}
                    strokeWidth="1.5"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: 3.5 }}
                  />
                  
                  {/* Data flow indicators */}
                  <motion.circle
                    cx="0"
                    cy="0"
                    r="3"
                    fill={theme.accent}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      offsetDistance: ['0%', '100%']
                    }}
                    style={{
                      offsetPath: "path('M250,350 C250,350 300,320 320,280 C340,240 330,200 320,180')"
                    }}
                    transition={{ 
                      duration: 3,
                      delay: 4,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                  />
                </svg>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero;
