import React, { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  Skeleton,
  Stack,
} from '@mui/material';
import OwnerSidebar from '../components/OwnerSidebar';
import OwnerTopbar from '../components/OwnerTopbar';
import OwnerProfileCard from '../components/OwnerProfileCard';
import AllCompanyStatsCard from '../components/AllCompanyStatsCard';
import CompanyListTable from '../components/CompanyListTable';
import BlockedCompaniesList from '../components/BlockedCompaniesList';
import InviteCompanyForm from '../components/InviteCompanyForm';
import CompanyRequestTable from '../components/CompanyRequestTable';
// import PendingRequestSection from '../components/PendingRequestsSection';
import {
  BarChart,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { ToastContainer } from 'react-toastify';
import { useTheme } from '@mui/material/styles';

const drawerWidth = 240;

const OwnerDashboard = ({ toggleTheme, mode }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [owner, setOwner] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    blockedCompanies: 0,
    activeCompanies: 0,
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const theme = useTheme();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const update = () => {
  setRefresh(prev => !prev); // toggle karega refresh state ko
};
  // console.log(refresh);
  
  useEffect(() => {
    const fetchOwner = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/owner/profile`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ownerToken")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setOwner(data.owner);
        }
      } catch (error) {
        console.error("Owner fetch failed:", error.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ownerToken")}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          // console.log(data);

          setStats(data);
        }
      } catch (error) {
        console.error("Stats fetch failed:", error.message);
      }
    };

    fetchOwner();
    fetchStats();
  }, [refresh]);
  // console.log(stats);

  const pieChartData = [
    { name: 'Active Companies', value: stats.activeCompanies },
    { name: 'Blocked Companies', value: stats.blockedCompanies },
  ];

  const COLORS = [theme.palette.success.main, theme.palette.error.main];
  // console.log(owner);

  const renderSkeletons = () => (
    <>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {[...Array(3)].map((_, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
              <Skeleton variant="text" width="60%" height={30} />
              <Skeleton variant="text" width="40%" height={40} />
            </Paper>
          </Grid>
        ))}
      </Grid>
      <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
        <Skeleton variant="text" width="40%" height={40} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={250} />
      </Paper>
    </>
  );

  if (loading && activeTab === 'dashboard') {
    // Initial loading screen can be more centered and prominent
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress /></Box>;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <Paper elevation={3} sx={{ p: 1.5, borderRadius: 2, background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(5px)' }}>
          <Typography variant="subtitle2" fontWeight="bold">{data.name}</Typography>
          <Typography variant="body2" sx={{ color: data.payload.fill }}>{`Count: ${data.value}`}</Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <OwnerSidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
        toggleTheme={toggleTheme}
        themeMode={mode}
        ownerData={owner}
        onTabChange={setActiveTab}
        activeTab={activeTab}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <OwnerTopbar onMenuClick={handleDrawerToggle} owner={owner} />

        {/* --- DASHBOARD TAB --- */}
        {activeTab === 'dashboard' && (
          loading ? renderSkeletons() : <>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid xs={12} sm={6} md={4}>
                <AllCompanyStatsCard title="Total Companies" value={stats.totalCompanies}  />
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <AllCompanyStatsCard title="Blocked Companies" value={stats.blockedCompanies} />
              </Grid>
              <Grid xs={12} sm={6} md={4}>
                <AllCompanyStatsCard title="Active Companies" value={stats.activeCompanies} />
              </Grid>
            </Grid>


            <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
              <Typography variant="h6" fontWeight={600} mb={1}>Companies Overview</Typography>
              <Box sx={{ position: 'relative', width: '100%', height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Tooltip content={<CustomTooltip />} />
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend iconSize={10} wrapperStyle={{ paddingTop: 20 }} />
                  </PieChart>
                </ResponsiveContainer>
                <Box
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    mt: -2, // Adjust to vertically center with legend
                  }}
                >
                  <Typography variant="h4" fontWeight="bold">{stats.totalCompanies}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Total Companies
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </>
        )}

        {/* --- COMPANIES TAB --- */}
        {activeTab === 'companies' && (
          <Paper elevation={3} sx={{ p: 2 }}>
            <CompanyListTable refresh={update}
       />
          </Paper>
        )}

        {/* --- INVITE COMPANY TAB --- */}
        {activeTab === 'invite' && (
          <Paper elevation={3} sx={{ p: 2 }}>
            <InviteCompanyForm />
          </Paper>
        )}

        {/* --- REQUESTS TAB --- */}
        {activeTab === 'requests' && (
          <Paper elevation={3} sx={{ p: 2 }}>
            <CompanyRequestTable />
          </Paper>
        )}

        {/* --- BLOCKED TAB --- */}
        {activeTab === 'blocked' && (
          <Paper elevation={3} sx={{ p: 2 }}>
            <BlockedCompaniesList refresh={update} />
          </Paper>
        )}
        {activeTab === 'profile' && (
          <Paper elevation={3} sx={{ p: 2 }}>
            <OwnerProfileCard owner={owner} />
          </Paper>
        )}
      </Box>
    </Box>
  );
};

export default OwnerDashboard;
