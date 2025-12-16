import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Divider,
  IconButton,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Tooltip from '@mui/material/Tooltip';
import {
  Dashboard,
  Home,
  People,
  Assignment,
  Logout,
  EventNote,
  WorkOutline,
  Menu as MenuIcon,
  PersonAdd,
} from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";

// ✅ Role-based nav items
const navItems = [
  { label: "Dashboard", icon: <Dashboard />, path: "dashboard", roles: ["admin", "hr", "employee"], isInternal: true },
  { label: "Profile", icon: <Home />, path: "profile", roles: ["admin", "hr", "employee"], isInternal: true },
  { label: "Employees", icon: <People />, path: "employees", roles: ["admin", "hr"], isInternal: true },
  { label: "Attendance", icon: <EventNote />, path: "attendance", roles: ["admin", "hr"], isInternal: true },
  { label: "Leave Requests", icon: <Assignment />, path: "leave-requests", roles: ["admin", "hr"], isInternal: true },
  { label: "Applications", icon: <WorkOutline />, path: "applications", roles: ["admin", "hr"], isInternal: true },
  { label: "Invite User", icon: <PersonAdd />, path: "invite-user", roles: ["admin"], isInternal: true }
];

const drawerWidth = 260;

const CompanySidebar = ({
  currentUser,
  company,
  mobileOpen,
  setMobileOpen,
  onTabChange,
  activeTab,
}) => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleNavigate = (path, isInternal) => {
    if (isInternal && onTabChange) {
      onTabChange(path);
    } else {
      navigate(`/company/${slug}/${path}`);
    }
    if (isMobile) setMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setTimeout(() => {
      window.location.href = "/";
    }, 300);
  };

  const drawerContent = (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        bgcolor: "background.paper",
        overflowX: "hidden",
      }}
    >
      {/* 🔰 Company Info */}
      <Box textAlign="center" py={3}>
        <Avatar
          src={company?.logoUrl || "https://via.placeholder.com/80"}
          alt={company?.name || "Company"}
          sx={{ width: 80, height: 80, mx: "auto", mb: 1 }}
        />
        <Tooltip title={company?.name || "Company Name"} placement="bottom">
          <Typography variant="h6" fontWeight={700} noWrap sx={{ px: 2 }}>
            {company?.name || "Company Name"}
          </Typography>
        </Tooltip>
        <Typography variant="caption" color="text.secondary">
          {(currentUser?.role || "user").toUpperCase()}
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "grey.200" }} />

      {/* 🔗 Navigation */}
      <List sx={{ p: 1, flexGrow: 1 }}>
        {navItems.map(({ label, icon, path, roles, isInternal }) => {
          if (!currentUser?.role || !roles.includes(currentUser.role)) return null;

          const isActive = activeTab === path;

          const activeStyles = {
            bgcolor: theme.palette.action.selected,
            borderRight: `3px solid ${theme.palette.primary.main}`,
            "& .MuiListItemIcon-root": {
              color: theme.palette.primary.main,
            },
            "& .MuiListItemText-primary": {
              fontWeight: 600,
              color: theme.palette.text.primary,
            },
          };

          return (
            <ListItemButton
              key={label}
              onClick={() => handleNavigate(path, isInternal)}
              sx={{
                borderRadius: 3,
                mb: 0.5,
                ...(isActive && activeStyles),
                "&:hover": {
                  bgcolor: theme.palette.action.hover,
                },
              }}
            >
              <ListItemIcon>{icon}</ListItemIcon>
              <ListItemText
                primary={label}
                primaryTypographyProps={{
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? 'text.primary' : 'text.secondary',
                }}
              />
            </ListItemButton>
          );
        })}
      </List>

      {/* 🚪 Logout (Pushed to bottom) */}
      <Box sx={{ p: 1 }}>
        <Divider sx={{ my: 1 }} />
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 3,
            "&:hover": {
              bgcolor: "rgba(255, 82, 82, 0.1)",
              "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
                color: "error.main",
              },
            },
          }}
        >
          <ListItemIcon sx={{ color: "text.secondary" }}><Logout /></ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ color: 'text.secondary' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <>
      {/* 📱 Mobile Drawer Toggle */}
      {isMobile && (
        <IconButton
          color="inherit"
          edge="start"
          onClick={() => setMobileOpen(!mobileOpen)}
          sx={{
            position: "fixed", top: 16, left: 16, zIndex: 1301,
            bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)',
            backdropFilter: 'blur(6px)',
            border: `1px solid ${theme.palette.divider}`,
            "&:hover": {
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)',
            }
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* 📱 Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            borderRight: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* 💻 Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default CompanySidebar;
