import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  Box,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import LogoutIcon from "@mui/icons-material/Logout";
import BlockIcon from "@mui/icons-material/Block";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MenuIcon from "@mui/icons-material/Menu";
import PersonIcon from "@mui/icons-material/Person";
import { deepPurple } from "@mui/material/colors";
import { alpha } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
const navItems = [
  { label: "Dashboard", icon: <DashboardIcon />, tab: "dashboard" },
  { label: "All Companies", icon: <GroupIcon />, tab: "companies" },
  { label: "Invite Company", icon: <AddBusinessIcon />, tab: "invite" },
  { label: "Requests", icon: <RequestPageIcon />, tab: "requests" },
  { label: "Blocked", icon: <BlockIcon />, tab: "blocked" },
  { label: "My Profile", icon: <PersonIcon />, tab: "profile" },
];

const OwnerSidebar = ({
  mobileOpen,
  handleDrawerToggle,
  toggleTheme,
  themeMode,
  ownerData,
  onTabChange, // 👈 tab change handler
  activeTab,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("ownerToken");
    navigate("/"); // ✅ now it works
  };

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      {/* Owner Profile Section */}
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 2 }}>
        <Avatar
          src={ownerData?.profilePic || ""}
          sx={{
            width: 64,
            height: 64,
            bgcolor: deepPurple[500],
            fontSize: 24,
          }}
        >
          {ownerData?.name?.charAt(0)?.toUpperCase() || "O"}
        </Avatar>
        <Typography variant="subtitle1" fontWeight="bold" mt={1}>
          {ownerData?.name || "Owner"}
        </Typography>
      </Box>

      <Divider />

      {/* Navigation List */}
      <List sx={{ flexGrow: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              selected={activeTab === item.tab}
              onClick={() => {
                onTabChange(item.tab);
                if (isMobile) handleDrawerToggle();
              }}
              sx={{
                py: 1.25,
                px: 3,
                "&.Mui-selected": {
                  backgroundColor: alpha(theme.palette.primary.main, 0.08),
                  color: theme.palette.primary.main,
                  "& .MuiListItemIcon-root": {
                    color: theme.palette.primary.main,
                  },
                },
                "&:hover": {
                  backgroundColor: alpha(theme.palette.action.hover, 0.5),
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Box>
        <Divider />
        {/* Theme Toggle */}
        <ListItem disablePadding>
          <ListItemButton onClick={toggleTheme}>
            <ListItemIcon>
              {themeMode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </ListItemIcon>
            <ListItemText primary={themeMode === "dark" ? "Light Mode" : "Dark Mode"} />
          </ListItemButton>
        </ListItem>

        {/* Logout */}
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon color="error" />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? ( // Mobile: Temporary Drawer
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ "& .MuiDrawer-paper": { width: 240, boxSizing: 'border-box' } }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            width: 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: 240,
              boxSizing: "border-box",
              pt: 2,
              backgroundColor: theme.palette.background.paper,
              borderRight: `1px solid ${theme.palette.divider}`,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default OwnerSidebar;
