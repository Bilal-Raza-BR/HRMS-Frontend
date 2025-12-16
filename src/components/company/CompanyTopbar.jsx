import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Tooltip,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import SendTimeExtensionIcon from '@mui/icons-material/SendTimeExtension';
import { useNavigate } from "react-router-dom";
import UserProfileModal from "./UserProfileModal"; 

const CompanyTopbar = ({ currentUser, company, setMobileOpen, toggleTheme, mode, setOpenAttendanceModal, setOpenApplyLeaveModal }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    // Redirect to login page without reloading the page
    navigate(`/login/${company?.slug || ''}`);
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={1}
        sx={{
          backgroundColor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          width: { sm: `calc(100% - 260px)` },
          ml: { sm: `260px` },
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      > 
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: { xs: 2, sm: 3 } }}> {/* Added responsive padding for Toolbar */}
          {/* 🧾 Left: User name */}
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}> 
            <Typography variant="h6" fontWeight={600} noWrap> {/* Removed marginLeft: "30px" to rely on Toolbar's padding */}
              {currentUser?.name || "Welcome"}
            </Typography>
          </Box>

          {/* 🔘 Right Icons */}
          <Box display="flex" alignItems="center" gap={1}>
            {/* 🔔 Notification */}
            <Tooltip title="Notifications">
              <IconButton>
                <NotificationsIcon />
              </IconButton>
            </Tooltip>

            {/* 📆 Attendance Button */}
            <Tooltip title="Mark Attendance">
              <IconButton onClick={() => setOpenAttendanceModal(true)}>
                <EventAvailableIcon />
              </IconButton>
            </Tooltip>

            {/* ✈️ Apply Leave Button */}
            <Tooltip title="Apply for Leave">
              <IconButton onClick={() => setOpenApplyLeaveModal(true)}>
                <SendTimeExtensionIcon />
              </IconButton>
            </Tooltip>

            {/* 🌗 Theme Toggle */}
            <Tooltip title={mode === "light" ? "Dark Mode" : "Light Mode"}>
              <IconButton onClick={toggleTheme}>
                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>

            {/* 👤 Avatar Dropdown */}
            <Tooltip title="Account">
              <IconButton onClick={handleMenuOpen}>
                <Avatar
                  src={currentUser?.profilePic || ""}
                  alt={currentUser?.name}
                  sx={{ width: 36, height: 36 }}
                >
                  {currentUser?.name?.[0]?.toUpperCase() || "U"}
                </Avatar>
              </IconButton>
            </Tooltip>

            {/* Dropdown Menu */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => {
                  setOpenProfileModal(true);
                  handleMenuClose();
                }}
              >
                View Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* 👤 Profile Modal */}
      <UserProfileModal
        open={openProfileModal}
        onClose={() => setOpenProfileModal(false)}
        user={currentUser}
      />
    </>
  );
};

export default CompanyTopbar;
