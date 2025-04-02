import React, { useState, useCallback, useEffect } from 'react';
import { Box, Container, Typography, Button, LinearProgress, Alert, Grid, Paper, Stepper, Step, StepLabel, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { motion } from 'framer-motion';
import { FaCarSide, FaUpload, FaVideo, FaRobot, FaChartBar, FaCheck, FaExclamationTriangle, FaIdCard } from 'react-icons/fa';

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
const processingSteps = ['Upload', 'Pre-processing', 'Detection', 'Recognition', 'Results'];

const NumberPlateDetection = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [activeStep, setActiveStep] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('idle'); // 'idle', 'processing', 'success', 'error', 'complete'
  const [plateData, setPlateData] = useState({ plates: [] });
  const [isRealTimeDetection, setIsRealTimeDetection] = useState(false);
  const [currentFrame, setCurrentFrame] = useState(null);
  const detectionIntervalRef = React.useRef(null);

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
      setActiveStep(3); // Recognition
    } else if (progress >= 75 && progress <= 100 && uploading) {
      setActiveStep(4); // Results
    }
  }, [progress, uploading]);

  // Fetch real-time plate data
  useEffect(() => {
    if (isRealTimeDetection) {
      // Start polling for plate data
      detectionIntervalRef.current = setInterval(async () => {
        try {
          const response = await fetch('http://localhost:5000/api/plate-data');
          const data = await response.json();
          setPlateData(data);
          
          // Update current frame if available
          if (data.current_frame) {
            setCurrentFrame(data.current_frame);
          }
          
          // Update results for visualization
          if (data.plates.length > 0) {
            setResults({
              totalPlates: data.plates.length,
              plates: data.plates
            });
          }
          
          // Check if processing is complete
          if (data.processing_complete) {
            console.log('Video processing complete');
            
            // Stop detection and remove processing message
            setIsRealTimeDetection(false);
            setProcessingStatus('complete');
            
            // Make a call to stop the backend process
            fetch('http://localhost:5000/api/stop-plate-detection', {
              method: 'POST',
            }).catch(error => {
              console.error('Error stopping plate detection:', error);
            });
            
            // Clear the interval immediately
            if (detectionIntervalRef.current) {
              clearInterval(detectionIntervalRef.current);
              detectionIntervalRef.current = null;
            }
          }
        } catch (error) {
          console.error('Error fetching plate data:', error);
        }
      }, 100); // Poll every 100ms for smoother video
    } else {
      // Clear interval if not detecting
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
        detectionIntervalRef.current = null;
      }
    }

    // Cleanup on unmount
    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [isRealTimeDetection]);

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
      setIsRealTimeDetection(false);
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
      // Start real-time plate detection
      const response = await fetch('http://localhost:5000/api/start-plate-detection', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to process video');
      }

      // Set real-time detection flag to true
      setIsRealTimeDetection(true);
      setProcessingStatus('success');
      
      // Progress will be set to 100 to indicate success
      setProgress(100);
      setActiveStep(4);
    } catch (error) {
      console.error('Upload failed:', error);
      setError(error.message || 'Failed to process video. Please try again.');
      setProcessingStatus('error');
      setIsRealTimeDetection(false);
    } finally {
      setUploading(false);
    }
  };

  // Stop detection when needed
  const handleStopDetection = async () => {
    if (isRealTimeDetection) {
      try {
        await fetch('http://localhost:5000/api/stop-plate-detection', {
          method: 'POST',
        });
        setIsRealTimeDetection(false);
      } catch (error) {
        console.error('Error stopping plate detection:', error);
      }
    }
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      handleStopDetection();
    };
  }, []);

  // Convert hex string to base64
  const hexToBase64 = (hexString) => {
    const bytes = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    return btoa(String.fromCharCode.apply(null, bytes));
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: 10,
        pb: 10,
        background: theme.gradient,
      }}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h2"
            component="h1"
            align="center"
            gutterBottom
            sx={{
              color: theme.light,
              fontWeight: 'bold',
              mb: 4,
              fontSize: { xs: '2rem', md: '3rem' },
            }}
          >
            License Plate Detection
          </Typography>

          <Typography
            variant="h6"
            align="center"
            sx={{
              color: theme.secondary,
              mb: 6,
              maxWidth: '800px',
              mx: 'auto',
            }}
          >
            Upload a video to detect and recognize license plates in real-time using advanced computer vision technology.
          </Typography>

          <Box sx={{ mb: 6 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {processingSteps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: theme.light, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <FaUpload /> Upload Video
                  </Typography>

                  <Box
                    sx={{
                      border: '2px dashed rgba(255, 255, 255, 0.2)',
                      borderRadius: 2,
                      p: 3,
                      textAlign: 'center',
                      mb: 3,
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: theme.primary,
                      },
                    }}
                    onClick={() => document.getElementById('video-upload').click()}
                  >
                    {preview && !isRealTimeDetection ? (
                      <Box sx={{ position: 'relative' }}>
                        <video
                          src={preview}
                          controls
                          style={{ width: '100%', borderRadius: '8px', maxHeight: '300px' }}
                        />
                        <Typography variant="body2" sx={{ color: theme.light, mt: 1 }}>
                          {file?.name}
                        </Typography>
                      </Box>
                    ) : isRealTimeDetection && currentFrame ? (
                      <Box sx={{ position: 'relative' }}>
                        <img
                          src={currentFrame}
                          alt="Real-time detection"
                          style={{ width: '100%', borderRadius: '8px', maxHeight: '300px' }}
                        />
                        <Typography variant="body2" sx={{ color: theme.light, mt: 1 }}>
                          Real-time license plate detection
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ py: 4 }}>
                        <FaVideo size={48} color={theme.secondary} style={{ marginBottom: '16px' }} />
                        <Typography variant="body1" sx={{ color: theme.light }}>
                          Drag & drop your video here or click to browse
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.6)', mt: 1 }}>
                          Supports MP4, AVI, MOV, MKV
                        </Typography>
                      </Box>
                    )}
                    <input
                      type="file"
                      id="video-upload"
                      accept=".mp4,.avi,.mov,.mkv"
                      onChange={handleFileChange}
                      style={{ display: 'none' }}
                    />
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    disabled={!file || uploading || isRealTimeDetection}
                    onClick={handleUpload}
                    sx={{
                      background: theme.primary,
                      py: 1.5,
                      '&:hover': {
                        background: theme.secondary,
                      },
                    }}
                  >
                    {uploading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : isRealTimeDetection ? (
                      'Processing...'
                    ) : (
                      'Start License Plate Detection'
                    )}
                  </Button>

                  {isRealTimeDetection && (
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={handleStopDetection}
                      sx={{
                        mt: 2,
                        borderColor: theme.error,
                        color: theme.error,
                        '&:hover': {
                          borderColor: theme.error,
                          background: 'rgba(244, 67, 54, 0.1)',
                        },
                      }}
                    >
                      Stop Detection
                    </Button>
                  )}

                  {uploading && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: theme.primary,
                          },
                        }}
                      />
                      <Typography variant="body2" sx={{ color: theme.light, mt: 1, textAlign: 'center' }}>
                        {processingStatus === 'processing'
                          ? 'Processing video...'
                          : processingStatus === 'success'
                          ? 'Processing complete!'
                          : 'Uploading...'}
                      </Typography>
                    </Box>
                  )}

                  {error && (
                    <Alert
                      severity="error"
                      sx={{
                        mt: 2,
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        color: theme.error,
                        '& .MuiAlert-icon': {
                          color: theme.error,
                        },
                      }}
                    >
                      {error}
                    </Alert>
                  )}
                </Paper>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Paper
                  elevation={3}
                  sx={{
                    p: 3,
                    height: '100%',
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: 2,
                  }}
                >
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ color: theme.light, display: 'flex', alignItems: 'center', gap: 1 }}
                  >
                    <FaIdCard /> License Plate Results
                  </Typography>

                  {isRealTimeDetection && (
                    <Alert
                      severity="info"
                      sx={{
                        mb: 3,
                        backgroundColor: 'rgba(0, 127, 255, 0.1)',
                        color: theme.primary,
                        '& .MuiAlert-icon': {
                          color: theme.primary,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={16} sx={{ mr: 1, color: theme.primary }} />
                        Real-time license plate detection in progress...
                      </Box>
                    </Alert>
                  )}

                  {processingStatus === 'complete' && (
                    <Alert
                      severity="success"
                      sx={{
                        mb: 3,
                        backgroundColor: 'rgba(76, 175, 80, 0.1)',
                        color: theme.success,
                        '& .MuiAlert-icon': {
                          color: theme.success,
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <FaCheck style={{ marginRight: '8px' }} />
                        Processing complete! {results?.totalPlates || 0} license plates detected.
                      </Box>
                    </Alert>
                  )}

                  {!results && !isRealTimeDetection ? (
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        py: 8,
                      }}
                    >
                      <FaCarSide size={48} color={theme.secondary} style={{ marginBottom: '16px', opacity: 0.7 }} />
                      <Typography variant="body1" sx={{ color: theme.light, textAlign: 'center' }}>
                        Upload a video and start the detection process to see license plate results here.
                      </Typography>
                    </Box>
                  ) : (
                    results && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body1" sx={{ color: theme.light, mb: 2 }}>
                          <strong>Total License Plates Detected:</strong> {results.totalPlates}
                        </Typography>

                        {results.plates.length > 0 ? (
                          <TableContainer component={Paper} sx={{ background: 'rgba(0,0,0,0.2)', maxHeight: '400px', overflow: 'auto' }}>
                            <Table size="small">
                              <TableHead>
                                <TableRow>
                                  <TableCell sx={{ color: theme.light, fontWeight: 'bold' }}>Plate</TableCell>
                                  <TableCell sx={{ color: theme.light, fontWeight: 'bold' }}>Confidence</TableCell>
                                  <TableCell sx={{ color: theme.light, fontWeight: 'bold' }}>Image</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {results.plates.map((plate, index) => (
                                  <TableRow key={index}>
                                    <TableCell sx={{ color: theme.light }}>{plate.text}</TableCell>
                                    <TableCell sx={{ color: theme.light }}>{(plate.confidence * 100).toFixed(1)}%</TableCell>
                                    <TableCell>
                                      {plate.image && (
                                        <Box
                                          component="img"
                                          src={plate.image.startsWith('data:') ? plate.image : `data:image/jpeg;base64,${hexToBase64(plate.image.split(',')[1])}`}
                                          alt={`License plate ${plate.text}`}
                                          sx={{ width: '120px', height: 'auto', borderRadius: '4px' }}
                                        />
                                      )}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        ) : (
                          <Typography variant="body2" sx={{ color: theme.light, textAlign: 'center', py: 4 }}>
                            No license plates detected yet. Processing...
                          </Typography>
                        )}
                      </Box>
                    )
                  )}
                </Paper>
              </motion.div>
            </Grid>
          </Grid>

          <Box sx={{ mt: 8 }}>
            <Paper
              elevation={3}
              sx={{
                p: 4,
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: theme.light, display: 'flex', alignItems: 'center', gap: 1 }}
              >
                <FaRobot /> How It Works
              </Typography>

              <Grid container spacing={3} sx={{ mt: 2 }}>
                {[
                  {
                    icon: <FaUpload size={32} color={theme.secondary} />,
                    title: 'Upload',
                    description: 'Upload a video containing vehicles with license plates.',
                  },
                  {
                    icon: <FaVideo size={32} color={theme.secondary} />,
                    title: 'Processing',
                    description: 'Our AI processes the video frame by frame to detect vehicles.',
                  },
                  {
                    icon: <FaCarSide size={32} color={theme.secondary} />,
                    title: 'Detection',
                    description: 'Advanced computer vision algorithms locate license plates on vehicles.',
                  },
                  {
                    icon: <FaIdCard size={32} color={theme.secondary} />,
                    title: 'Recognition',
                    description: 'OCR technology reads and extracts text from the license plates.',
                  },
                  {
                    icon: <FaChartBar size={32} color={theme.secondary} />,
                    title: 'Results',
                    description: 'View detected license plates with confidence scores and images.',
                  },
                ].map((step, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 64,
                          height: 64,
                          borderRadius: '50%',
                          background: 'rgba(0, 127, 255, 0.1)',
                          mb: 2,
                        }}
                      >
                        {step.icon}
                      </Box>
                      <Typography variant="h6" sx={{ color: theme.light, mb: 1 }}>
                        {step.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {step.description}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default NumberPlateDetection;
