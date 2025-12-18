import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Stack,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  useTheme,
  useMediaQuery,
  Divider,
  TextField,
  InputAdornment,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import HotelIcon from '@mui/icons-material/Hotel';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { toast, ToastContainer } from 'react-toastify';
import SearchIcon from '@mui/icons-material/Search';
import { motion } from 'framer-motion';
import 'react-toastify/dist/ReactToastify.css';
import FullPageLoader from '../FullPageLoader';
import UserAttendanceDetailModal from './UserAttendanceDetailModal';

const AttendanceManagement = ({ slug }) => {
  const theme = useTheme();
  const [attendanceList, setAttendanceList] = useState(null);
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'present', 'absent', 'leave', 'not-marked'
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const fetchAttendance = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication error.");
      return;
    }
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/${slug}/attendance/all-today`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) {
        setAttendanceList(result.data);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to fetch attendance data.");
    }
  }, [slug]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const apiCall = async (endpoint, method, body) => {
    const token = localStorage.getItem("token");
    return fetch(`${import.meta.env.VITE_API_URL}/api/${slug}/${endpoint}`, {
      method,
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify(body),
    });
  };

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUser(null);
  };

  const handleOpenDetailModal = (user) => {
    setSelectedUser(user);
    setDetailModalOpen(true);
  };

  const handleManualMark = async (status) => {
    const originalList = [...attendanceList];
    const optimisticUpdate = attendanceList.map(user =>
      user.userId === selectedUser.userId ? { ...user, status } : user
    );
    setAttendanceList(optimisticUpdate);
    handleMenuClose();

    try {
      const response = await apiCall('attendance/manual-mark', 'POST', { userId: selectedUser.userId, status });
      const result = await response.json();
      if (!response.ok) {
        toast.error(result.message);
        setAttendanceList(originalList); // Revert on error
      } else {
        toast.success(result.message);
      }
    } catch (error) {
      toast.error("Operation failed.");
      setAttendanceList(originalList); // Revert on error
    }
  };

  const handleMarkRemainingAbsent = async () => {
    toast.info("Marking remaining users as absent...");
    const response = await apiCall('attendance/mark-remaining-absent', 'POST', {});
    const result = await response.json();
    response.ok ? toast.success(result.message) : toast.error(result.message);
    fetchAttendance(); // Refresh data
  };

  const handleStatusFilterClick = (statusKey) => {
    // Agar dobara usi filter par click ho to reset kar dein
    setStatusFilter(prevFilter => prevFilter === statusKey ? 'all' : statusKey);
  };

  // Filtered list based on search term
  const filteredList = useMemo(() => {
    let list = attendanceList || [];

    if (statusFilter !== 'all') {
      list = list.filter(user => user.status === statusFilter);
    }

    if (!searchTerm) return list;

    return list.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [attendanceList, searchTerm, statusFilter]);

  // Summary calculation
  const summaryData = useMemo(() => {
    const summary = { present: 0, absent: 0, leave: 0, 'not-marked': 0 };
    (attendanceList || []).forEach(user => {
      summary[user.status]++;
    });
    return [
      { title: 'Present', statusKey: 'present', count: summary.present, icon: <CheckCircleIcon />, color: theme.palette.success.main },
      { title: 'Absent', statusKey: 'absent', count: summary.absent, icon: <CancelIcon />, color: theme.palette.error.main },
      { title: 'On Leave', statusKey: 'leave', count: summary.leave, icon: <HotelIcon />, color: theme.palette.warning.main },
      { title: 'Not Marked', statusKey: 'not-marked', count: summary['not-marked'], icon: <HelpOutlineIcon />, color: theme.palette.grey[600] },
    ];
  }, [attendanceList, theme]);

  const statusChip = (status) => {
    switch (status) {
      case 'present':
        return <Chip label="Present" color="success" size="small" variant="outlined" icon={<CheckCircleIcon />} />;
      case 'absent':
        return <Chip label="Absent" color="error" size="small" variant="outlined" icon={<CancelIcon />} />;
      case 'leave':
        return <Chip label="On Leave" color="warning" size="small" variant="outlined" icon={<HotelIcon />} />;
      default:
        return <Chip label="Not Marked" size="small" />;
    }
  };

  const renderDesktopTable = () => (
    <TableContainer>
      <Table>
        <TableHead sx={{ bgcolor: 'action.hover' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, py: 1.5 }}>Employee</TableCell>
            <TableCell align="center" sx={{ fontWeight: 600, py: 1.5 }}>Status</TableCell>
            <TableCell align="right" sx={{ fontWeight: 600, py: 1.5 }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredList.map((user) => (
            <TableRow key={user.userId} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar src={user.profilePic} alt={user.name}>{user.name.charAt(0)}</Avatar>
                  <Box onClick={() => handleOpenDetailModal(user)} sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}>
                    <Typography variant="body1" fontWeight="bold">{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell align="center">
                {statusChip(user.status)}
              </TableCell>
              <TableCell align="right">
                <IconButton onClick={(e) => handleMenuOpen(e, user)} title="Mark Attendance">
                  <MoreVertIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderMobileList = () => (
    <Stack spacing={2}>
      {filteredList.map((user) => (
        <Paper key={user.userId} sx={{ p: 2, borderRadius: 3, boxShadow: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" alignItems="center" spacing={1.5} onClick={() => handleOpenDetailModal(user)} sx={{ cursor: 'pointer', flex: 1, minWidth: 0 }}>
              <Avatar src={user.profilePic} alt={user.name}>{user.name.charAt(0)}</Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body1" fontWeight="bold" noWrap>{user.name}</Typography>
                <Typography variant="body2" color="text.secondary" noWrap>{user.email}</Typography>
              </Box>
            </Stack>
            <IconButton onClick={(e) => handleMenuOpen(e, user)} title="Mark Attendance">
              <MoreVertIcon />
            </IconButton>
          </Stack>
          <Divider sx={{ my: 1.5 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center"><Typography variant="body2">Status:</Typography>{statusChip(user.status)}</Stack>
        </Paper>
      ))}
    </Stack>
  );

  if (!attendanceList) return <FullPageLoader />;

  return (
    <Box>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} theme={theme.palette.mode} />

      <Typography variant="h4" component="h1" fontWeight={700} mb={3} sx={{ color: 'primary.main', typography: { xs: 'h5', sm: 'h4' } }}>
        Daily Attendance Overview
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} mb={3}>
        {summaryData.map(item => (
          <Grid item xs={6} sm={6} md={3} key={item.title} component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Paper
              onClick={() => handleStatusFilterClick(item.statusKey)}
              sx={{
                p: 2,
                display: 'flex',
                alignItems: 'center',
                borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                border: statusFilter === item.statusKey ? `2px solid ${item.color}` : '2px solid transparent',
                transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                cursor: 'pointer',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                },
                ...(statusFilter === item.statusKey && { transform: 'translateY(-4px)', boxShadow: '0 8px 20px rgba(0,0,0,0.1)' })
              }}
            >
              <Avatar sx={{ bgcolor: `${item.color}20`, color: item.color, mr: 2, width: 48, height: 48 }}>{item.icon}</Avatar>
              <Box>
                <Typography variant="h5" fontWeight="bold">{item.count}</Typography>
                <Typography variant="body1" color="text.secondary">{item.title}</Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Main Table */}
      <Paper sx={{ p: { xs: 1, sm: 2, md: 3 }, borderRadius: 3, boxShadow: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          mb={2}
        >
          <Typography variant="h5" fontWeight={700} sx={{ alignSelf: { xs: 'flex-start', md: 'center' } }}>Employee List</Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ width: { xs: '100%', md: 'auto' } }}>
            <TextField
              label="Search Employee"
              variant="outlined"
              size="small"
              sx={{ width: { xs: '100%', sm: 'auto', md: 250 } }}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
              <Button
                variant="contained"
                color="error"
                onClick={handleMarkRemainingAbsent}
                sx={{ flexShrink: 0 }}
              >
                Mark Remaining as Absent
              </Button>
          </Stack>
        </Stack>

        {filteredList.length > 0 ? (
          isMobile ? renderMobileList() : renderDesktopTable()
        ) : (
          <Box sx={{ textAlign: 'center', p: 5 }}>
            <Typography variant="h6" color="text.secondary">
              No employees found.
            </Typography>
          </Box>
        )}

      </Paper>

      {/* Manual Mark Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleManualMark('present')}>
          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
          Mark as Present
        </MenuItem>
        <MenuItem onClick={() => handleManualMark('absent')}>
          <CancelIcon color="error" sx={{ mr: 1 }} />
          Mark as Absent
        </MenuItem>
        <MenuItem onClick={() => handleManualMark('leave')}>
          <HotelIcon color="warning" sx={{ mr: 1 }} />
          Mark as On Leave
        </MenuItem>
      </Menu>

      <UserAttendanceDetailModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        user={selectedUser}
        slug={slug}
      />
    </Box>
  );
};

export default AttendanceManagement;




// ApplicationTable.jsx
// ApplyLeaveModal.jsx
// LeaveRequestTable.jsx
// ManualInviteForm.jsx
// UserProfilePage.jsx
// AttendanceManagement.jsx
// AttendanceModal.jsx
// CompanyEmployeeTable.jsx
// CompanySidebar.jsx
// CompanyTopbar.jsx
// MyCompanyStatsCard.jsx
// ResumePreviewModal.jsx
// UserAttendanceDetailModal.jsx
// UserProfileModal.jsx
// UserProfilePage.jsx
// CompanyDashboardLayout.jsx
