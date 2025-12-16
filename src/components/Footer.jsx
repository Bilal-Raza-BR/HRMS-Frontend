import React from 'react';
import { Box, Typography, Link, IconButton, Grid, Container } from '@mui/material';
import { Facebook, Twitter, LinkedIn, Instagram } from '@mui/icons-material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const Footer = () => {
  return (
    <Box
      id="contact"
      sx={{
        backgroundColor: '#0f172a',
        color: '#e2e8f0',
        py: 8,
        borderTop: '1px solid #1e293b',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5} justifyContent="space-between">
          {/* About Section */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BusinessCenterIcon sx={{ color: '#3b82f6', fontSize: '2.5rem', mr: 1 }} />
              <Typography variant="h5" fontWeight="bold" color="white">
                BilalRaza HRMS
              </Typography>
            </Box>
            <Typography variant="body2" sx={{ color: '#94a3b8', maxWidth: '300px' }}>
              Streamlining HR management with intuitive tools for attendance, hiring, and workforce analytics.
            </Typography>
            <Box sx={{ mt: 3 }}>
              <IconButton href="#" sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}>
                <Facebook />
              </IconButton>
              <IconButton href="#" sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}>
                <Twitter />
              </IconButton>
              <IconButton href="#" sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}>
                <LinkedIn />
              </IconButton>
              <IconButton href="#" sx={{ color: '#94a3b8', '&:hover': { color: 'white' } }}>
                <Instagram />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" fontWeight="semibold" color="white" sx={{ mb: 2 }}>
              Quick Links
            </Typography>
            <Link href="/" color="inherit" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: '#3b82f6' } }}>Home</Link>
            <Link href="#services" color="inherit" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: '#3b82f6' } }}>Features</Link>
            <Link href="/searchCompany" color="inherit" display="block" sx={{ mb: 1, textDecoration: 'none', '&:hover': { color: '#3b82f6' } }}>Find a Company</Link>
          </Grid>

          {/* Services */}
          <Grid item xs={6} md={2}>
            <Typography variant="h6" fontWeight="semibold" color="white" sx={{ mb: 2 }}>
              Services
            </Typography>
            <Typography variant="body2" display="block" sx={{ mb: 1, color: '#94a3b8' }}>Attendance Tracking</Typography>
            <Typography variant="body2" display="block" sx={{ mb: 1, color: '#94a3b8' }}>Recruitment</Typography>
            <Typography variant="body2" display="block" sx={{ mb: 1, color: '#94a3b8' }}>Employee Management</Typography>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" fontWeight="semibold" color="white" sx={{ mb: 2 }}>
              Contact Us
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, color: '#94a3b8' }}>Email: contact@bilalraza-hrms.com</Typography>
            <Typography variant="body2" sx={{ mb: 1, color: '#94a3b8' }}>Phone: +1 (555) 123-4567</Typography>
            <Typography variant="body2" sx={{ color: '#94a3b8' }}>Address: 123 Tech Avenue, Silicon Valley, CA</Typography>
          </Grid>
        </Grid>

        {/* Bottom Bar */}
        <Box
          sx={{
            mt: 6,
            pt: 4,
            borderTop: '1px solid #1e293b',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            © {new Date().getFullYear()} BilalRaza HRMS. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
