import React, { useState } from 'react';
import { Box } from '@mui/material';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import ServicesSection from '../components/ServicesSection';
import Footer from '../components/Footer';
import LoginModal from '../components/LoginModal';
import RequestModal from '../components/RequestModal';

const HomePage = () => {
  const [loginOpen, setLoginOpen] = useState(false);
  const [requestOpen, setRequestOpen] = useState(false);

  return (
    <Box sx={{ backgroundColor: '#f8fafc' }}>
      <Navbar
        onLoginClick={() => setLoginOpen(true)}
        onRequestClick={() => setRequestOpen(true)}
      />

      <main>
        <HeroSection />
        <ServicesSection />
      </main>
      
      <Footer />

      <LoginModal open={loginOpen} handleClose={() => setLoginOpen(false)} />
      <RequestModal open={requestOpen} handleClose={() => setRequestOpen(false)} />
    </Box>
  );
};

export default HomePage;
