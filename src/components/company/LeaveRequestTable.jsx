import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Avatar,
  Button,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import FullPageLoader from '../FullPageLoader';

const LeaveRequestTable = ({ slug }) => {
  const [allLeaves, setAllLeaves] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: null, userEmail: null, leaveId: null });

  const fetchLeaveRequests = useCallback(async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/${slug}/leaves/all`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) {
        // Flatten the data: The API returns users with nested leaves.
        // We create a flat array of leaves, with user info and original index attached.
       
        
        const flattenedLeaves = result.data.flatMap(user =>
          user.leaves.map((leave, index) => ({
            ...leave,
            user: { name: user.name, email: user.email, profilePic: user.profilePic },
            leaveIndex: index, // Keep track of the original index for API calls
          }))
        );
        setAllLeaves(flattenedLeaves);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to fetch leave requests.");
    }
  }, [slug]);

  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests]);

  const handleStatusUpdate = async (userEmail, leaveIndex, status) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/${slug}/leaves/update`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ userEmail, leaveIndex, status }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        fetchLeaveRequests(); // Refresh data
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Operation failed.");
    }
  };

  const handleDelete = (userEmail, leaveId) => {
    setDeleteTarget({ type: 'single', userEmail, leaveId });
    setDeleteModalOpen(true);
  };

  const handleDeleteAll = () => {
    setDeleteTarget({ type: 'all' });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    const token = localStorage.getItem("token");
    try {
      let response;
      if (deleteTarget.type === 'all') {
        response = await fetch(`${import.meta.env.VITE_API_URL}/api/${slug}/leaves/delete-all`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } else {
        response = await fetch(`${import.meta.env.VITE_API_URL}/api/${slug}/leaves/delete`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify({ userEmail: deleteTarget.userEmail, leaveId: deleteTarget.leaveId }),
        });
      }

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        fetchLeaveRequests(); // Refresh data
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Operation failed.");
    } finally {
      setDeleteModalOpen(false);
      setDeleteTarget({ type: null, userEmail: null, leaveId: null });
    }
  };

  const statusChip = (status) => {
    const color = status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'warning';
    return <Chip label={status} color={color} size="small" sx={{ textTransform: 'capitalize' }} />;
  };

  const renderDesktopTable = () => (
    <TableContainer>
      <Table>
        <TableHead sx={{ bgcolor: 'action.hover' }}>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold' }}>Employee</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Leave Type</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Dates</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Reason</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allLeaves.map((leave) => (
            <TableRow key={`${leave.user.email}-${leave.leaveIndex}`} hover>
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={1.5}>
                  <Avatar src={leave.user.profilePic} sx={{ width: 36, height: 36 }}>{leave.user.name.charAt(0)}</Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">{leave.user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{leave.user.email}</Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell sx={{ textTransform: 'capitalize' }}>{leave.leaveType}</TableCell>
              <TableCell>{format(new Date(leave.startDate), 'dd MMM yyyy')} - {format(new Date(leave.endDate), 'dd MMM yyyy')}</TableCell>
              <TableCell>{leave.reason}</TableCell>
              <TableCell align="center">{statusChip(leave.status)}</TableCell>
              <TableCell align="right">
                {leave.status === 'pending' && (
                  <>
                    <Tooltip title="Approve"><IconButton color="success" onClick={() => handleStatusUpdate(leave.user.email, leave.leaveIndex, 'approved')}><CheckCircleIcon /></IconButton></Tooltip>
                    <Tooltip title="Reject"><IconButton color="error" onClick={() => handleStatusUpdate(leave.user.email, leave.leaveIndex, 'rejected')}><CancelIcon /></IconButton></Tooltip>
                  </>
                )}
                <Tooltip title="Delete"><IconButton onClick={() => handleDelete(leave.user.email, leave._id)}><DeleteIcon /></IconButton></Tooltip>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderMobileCards = () => (
    <Stack spacing={2}>
      {allLeaves.map((leave) => (
        <Paper key={`${leave.user.email}-${leave.leaveIndex}`} sx={{ p: 2, borderRadius: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Avatar src={leave.user.profilePic}>{leave.user.name.charAt(0)}</Avatar>
              <Box>
                <Typography fontWeight="bold">{leave.user.name}</Typography>
                <Typography variant="body2" color="text.secondary">{format(new Date(leave.startDate), 'dd MMM')} - {format(new Date(leave.endDate), 'dd MMM yyyy')}</Typography>
              </Box>
            </Stack>
            {statusChip(leave.status)}
          </Stack>
          <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>"{leave.reason}"</Typography>
          {leave.status === 'pending' && (
            <Stack direction="row" justifyContent="flex-end" spacing={1} mt={1}>
              <Button size="small" variant="outlined" color="error" onClick={() => handleStatusUpdate(leave.user.email, leave.leaveIndex, 'rejected')}>Reject</Button>
              <Button size="small" variant="contained" color="success" onClick={() => handleStatusUpdate(leave.user.email, leave.leaveIndex, 'approved')}>Approve</Button>
            </Stack>
          )}
        </Paper>
      ))}
    </Stack>
  );

  if (!allLeaves) return <FullPageLoader />;

  return (
    <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} mb={2} spacing={2}>
        <Typography variant="h5" fontWeight={700}>
          Manage Leave Requests
        </Typography>
        {allLeaves.length > 0 && (
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteAll}
          >
            Delete All
          </Button>
        )}
      </Stack>
      {allLeaves.length > 0 ? (
        isMobile ? renderMobileCards() : renderDesktopTable()
      ) : (
        <Typography sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>
          No pending leave requests.
        </Typography>
      )}

      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            {deleteTarget.type === "all"
              ? "Are you sure you want to delete ALL leave requests? This action cannot be undone."
              : "Are you sure you want to delete this leave request?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default LeaveRequestTable;