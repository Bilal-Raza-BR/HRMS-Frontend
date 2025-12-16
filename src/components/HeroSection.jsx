import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Animated shape component
const AnimatedShape = ({ style }) => (
  <motion.div
    style={style}
    animate={{
      y: [0, -20, 0],
      rotate: [0, 10, 0],
    }}
    transition={{
      duration: 10,
      repeat: Infinity,
      ease: 'easeInOut',
    }}
  />
);

const HeroSection = () => {
  return (
    <Box
      sx={{
        minHeight: '90vh',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 8, md: 12 },
        backgroundColor: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Shapes */}
      <AnimatedShape
        style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          width: '150px',
          height: '150px',
          borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
          background: 'linear-gradient(45deg, #818cf8, #c7d2fe)',
          opacity: 0.5,
        }}
      />
      <AnimatedShape
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '200px',
          height: '200px',
          borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%',
          background: 'linear-gradient(45deg, #60a5fa, #dbeafe)',
          opacity: 0.6,
        }}
      />

      <Container maxWidth="md" sx={{ textAlign: 'center', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{
              color: '#1e293b',
              fontSize: { xs: '2.5rem', sm: '3rem', md: '4rem' },
              mb: 2,
            }}
          >
            Modern HR Management, <br />
            <span style={{ color: '#3b82f6' }}>Simplified.</span>
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Typography
            variant="h6"
            sx={{
              color: '#475569',
              maxWidth: '600px',
              margin: '0 auto',
              mb: 4,
              fontWeight: 400,
            }}
          >
            The all-in-one platform to streamline your hiring, attendance, and employee management processes with ease and efficiency.
          </Typography>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Button
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: '999px',
              px: 5,
              py: 1.5,
              fontWeight: 600,
              textTransform: 'none',
              backgroundColor: '#3b82f6',
              boxShadow: '0 8px 25px rgba(59, 130, 246, 0.3)',
              '&:hover': {
                backgroundColor: '#2563eb',
                transform: 'translateY(-2px)',
              },
              transition: 'transform 0.2s ease',
            }}
            onClick={() => {
              const section = document.getElementById('services');
              if (section) section.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Discover Features
          </Button>
        </motion.div>
      </Container>
    </Box>
  );
};

export default HeroSection;
