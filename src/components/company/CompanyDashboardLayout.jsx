import React, { useState } from 'react';
import { Box, CssBaseline, Toolbar, useTheme, useMediaQuery } from '@mui/material';
import CompanySidebar from './CompanySidebar';
import CompanyTopbar from './CompanyTopbar';

const drawerWidth = 260;

const CompanyDashboardLayout = ({ children, currentUser, company, onTabChange, activeTab, toggleTheme, mode, setOpenAttendanceModal, setOpenApplyLeaveModal }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <CompanyTopbar
        currentUser={currentUser}
        company={company}
        setMobileOpen={setMobileOpen}
        toggleTheme={toggleTheme}
        mode={mode}
        setOpenAttendanceModal={setOpenAttendanceModal}
        setOpenApplyLeaveModal={setOpenApplyLeaveModal}
      />
      <CompanySidebar
        currentUser={currentUser}
        company={company}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        onTabChange={onTabChange}
        activeTab={activeTab}
      />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 }, // Responsive padding for main content area
          width: { sm: `calc(100% - ${drawerWidth}px)` }, // Adjust width for sidebar on desktop
          ml: { sm: `${drawerWidth}px` }, // Margin for sidebar on desktop
          mt: { xs: '56px', sm: '64px' }, // Account for Topbar height (default AppBar height)
          minHeight: '100vh', // Ensure content takes full height
          bgcolor: theme.palette.background.default, // Use theme background
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default CompanyDashboardLayout;

// AdminStep.jsx
// AllCompanyStatsCard.jsx
// ApplyModal.jsx
// BlockedCompaniesList.jsx
// CompanyListTable.jsx
// CompanyStep.jsx
// InviteCompanyForm.jsx
// JobApplicationModal.jsx
// LoginModal.jsx
// OwnerProfileCard.jsx
// OwnerSidebar.jsx
// OwnerTopbar.jsx
// PendingRequestsSection.jsx
// RequestModal.jsx
// ServicesSection.jsx
// OwnerDashboard.jsx
// InviteFormPage.jsx
