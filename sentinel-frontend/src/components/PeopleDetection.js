import React, { useState, useCallback, useEffect } from 'react';
import { Box, Container, Typography, Button, LinearProgress, Alert, Grid, Paper, Stepper, Step, StepLabel, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { FaUserFriends, FaUpload, FaVideo, FaRobot, FaChartBar, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

// Theme colors
const theme = {
  primary: '#007FFF', // Main blue
  secondary: '#00E5FF', // Cyan
  dark: '#1A1A2E', // Dark blue-black
  light: '#FFFFFF',
  accent: '#FF4081', // Pink accent
  success: '#4CAF50', // Green
  warning: '#FFC107', // Yellow
  error: '#F44336', // Red
  gradient: 'linear-gradient(135deg, #1A1A2E 0%, #16213E 100%)',
};

// Processing steps
const processingSteps = ['Upload', 'Pre-processing', 'Detection', 'Analysis', 'Results'];

const PeopleDetection = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('idle'); // 'idle', 'processing', 'success', 'error', 'complete'
  const [countData, setCountData] = useState({ entering: 0, exiting: 0 });
  const [isRealTimeCounting, setIsRealTimeCounting] = useState(false);
  const countingIntervalRef = React.useRef(null);

  // Simulated progress for visualization purposes
  useEffect(() => {
    let timer;
    if (uploading) {
      timer = setInterval(() => {
        setProgress((prevProgress) => {
          const newProgress = prevProgress + Math.random() * 10;
          if (newProgress >= 100) {
            clearInterval(timer);
            return 100;
          }
          return newProgress;
        });
      }, 500);
    }
    return () => {
      clearInterval(timer);
    };
  }, [uploading]);

  // Update active step based on progress
  useEffect(() => {
    if (progress > 0 && progress < 25) {
      setActiveStep(1); // Pre-processing
    } else if (progress >= 25 && progress < 50) {
      setActiveStep(2); // Detection
    } else if (progress >= 50 && progress < 75) {
      setActiveStep(3); // Analysis
    } else if (progress >= 75 && progress <= 100 && uploading) {
      setActiveStep(4); // Results
    }
  }, [progress, uploading]);

  // Fetch real-time count data
  useEffect(() => {
    if (isRealTimeCounting) {
      // Start polling for count data
      countingIntervalRef.current = setInterval(async () => {
        try {
          const response = await fetch('http://localhost:5000/api/count-data');
          const data = await response.json();
          setCountData(data);
          
          // Update results for visualization
          setResults({
            entering: data.entering,
            exiting: data.exiting,
            total: data.entering + data.exiting
          });
          
          // Check if processing is complete
          if (data.processing_complete) {
            console.log('Video processing complete');
            
            // Stop counting and remove processing message
            setIsRealTimeCounting(false);
            setProcessingStatus('complete');
            
            // Make a call to stop the backend process
            fetch('http://localhost:5000/api/stop-counting', {
              method: 'POST',
            }).catch(error => {
              console.error('Error stopping counting:', error);
            });
            
            // Clear the interval immediately
            if (countingIntervalRef.current) {
              clearInterval(countingIntervalRef.current);
              countingIntervalRef.current = null;
            }
          }
        } catch (error) {
          console.error('Error fetching count data:', error);
        }
      }, 1000); // Poll every second
    } else {
      // Clear interval if not counting
      if (countingIntervalRef.current) {
        clearInterval(countingIntervalRef.current);
        countingIntervalRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (countingIntervalRef.current) {
        clearInterval(countingIntervalRef.current);
      }
    };
  }, [isRealTimeCounting]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
      setResults(null);
      setError(null);
      setActiveStep(0);
      setProcessingStatus('idle');
      setProgress(0);
      setIsRealTimeCounting(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);

    setUploading(true);
    setError(null);
    setProcessingStatus('processing');
    setActiveStep(1);
    
    try {
      // Start real-time counting instead of processing the entire video at once
      const response = await fetch('http://localhost:5000/api/start-counting', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process video');
      }

      // Set real-time counting flag to true
      setIsRealTimeCounting(true);
      setProcessingStatus('success');
      
      // Progress will be set to 100 to indicate success
      setProgress(100);
      setActiveStep(4);
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.message || 'Failed to process video. Please try again.');
      setProcessingStatus('error');
      setIsRealTimeCounting(false);
    } finally {
      setUploading(false);
    }
  };

  // Stop counting when needed
  const handleStopCounting = async () => {
    if (isRealTimeCounting) {
      try {
        await fetch('http://localhost:5000/api/stop-counting', {
          method: 'POST',
        });
        setIsRealTimeCounting(false);
      } catch (error) {
        console.error('Error stopping counting:', error);
      }
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      handleStopCounting();
    };
  }, []);

  // SVG Animations for processing visualization
  const renderProcessingAnimation = useCallback(() => {
    if (activeStep === 0 || !uploading) return null;
    
    return (
      <Box sx={{ width: '100%', height: 300, position: 'relative', mt: 4 }}>
        <svg width="100%" height="100%" viewBox="0 0 500 300" xmlns="http://www.w3.org/2000/svg">
          {/* Background grid */}
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke={`${theme.dark}10`} strokeWidth="1" />
          </pattern>
          <rect width="500" height="300" fill="url(#grid)" />
          
          {/* Video frame */}
          <rect x="50" y="50" width="150" height="100" rx="5" fill={theme.dark} opacity="0.8" />
          
          {/* Video content lines */}
          {[...Array(5)].map((_, i) => (
            <motion.line
              key={`content-${i}`}
              x1="60"
              y1={65 + i * 15}
              x2="190"
              y2={65 + i * 15}
              stroke={theme.light}
              strokeWidth="2"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: 0.8 }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse", 
                delay: i * 0.2 
              }}
            />
          ))}
          
          {/* Processing unit */}
          <motion.rect
            x="250"
            y="75"
            width="50"
            height="50"
            rx="5"
            fill={theme.primary}
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Processing circles */}
          <motion.circle
            cx="275"
            cy="100"
            r="15"
            fill="none"
            stroke={theme.light}
            strokeWidth="2"
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 1.2, opacity: 1 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              repeatType: "reverse" 
            }}
          />
          
          {/* Results display */}
          <rect x="350" y="50" width="100" height="100" rx="5" fill={theme.dark} opacity="0.8" />
          
          {/* Result bars */}
          {[...Array(3)].map((_, i) => (
            <motion.rect
              key={`result-${i}`}
              x="360"
              y={65 + i * 25}
              width="0"
              height="15"
              rx="2"
              fill={i === 0 ? theme.primary : i === 1 ? theme.accent : theme.secondary}
              animate={{ width: activeStep >= 4 ? 80 * Math.random() : 0 }}
              transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
            />
          ))}
          
          {/* Connection lines */}
          <motion.path
            d="M 200 100 L 250 100"
            stroke={theme.primary}
            strokeWidth="3"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: activeStep >= 2 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
          
          <motion.path
            d="M 300 100 L 350 100"
            stroke={theme.primary}
            strokeWidth="3"
            strokeDasharray="5,5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: activeStep >= 3 ? 1 : 0 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Data flow indicators */}
          {activeStep >= 2 && (
            <motion.circle
              cx="200"
              cy="100"
              r="4"
              fill={theme.light}
              animate={{ 
                cx: 250,
                opacity: 0
              }}
              initial={{ 
                cx: 200,
                opacity: 1
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity,
                repeatDelay: 0.5
              }}
            />
          )}
          
          {activeStep >= 3 && (
            <motion.circle
              cx="300"
              cy="100"
              r="4"
              fill={theme.light}
              animate={{ 
                cx: 350,
                opacity: 0
              }}
              initial={{ 
                cx: 300,
                opacity: 1
              }}
              transition={{ 
                duration: 1, 
                repeat: Infinity,
                repeatDelay: 0.5
              }}
            />
          )}
          
          {/* People detection visualization */}
          {activeStep >= 2 && (
            <>
              <motion.rect
                x="70"
                y="70"
                width="30"
                height="60"
                rx="2"
                fill="none"
                stroke={theme.accent}
                strokeWidth="2"
                strokeDasharray="4,4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
              <motion.rect
                x="120"
                y="80"
                width="25"
                height="50"
                rx="2"
                fill="none"
                stroke={theme.accent}
                strokeWidth="2"
                strokeDasharray="4,4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              />
            </>
          )}
          
          {/* Status indicators */}
          {processingStatus === 'success' && (
            <motion.circle
              cx="400"
              cy="200"
              r="20"
              fill={theme.success}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <title>Processing Complete</title>
            </motion.circle>
          )}
          
          {processingStatus === 'error' && (
            <motion.circle
              cx="400"
              cy="200"
              r="20"
              fill={theme.error}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <title>Processing Failed</title>
            </motion.circle>
          )}
        </svg>
      </Box>
    );
  }, [activeStep, uploading, processingStatus]);

  // Results visualization
  const renderResultsVisualization = useCallback(() => {
    if (!results) return null;
    
    return (
      <Box sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                  borderRadius: 2,
                  height: '100%',
                }}
              >
                <FaUserFriends size={40} color={theme.primary} />
                <Typography variant="h4" sx={{ mt: 2, color: theme.dark, fontWeight: 'bold' }}>
                  {results.entering}
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  People Entering
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 100%)',
                  borderRadius: 2,
                  height: '100%',
                }}
              >
                <FaUserFriends size={40} color={theme.success} />
                <Typography variant="h4" sx={{ mt: 2, color: theme.dark, fontWeight: 'bold' }}>
                  {results.exiting}
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  People Exiting
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Paper
                elevation={3}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #E1F5FE 0%, #B3E5FC 100%)',
                  borderRadius: 2,
                  height: '100%',
                }}
              >
                <FaUserFriends size={40} color={theme.primary} />
                <Typography variant="h4" sx={{ mt: 2, color: theme.dark, fontWeight: 'bold' }}>
                  {results.total || results.entering + results.exiting}
                </Typography>
                <Typography variant="body1" sx={{ color: '#666' }}>
                  Total People
                </Typography>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {!isRealTimeCounting && processingStatus === 'complete' && (
          <Box mt={4}>
            <Paper elevation={3} sx={{ p: 3, borderRadius: 2, bgcolor: '#f1f8e9' }}>
              <Box display="flex" alignItems="center">
                <FaCheck size={24} color={theme.success} />
                <Typography variant="h6" sx={{ ml: 2 }}>
                  Video Processing Complete
                </Typography>
              </Box>
              <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                The video has been fully processed. The final counts are displayed above.
              </Typography>
            </Paper>
          </Box>
        )}
      </Box>
    );
  }, [results, isRealTimeCounting, processingStatus]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: 10,
        pb: 6,
        background: 'linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background SVG Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.05,
          zIndex: 0,
          pointerEvents: 'none',
        }}
      >
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#007FFF" strokeWidth="0.5" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#smallGrid)" />
        </svg>
      </Box>

      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <FaUserFriends size={60} color={theme.primary} />
            </motion.div>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 'bold',
                mb: 2,
                mt: 2,
                background: 'linear-gradient(45deg, #1a1a1a 30%, #007FFF 90%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              People Detection
            </Typography>
            <Typography variant="h6" sx={{ color: '#666', maxWidth: '700px', mx: 'auto' }}>
              Upload a video to detect and count people entering and exiting using our advanced AI algorithms
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Paper
            elevation={3}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                p: 4,
                background: '#fff',
                position: 'relative',
              }}
            >
              <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
                {processingSteps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel>
                      <Typography
                        variant="body2"
                        sx={{
                          color: activeStep >= index ? theme.primary : 'text.disabled',
                          fontWeight: activeStep === index ? 'bold' : 'normal',
                        }}
                      >
                        {label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  '&:hover': {
                    borderColor: theme.primary,
                    transform: 'translateY(-5px)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                  },
                }}
                onClick={() => document.getElementById('video-input').click()}
              >
                <input
                  type="file"
                  id="video-input"
                  accept="video/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaUpload size={50} color={theme.primary} />
                </motion.div>
                <Typography variant="h6" sx={{ mt: 2, color: '#666', fontWeight: 'bold' }}>
                  Drag and drop your video here or click to browse
                </Typography>
                <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
                  Supported formats: MP4, AVI, MOV (Max size: 500MB)
                </Typography>
              </Box>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert 
                    severity="error" 
                    sx={{ 
                      mt: 2,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    icon={<FaExclamationTriangle />}
                  >
                    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                      {error}
                    </Typography>
                  </Alert>
                </motion.div>
              )}

              {preview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" sx={{ mb: 2, color: theme.dark, fontWeight: 'bold' }}>
                      Video Preview
                    </Typography>
                    <Box
                      sx={{
                        position: 'relative',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      }}
                    >
                      <video
                        src={preview}
                        controls
                        style={{ width: '100%', borderRadius: '8px' }}
                      />
                    </Box>
                  </Box>
                </motion.div>
              )}

              {uploading && (
                <Box sx={{ mt: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ width: '100%', mr: 1 }}>
                      <LinearProgress 
                        variant="determinate" 
                        value={progress} 
                        sx={{ 
                          height: 10, 
                          borderRadius: 5,
                          '& .MuiLinearProgress-bar': {
                            background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
                          }
                        }} 
                      />
                    </Box>
                    <Box sx={{ minWidth: 35 }}>
                      <Typography variant="body2" color="text.secondary">{`${Math.round(progress)}%`}</Typography>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ color: '#666', textAlign: 'center' }}>
                    {activeStep === 1 && "Pre-processing video..."}
                    {activeStep === 2 && "Detecting people in frames..."}
                    {activeStep === 3 && "Analyzing movement patterns..."}
                    {activeStep === 4 && "Generating final results..."}
                  </Typography>
                </Box>
              )}

              {/* Processing Visualization */}
              {renderProcessingAnimation()}

              {/* Results Visualization */}
              {renderResultsVisualization()}

              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 4,
                  background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})`,
                  py: 1.5,
                  borderRadius: '30px',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  boxShadow: '0 10px 20px rgba(0, 127, 255, 0.3)',
                  '&:hover': {
                    background: `linear-gradient(90deg, ${theme.primary}, ${theme.primary})`,
                    boxShadow: '0 15px 30px rgba(0, 127, 255, 0.4)',
                  },
                }}
                onClick={handleUpload}
                disabled={!file || uploading}
                startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <FaRobot />}
              >
                {uploading ? 'Processing...' : 'Start AI Analysis'}
              </Button>
            </Box>
          </Paper>
        </motion.div>
      </Container>
    </Box>
  );
};

export default PeopleDetection;
