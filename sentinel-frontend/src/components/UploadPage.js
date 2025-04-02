import React, { useState } from 'react';
import { Box, Container, Typography, Button, LinearProgress } from '@mui/material';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt } from 'react-icons/fa';
import axios from 'axios';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreview(url);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('video', file);

    setUploading(true);
    try {
      await axios.post('http://localhost:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });
      // Handle successful upload
      alert('Upload successful!');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Upload failed. Please try again.');
    } finally {
      setUploading(false);
      setProgress(0);
    }
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
      <Container maxWidth="md">
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
              mb: 4,
              color: '#1a1a1a',
            }}
          >
            Upload Your Video
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box
            sx={{
              background: '#fff',
              borderRadius: 2,
              p: 4,
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
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
                  borderColor: '#007FFF',
                },
              }}
              onClick={() => document.getElementById('file-input').click()}
            >
              <input
                type="file"
                id="file-input"
                accept="video/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <FaCloudUploadAlt size={50} color="#007FFF" />
              <Typography variant="h6" sx={{ mt: 2, color: '#666' }}>
                Drag and drop your video here or click to browse
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

            {uploading && (
              <Box sx={{ mt: 4 }}>
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
                  Uploading... {progress}%
                </Typography>
              </Box>
            )}

            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 4,
                background: '#007FFF',
                py: 1.5,
                '&:hover': {
                  background: '#0059B2',
                },
              }}
              onClick={handleUpload}
              disabled={!file || uploading}
            >
              {uploading ? 'Uploading...' : 'Start Analysis'}
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default UploadPage;
