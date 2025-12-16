import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Avatar,
  Box,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider,
  Badge,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const OwnerTopbar = ({ onMenuClick, owner }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  return (
    <AppBar
      position="sticky" // Changed from sticky to fixed
      elevation={1}
      sx={{
        backgroundColor: theme.palette.background.paper,
        marginBottom:"20px",
        color: theme.palette.text.primary,
        zIndex: (theme) => theme.zIndex.drawer + -1,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        {/* Mobile Drawer Toggle */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { sm: "none" }, mr: 2 }}
        >
          <MenuIcon />
        </IconButton>

        {/* Center Text */}
        <Typography
          variant="h6"
          noWrap
          sx={{ flexGrow: 1, textAlign: { xs: "center", sm: "left" } }}
        >
          Welcome, {owner?.name || "Owner"}
        </Typography>

        {/* Profile Picture */}
        <Box display="flex" alignItems="center" gap={2}>
          <IconButton color="inherit">
            <Badge badgeContent={4} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
            <Avatar alt={owner?.name} src={owner?.profilePic || ""} sx={{ width: 40, height: 40 }} />
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={() => setAnchorEl(null)}
          onClick={() => setAnchorEl(null)}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.15))',
              mt: 1.5,
              '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
              '&:before': {
                content: '""', display: 'block', position: 'absolute', top: 0, right: 14,
                width: 10, height: 10, bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)', zIndex: 0,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => navigate('/owner/dashboard', { state: { tab: 'profile' } })}>
            <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
            Profile
          </MenuItem>
          <Divider />
          <MenuItem onClick={() => { localStorage.removeItem("ownerToken"); navigate("/"); }}>
            <ListItemIcon><LogoutIcon fontSize="small" color="error" /></ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default OwnerTopbar;
