import React from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Divider,
  Grid,
  useTheme,
  Stack,
  Chip,
  Button,
} from "@mui/material";
import {
  Email,
  Phone,
  LocationOn,
  Business,
  Badge,
  CalendarMonth,
  Person,
  Edit,
} from "@mui/icons-material";
import { alpha } from "@mui/material/styles";
import { motion } from "framer-motion";

const ProfileDetail = ({ icon, label, value }) => (
  <Paper
    variant="outlined"
    sx={{
      p: 2,
      height: '100%',
      borderRadius: 3,
      bgcolor: (theme) => alpha(theme.palette.text.primary, 0.02),
      borderColor: (theme) => alpha(theme.palette.text.primary, 0.08),
    }}
  >
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>{icon}</Avatar>
      <Box>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography fontWeight={600} color="text.primary">{value || "N/A"}</Typography>
      </Box>
    </Stack>
  </Paper>
);

const ProfilePage = ({ currentUser, company }) => {
  const theme = useTheme();
  if (!currentUser || !company) return null;

  const joiningDate = currentUser.createdAt ? new Date(currentUser.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "N/A";

  return (
    <Box
      sx={{
        maxWidth: "1200px",
        mx: "auto",
        p: { xs: 2, sm: 4 },
      }}
    >
      <Paper
        elevation={4}
        sx={{
          borderRadius: 4,
          overflow: 'hidden', // To contain the header background
          background: theme.palette.background.paper,
        }}
      >
        {/* 🔶 Profile Header */}
        <Box sx={{
          p: { xs: 3, sm: 4 },
          background: (theme) => `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.05)} 100%)`,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} sm="auto">
              <Avatar
                src={currentUser.profilePic || ""}
                sx={{
                  width: { xs: 100, sm: 140 },
                  height: { xs: 100, sm: 140 },
                  mx: "auto",
                  border: `4px solid ${theme.palette.background.paper}`,
                  boxShadow: `0 4px 12px ${alpha(theme.palette.primary.main, 0.3)}`,
                }}
              />
            </Grid>

            <Grid item xs>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Chip
                    label={currentUser.role?.toUpperCase()}
                    color="primary"
                    size="small"
                    sx={{ fontWeight: 600, mb: 1 }}
                  />
                  <Typography variant="h4" component="h1" fontWeight={700} sx={{ typography: { xs: 'h5', sm: 'h4' } }}>
                    {currentUser.name}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Business fontSize="small" /> {company.name}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Edit />}
                  sx={{ mt: 1, display: { xs: 'none', sm: 'flex' } }}
                >
                  Edit Profile
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box sx={{ p: { xs: 3, sm: 4 } }}>

            {/* 🔹 General Info */}
            <Typography variant="h5" fontWeight={600} mb={3}>
              👤 Personal Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}><ProfileDetail icon={<Person />} label="Full Name" value={currentUser.name} /></Grid>
              <Grid item xs={12} sm={6} md={4}><ProfileDetail icon={<Email />} label="Email Address" value={currentUser.email} /></Grid>
              <Grid item xs={12} sm={6} md={4}><ProfileDetail icon={<Phone />} label="Phone Number" value={currentUser.phone} /></Grid>
              <Grid item xs={12} sm={6} md={8}><ProfileDetail icon={<LocationOn />} label="Address" value={currentUser.address || "Not Provided"} /></Grid>
              <Grid item xs={12} sm={6} md={4}><ProfileDetail icon={<CalendarMonth />} label="Joining Date" value={joiningDate} /></Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            {/* 🔸 Company Info */}
            <Typography variant="h5" fontWeight={600} mb={3}>
              🏢 Company Information
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}><ProfileDetail icon={<Business />} label="Company Name" value={company.name} /></Grid>
              <Grid item xs={12} sm={6} md={4}>
                <ProfileDetail
                  icon={<Badge />}
                  label="Your Role"
                  value={currentUser.role?.charAt(0).toUpperCase() + currentUser.role?.slice(1)}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <ProfileDetail icon={<Badge />} label="Employment Status" value={currentUser.status || "Active"} />
              </Grid>
            </Grid>

            {/* ✨ Action Buttons (Optional) */}
            <Box mt={4} textAlign="center" sx={{ display: { xs: 'block', sm: 'none' } }}>
              <Button variant="contained" color="primary" startIcon={<Edit />}>
                Edit Profile
              </Button>
            </Box>
          </Box>
        </motion.div>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
