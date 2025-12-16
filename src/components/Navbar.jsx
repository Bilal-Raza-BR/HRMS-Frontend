import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  Link,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';

const Navbar = ({ onLoginClick, onRequestClick }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:900px)');
  const navigate = useNavigate();

  const handleSearchClick = () => {
    navigate('/searchCompany');
  };

  const navLinks = [
    { title: 'Home', path: '/' },
    { title: 'Features', path: '#services' },
    { title: 'Contact', path: '#contact' },
  ];

  const drawerContent = (
    <Box
      sx={{ width: 250, p: 2, backgroundColor: '#f8fafc', height: '100%' }}
      role="presentation"
      onClick={() => setDrawerOpen(false)}
      onKeyDown={() => setDrawerOpen(false)}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#0f172a' }}>
        Menu
      </Typography>
      <List>
        {navLinks.map((link) => (
          <ListItem button key={link.title} component="a" href={link.path}>
            <ListItemText primary={link.title} sx={{ color: '#334155' }} />
          </ListItem>
        ))}
        <ListItem button onClick={onLoginClick}>
          <ListItemText primary="Admin Login" />
        </ListItem>
        <ListItem button onClick={onRequestClick}>
          <ListItemText primary="Request Service" />
        </ListItem>
         <ListItem button onClick={handleSearchClick}>
          <ListItemText primary="Search Company" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.05)',
        py: 1,
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {/* Left side - Logo and Title */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <motion.div whileHover={{ rotate: 360, scale: 1.1 }}>
            <BusinessCenterIcon sx={{ color: '#3b82f6', fontSize: '2rem' }} />
          </motion.div>
          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ color: '#0f172a', display: { xs: 'none', sm: 'block' } }}
          >
            BilalRaza HRMS
          </Typography>
        </Box>

        {/* Center - Navigation Links */}
        {!isMobile && (
          <Box sx={{ display: 'flex', gap: 4 }}>
            {navLinks.map((link) => (
              <Link
                key={link.title}
                href={link.path}
                underline="none"
                sx={{
                  color: '#334155',
                  fontWeight: 500,
                  position: 'relative',
                  '&:after': {
                    content: '""',
                    position: 'absolute',
                    width: '0',
                    height: '2px',
                    bottom: '-5px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    backgroundColor: '#3b82f6',
                    transition: 'width 0.3s ease',
                  },
                  '&:hover:after': {
                    width: '100%',
                  },
                }}
              >
                {link.title}
              </Link>
            ))}
          </Box>
        )}

        {/* Right side - Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isMobile ? (
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#0f172a' }}>
              <MenuIcon />
            </IconButton>
          ) : (
            <>
              <IconButton sx={{ color: '#334155' }} onClick={handleSearchClick}>
                <SearchIcon />
              </IconButton>
              <Button
                variant="text"
                onClick={onLoginClick}
                sx={{ color: '#334155', fontWeight: 600, textTransform: 'none' }}
              >
                Admin Login
              </Button>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  onClick={onRequestClick}
                  sx={{
                    backgroundColor: '#3b82f6',
                    color: '#fff',
                    borderRadius: '999px',
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
                    '&:hover': {
                      backgroundColor: '#2563eb',
                    },
                  }}
                >
                  Request Service
                </Button>
              </motion.div>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Drawer for mobile */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        {drawerContent}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
