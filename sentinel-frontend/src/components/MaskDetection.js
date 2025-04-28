import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaVideo, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const theme = {
  primary: '#007FFF',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
};

const MaskDetection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [maskData, setMaskData] = useState({ people: [] });
  const [results, setResults] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  const pollingInterval = useRef(null);
  
  const isSmallScreen = useMediaQuery('(max-width:600px)');
  const isMediumScreen = useMediaQuery('(max-width:960px)');

  const steps = ['Upload Video', 'Process Video', 'View Results'];

  // Request notification permission on component mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
      
      // Stop any active mask detection
      if (isProcessing) {
        fetch('http://localhost:5000/api/stop-mask-detection', {
          method: 'POST',
        }).catch(error => {
          console.error('Error stopping mask detection:', error);
        });
      }
    };
  }, [isProcessing]);

  // Fetch real-time mask data
  useEffect(() => {
    if (isProcessing) {
      // Start polling for mask data more frequently for smoother video
      pollingInterval.current = setInterval(async () => {
        try {
          const response = await fetch('http://localhost:5000/api/mask-data');
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          
          // Check if we have a valid frame
          if (data.frame_base64) {
            // Update the preview with the processed frame
            setPreview(`data:image/jpeg;base64,${data.frame_base64}`);
          }
          
          setMaskData(data);
          
          // Update progress
          setProgress(prev => (prev < 90 ? prev + 1 : prev));
          
          // If we have mask data, update the results
          if (data.people && data.people.length > 0) {
            setResults({
              totalPeople: data.people.length,
              people: data.people,
              withMask: data.people.filter(person => person.has_mask).length,
              withoutMask: data.people.filter(person => !person.has_mask).length
            });
          }
          
          // Check if processing is complete
          if (!data.is_processing && activeStep === 1) {
            console.log('Video processing complete, showing results');
            setActiveStep(2);
            clearInterval(pollingInterval.current);
            setIsProcessing(false);
            
            // Show a notification that processing is complete
            if ('Notification' in window && Notification.permission === 'granted') {
              new Notification('Mask Detection Complete', {
                body: 'Your video has been processed. View the results now.',
                icon: '/favicon.ico'
              });
            }
          }
        } catch (error) {
          console.error('Error fetching mask data:', error);
          setError('Failed to fetch mask detection data. Please try again.');
        }
      }, 200); // Reduced polling interval for smoother video updates
      
      return () => {
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
        }
      };
    }
  }, [isProcessing, activeStep]);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
      setActiveStep(0);
      setResults(null);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgress(0);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('video', file);
      
      // First, stop any existing mask detection
      try {
        await fetch('http://localhost:5000/api/stop-mask-detection', {
          method: 'POST',
        });
      } catch (error) {
        console.error('Error stopping previous mask detection:', error);
      }
      
      // Start mask detection
      const response = await fetch('http://localhost:5000/api/start-mask-detection', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // Don't set Content-Type when sending FormData
          // Browser will automatically set it with the correct boundary
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      setActiveStep(1);
      setIsProcessing(true);
      
    } catch (error) {
      console.error('Error uploading video:', error);
      setError('Failed to upload video. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleStopDetection = async () => {
    try {
      await fetch('http://localhost:5000/api/stop-mask-detection', {
        method: 'POST',
      });
      
      setIsProcessing(false);
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
      
      if (activeStep === 1) {
        setActiveStep(2);
      }
      
    } catch (error) {
      console.error('Error stopping mask detection:', error);
      setError('Failed to stop mask detection. Please try again.');
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setActiveStep(0);
    setResults(null);
    setError(null);
    setProgress(0);
    
    // Stop any active mask detection
    if (isProcessing) {
      handleStopDetection();
    }
  };

  const renderProcessingAnimation = () => {
    return (
      <Box sx={{ mt: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            background: theme.dark,
            color: theme.light,
          }}
        >
          <Typography variant="h4" gutterBottom align="center" sx={{ color: theme.primary }}>
            Real-Time Mask Detection
          </Typography>
          
          {preview && (
            <Box sx={{ mt: 2, mb: 3, textAlign: 'center' }}>
              <img
                src={preview}
                alt="Video preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  borderRadius: '8px',
                  border: `2px solid ${theme.primary}`,
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}
          
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 10,
              borderRadius: 5,
              mb: 2,
              backgroundColor: 'rgba(255,255,255,0.1)',
              '& .MuiLinearProgress-bar': {
                backgroundColor: theme.primary,
              },
            }}
          />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="body2" sx={{ color: theme.light }}>
              Processing video...
            </Typography>
            <Typography variant="body2" sx={{ color: theme.light }}>
              {progress}%
            </Typography>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom sx={{ color: theme.primary }}>
              Live Detection Results:
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1" sx={{ color: theme.light }}>
                Detected People: {maskData.people.length}
              </Typography>
              <Typography variant="body1" sx={{ color: theme.light }}>
                With Mask: {maskData.people.filter(person => person.has_mask).length}
              </Typography>
              <Typography variant="body1" sx={{ color: theme.light }}>
                Without Mask: {maskData.people.filter(person => !person.has_mask).length}
              </Typography>
            </Box>
            
            {maskData.people.length > 0 ? (
              <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: theme.primary }}>Person ID</TableCell>
                      <TableCell sx={{ color: theme.primary }}>Mask Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {maskData.people.map((person) => (
                      <TableRow key={person.id}>
                        <TableCell sx={{ color: theme.light }}>Person #{person.id + 1}</TableCell>
                        <TableCell sx={{ color: person.has_mask ? theme.success : theme.danger }}>
                          {person.has_mask ? 'Wearing Mask' : 'No Mask'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body1" sx={{ color: theme.light, textAlign: 'center', mt: 2 }}>
                No people detected yet. Processing...
              </Typography>
            )}
          </Box>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="error"
              onClick={handleStopDetection}
              sx={{ px: 4, py: 1.5 }}
            >
              Stop Detection
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  };

  const renderResultsVisualization = () => {
    if (!results) return null;
    
    const maskData = [
      { name: 'With Mask', value: results.withMask, color: theme.success },
      { name: 'Without Mask', value: results.withoutMask, color: theme.danger },
    ];
    
    return (
      <Box sx={{ mt: 4 }}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            borderRadius: 2,
            background: theme.dark,
            color: theme.light,
          }}
        >
          <Typography variant="h4" gutterBottom align="center" sx={{ color: theme.primary }}>
            Mask Detection Results
          </Typography>
          
          {preview && (
            <Box sx={{ mt: 2, mb: 3, textAlign: 'center' }}>
              <img
                src={preview}
                alt="Video preview"
                style={{
                  maxWidth: '100%',
                  maxHeight: '400px',
                  borderRadius: '8px',
                  border: `2px solid ${theme.primary}`,
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}
          
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{ backgroundColor: 'rgba(255,255,255,0.05)', height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: theme.primary }}>
                    {results.totalPeople || 0}
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.light }}>
                    Total People Detected
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ backgroundColor: 'rgba(255,255,255,0.05)', height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: theme.success }}>
                    {results.withMask || 0}
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.light }}>
                    People With Mask
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Card sx={{ backgroundColor: 'rgba(255,255,255,0.05)', height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ color: theme.danger }}>
                    {results.withoutMask || 0}
                  </Typography>
                  <Typography variant="body1" sx={{ color: theme.light }}>
                    People Without Mask
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.primary, textAlign: 'center' }}>
                Mask Usage Distribution
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={maskData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {maskData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.primary, textAlign: 'center' }}>
                Mask Status
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={maskData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" name="Count" fill={theme.primary} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Grid>
          </Grid>
          
          {results.people && results.people.length > 0 && (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom sx={{ color: theme.primary }}>
                Detailed Results:
              </Typography>
              <TableContainer component={Paper} sx={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: theme.primary }}>Person ID</TableCell>
                      <TableCell sx={{ color: theme.primary }}>Mask Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {results.people.map((person) => (
                      <TableRow key={person.id}>
                        <TableCell sx={{ color: theme.light }}>Person #{person.id + 1}</TableCell>
                        <TableCell sx={{ color: person.has_mask ? theme.success : theme.danger }}>
                          {person.has_mask ? 'Wearing Mask' : 'No Mask'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleReset}
              sx={{ px: 4, py: 1.5 }}
            >
              Analyze Another Video
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: 10,
        pb: 6,
        background: '#f8f9fa',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              mb: 2,
              color: '#1a1a1a',
            }}
          >
              Mask Detection
          </Typography>
          
          <Typography
            variant="h5"
            sx={{
              textAlign: 'center',
              mb: 4,
              color: '#666',
            }}
          >
              Advanced AI-powered mask detection to monitor safety compliance
          </Typography>
        </motion.div>

        <Box sx={{ width: '100%', mb: 4 }}>
          <Stepper activeStep={activeStep} alternativeLabel={!isSmallScreen}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{!isSmallScreen && label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        {error && (
          <Paper
            elevation={3}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 2,
              backgroundColor: theme.danger,
              color: 'white',
            }}
          >
            <Typography variant="body1">{error}</Typography>
          </Paper>
        )}

        {activeStep === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Paper
              elevation={3}
              sx={{
                p: 4,
                borderRadius: 2,
                background: 'white',
              }}
            >
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: 2,
                  p: 4,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: theme.primary,
                  },
                }}
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="video/*"
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <FaCloudUploadAlt size={50} color={theme.primary} />
                <Typography variant="h6" sx={{ mt: 2, color: '#666' }}>
                  Drag and drop your video here or click to browse
                </Typography>
                <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
                  Upload a video to detect people wearing or not wearing masks
                </Typography>
                <Typography variant="body2" sx={{ color: '#999', mt: 1 }}>
                  Supported formats: MP4, AVI, MOV (Max size: 500MB)
                </Typography>
              </Box>

              {preview && (
                <Box sx={{ mt: 4 }}>
                  <video
                    src={preview}
                    controls
                    style={{ width: '100%', borderRadius: '8px' }}
                  />
                </Box>
              )}

              <Button
                variant="contained"
                fullWidth
                sx={{
                  mt: 4,
                  background: theme.primary,
                  py: 1.5,
                  '&:hover': {
                    background: '#0059B2',
                  },
                }}
                onClick={handleUpload}
                disabled={!file || uploading}
              >
                {uploading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <CircularProgress size={24} sx={{ color: 'white', mr: 1 }} />
                    <span>Processing...</span>
                  </Box>
                ) : (
                  'Start Mask Detection'
                )}
              </Button>
            </Paper>

            <Box sx={{ mt: 6 }}>
              <Typography
                variant="h4"
                sx={{
                  textAlign: 'center',
                  fontWeight: 'bold',
                  mb: 4,
                  color: '#1a1a1a',
                }}
              >
                How It Works
              </Typography>

              <Grid container spacing={3}>
                {[
                  {
                    icon: <FaCloudUploadAlt size={40} color={theme.primary} />,
                    title: 'Upload Video',
                    description: 'Upload a video containing people to analyze mask usage.',
                  },
                  {
                    icon: <FaVideo size={40} color={theme.primary} />,
                    title: 'Process Video',
                    description: 'Our AI processes the video frame by frame to detect people and masks.',
                  },
                  {
                    icon: <FaCheckCircle size={40} color={theme.success} />,
                    title: 'Detect Masks',
                    description: 'Advanced computer vision algorithms identify people wearing masks.',
                  },
                  {
                    icon: <FaTimesCircle size={40} color={theme.danger} />,
                    title: 'Identify Non-compliance',
                    description: 'The system identifies people not wearing masks properly.',
                  },
                  {
                    icon: <FaVideo size={40} color={theme.primary} />,
                    title: 'Real-time Analysis',
                    description: 'View mask detection results in real-time as the video processes.',
                  },
                ].map((item, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Card
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        transition: 'transform 0.3s, box-shadow 0.3s',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                        },
                      }}
                    >
                      <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                        <Box sx={{ mb: 2 }}>{item.icon}</Box>
                        <Typography variant="h6" gutterBottom>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>
        )}

        {activeStep === 1 && renderProcessingAnimation()}
        {activeStep === 2 && renderResultsVisualization()}
      </Container>
    </Box>
  );
};

export default MaskDetection;
