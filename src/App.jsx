import React, { useMemo, useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage';
import OwnerDashboard from './pages/OwnerDashboard';
import getTheme from './theme/theme';
import InviteFormPage from './pages/InviteFormPage';
import SearchCompanyPage from './pages/SearchCompanyPage';
import CompanyRouteHandler from './pages/CompanyRouteHandler';
import CompanyDashboardLayout from './pages/CompanyDashboardLayout';
import CompanyInviteFormPage from './pages/CompanyInviteFormPage';

// You can also import nested pages here
// import DashboardHome from './pages/DashboardHome';
// import ProfilePage from './pages/ProfilePage';

function App() {
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };
  // console.log(toggleTheme);

  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/owner/dashboard"
          element={<OwnerDashboard toggleTheme={toggleTheme} mode={mode} />}
        />

        <Route
          path="/invite"
          element={<InviteFormPage toggleTheme={toggleTheme} mode={mode} />}
        />
        <Route path="/companyInvite" element={<CompanyInviteFormPage />} />
        <Route path="/searchCompany" element={<SearchCompanyPage toggleTheme={toggleTheme} mode={mode} />} />

        {/* 👇 Company Slug Route */}
        <Route path="/company/:slug" element={<CompanyRouteHandler toggleTheme={toggleTheme} mode={mode} />}>
          {/* 👇 Dashboard Layout will load only when access is granted inside handler */}
          <Route path="dashboard" element={<CompanyDashboardLayout />}>
            {/* Future nested routes go here */}
            {/* <Route index element={<DashboardHome />} /> */}
            {/* <Route path="profile" element={<ProfilePage />} /> */}
          </Route>
        </Route>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
