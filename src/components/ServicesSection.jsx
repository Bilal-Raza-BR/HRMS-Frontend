import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupIcon from '@mui/icons-material/Group';
import WorkIcon from '@mui/icons-material/Work';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EmailIcon from '@mui/icons-material/Email';

const services = [
  {
    title: "Attendance Tracking",
    icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
    desc: "Mark and manage employee attendance with ease.",
  },
  {
    title: "Leave Management",
    icon: <AssignmentIndIcon sx={{ fontSize: 40 }} />,
    desc: "Submit, approve, and track leaves seamlessly.",
  },
  {
    title: "Role-Based Access",
    icon: <LockOpenIcon sx={{ fontSize: 40 }} />,
    desc: "Secure data access for admin, HR, and employees.",
  },
  {
    title: "Job Applications",
    icon: <WorkIcon sx={{ fontSize: 40 }} />,
    desc: "Accept resumes and manage hiring process.",
  },
  {
    title: "User Management",
    icon: <GroupIcon sx={{ fontSize: 40 }} />,
    desc: "Invite and manage company staff easily.",
  },
  {
    title: "Email Invitations",
    icon: <EmailIcon sx={{ fontSize: 40 }} />,
    desc: "Send secure invite links with custom roles.",
  },
];

const ServicesSection = () => {
  return (
    <Box
      id="services"
      sx={{
        px: 2,
        py: 8,
        backgroundColor: '#f7faff',
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h4"
        fontWeight="bold"
        mb={6}
        sx={{
          color: '#0f172a',
        }}
      >
        Our HRMS Services
      </Typography>

      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          alignItems: 'stretch',
          gap: 4,
        }}
      >
        {services.map((item, index) => (
          <Paper
            key={index}
            elevation={6}
            sx={{
              width: {
                xs: '100%',
                sm: '45%',
                md: '28%',
                lg: '22%',
              },
              p: 3,
              borderRadius: 4,
              textAlign: 'center',
              transition: 'all 0.3s ease',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              boxShadow: '0 8px 24px rgba(0,0,0,0.05)',
              '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 16px 32px rgba(0,0,0,0.1)',
              },
            }}
          >
            <Box color="primary.main" mb={1}>
              {item.icon}
            </Box>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              {item.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {item.desc}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default ServicesSection;
