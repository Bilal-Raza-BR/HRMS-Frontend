// components/AllCompanyStatsCard.jsx

import React from 'react';
import { Card, Typography, Box, useTheme } from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const iconMap = {
  "Total Companies": <BusinessIcon fontSize="inherit" />,
  "Blocked Companies": <BlockIcon fontSize="inherit" />,
  "Active Companies": <CheckCircleIcon fontSize="inherit" />,
};

const bgColorMap = {
  "Total Companies": "#1976d2",
  "Blocked Companies": "#d32f2f",
  "Active Companies": "#2e7d32",
};

const AllCompanyStatsCard = ({ title, value }) => {
  const theme = useTheme();
  const icon = iconMap[title] || <BusinessIcon fontSize="inherit" />;
  const bgColor = bgColorMap[title] || theme.palette.primary.main;

  return (
    <Card
      elevation={4}
      sx={{
        borderRadius: 4,
        p: { xs: 2, sm: 3 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: theme.palette.mode === 'dark' ? '#1e1e2f' : '#fdfdfd',
        boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 25px rgba(0,0,0,0.15)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          width: 150,
          height: 150,
          background: `linear-gradient(135deg, ${bgColor}33, transparent)`,
          borderRadius: '50%',
          top: -40,
          right: -40,
          zIndex: 0,
        },
      }}
    >
      <Box zIndex={1}>
        <Typography
          variant="caption"
          sx={{ fontWeight: 500, color: 'text.secondary' }}
        >
          {title}
        </Typography>
        <Typography
          variant={{ xs: 'h5', sm: 'h4' }}
          sx={{
            fontWeight: 'bold',
            color: theme.palette.mode === 'dark' ? '#fff' : '#111',
          }}
        >
          {value}
        </Typography>
      </Box>

      <Box
        zIndex={1}
        sx={{
          width: 50,
          height: 50,
          borderRadius: '50%',
          backgroundColor: bgColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontSize: 28,
          boxShadow: `0 4px 12px ${bgColor}80`,
        }}
      >
        {icon}
      </Box>
    </Card>
  );
};

export default AllCompanyStatsCard;
