import React from "react";
import {
  Avatar,
  Box,
  Card,
  Divider,
  Grid,
  Typography,
  useTheme,
  Stack,
  CircularProgress,
  Button,
  Tooltip,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

const InfoItem = ({ icon, label, value }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 2 }}>
      <Box color={theme.palette.primary.main}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="body1" fontWeight={500}>{value || "N/A"}</Typography>
      </Box>
    </Stack>
  );
};

const OwnerProfileCard = ({ owner }) => {
  const theme = useTheme();

  if (!owner) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Grid container spacing={{ xs: 2, md: 3 }}>
      {/* LEFT - Avatar & Basic Info */}
      <Grid xs={12} md={4}>
        <Card
          elevation={3}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 4,
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: `linear-gradient(135deg, ${theme.palette.action.hover} 0%, ${theme.palette.background.paper} 40%)`,
          }}
        >
          <Stack alignItems="center" spacing={2} textAlign="center">
            <Avatar
              src={owner.profilePic}
              alt={owner.name}
              sx={{
                width: { xs: 80, sm: 120 },
                height: { xs: 80, sm: 120 },
                border: `4px solid ${theme.palette.primary.main}`,
                boxShadow: 3,
              }}
            />
            <Box>
              <Typography variant="h5" fontWeight="bold">{owner.name}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ textTransform: 'capitalize' }}>
                {owner.role}
              </Typography>
            </Box>
            <Tooltip title="This feature is under development." arrow>
              <span>
                <Button variant="outlined" disabled>
                  Edit Profile
                </Button>
              </span>
            </Tooltip>
          </Stack>
        </Card>
      </Grid>

      {/* RIGHT - Info Section */}
      <Grid xs={12} md={8}>
        <Card elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 4, height: '100%' }}>
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Personal Information
          </Typography>
          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid xs={12} sm={6}>
              <InfoItem icon={<EmailIcon />} label="Email Address" value={owner.email} />
              <InfoItem icon={<PhoneIcon />} label="Phone Number" value={owner.phone} />
            </Grid>

            <Grid xs={12} sm={6}>
              <InfoItem icon={<BadgeIcon />} label="Role" value={owner.role} />
              <InfoItem
                icon={<CalendarMonthIcon />}
                label="Joined On"
                value={new Date(owner.createdAt).toLocaleDateString()}
              />
              {owner.lastLogin && (
                <InfoItem
                  icon={<AccessTimeIcon />}
                  label="Last Login"
                  value={new Date(owner.lastLogin).toLocaleString()}
                />
              )}
            </Grid>
          </Grid>
        </Card>
      </Grid>
    </Grid>
  );
};

export default OwnerProfileCard;
