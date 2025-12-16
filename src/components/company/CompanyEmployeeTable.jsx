import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Modal,
  Typography,
  IconButton,
  Chip,
  Stack,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Edit, Delete, Block, Restore } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// --- Modal ke liye basic styling ---
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 400 }, // Make width responsive
  bgcolor: 'background.paper', // Use theme's background
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

const CompanyEmployeeTable = ({ slug, initialEmployees = [] }) => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [searchTerm, setSearchTerm] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // --- Modal State ---
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newSalary, setNewSalary] = useState('');

  // --- Search Logic ---
  const filteredEmployees = useMemo(() => {
    return employees
      .filter((emp) => emp.role !== 'admin') // Admin role ko filter karein
      .filter((emp) => {
        if (!searchTerm) return true; // Agar search term nahi hai to sab dikhayein (admins ke alawa)
        return (
          emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          emp.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
  }, [employees, searchTerm]);

  // --- Modal Handlers ---
  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setNewSalary(user.salary); // Modal mein purani salary dikhayein
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedUser(null);
    setNewSalary('');
  };

  // --- Action Handlers ---
  const handleUpdateSalary = async () => {
    if (!selectedUser) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/${slug}/users/salary`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: selectedUser.email, newSalary: parseFloat(newSalary) }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Salary updated successfully!');
        setEmployees(employees.map(emp => emp.email === selectedUser.email ? { ...emp, salary: parseFloat(newSalary) } : emp));
        handleCloseModal();
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Failed to update salary:', error);
      toast.error('Failed to update salary.');
    }
  };

  // --- Custom Confirmation Toast ---
  const showConfirmationToast = (message, onConfirm) => {
    const ConfirmToast = ({ closeToast }) => (
      <Box>
        <Typography sx={{ mb: 2 }}>{message}</Typography>
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button variant="outlined" size="small" onClick={closeToast}>
            Cancel
          </Button>
          <Button variant="contained" color="primary" size="small" onClick={() => { onConfirm(); closeToast(); }}>
            Confirm
          </Button>
        </Stack>
      </Box>
    );

    toast(<ConfirmToast />, {
      position: "top-center",
      autoClose: false, // User ko action lena hoga
      closeOnClick: false,
      draggable: false,
    });
  };

  const handleUpdateStatus = (email, newStatus) => {
    const performUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/${slug}/users/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ email: email, status: newStatus }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        // Local state ko update karein
        setEmployees(employees.map(emp =>
          emp.email === email ? { ...emp, status: newStatus } : emp
        ));
      } else {
        toast.error(`Error: ${result.message}`);
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
      toast.error('Failed to update user status.');
    }
    };

    showConfirmationToast(
      `Are you sure you want to set status to '${newStatus}' for ${email}?`,
      performUpdate
    );
  };

  const handleDeleteEmployee = (email) => {
    const performDelete = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authentication error. Please log in again.");
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/${slug}/users/delete`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ email: email }), // Controller email body mein expect kar raha hai
        });

        const result = await response.json();

        if (response.ok) {
          toast.success(result.message);
          // UI se user ko foran hatane ke liye state update karein
          setEmployees(currentEmployees => currentEmployees.filter(emp => emp.email !== email));
        } else {
          toast.error(`Error: ${result.message}`);
        }
      } catch (error) {
        console.error('Failed to delete user:', error);
        toast.error('Failed to delete user.');
      }
    };
    showConfirmationToast(`Are you sure you want to delete ${email}?`, performDelete);
  };

  const renderDesktopTable = () => (
    <TableContainer component={Paper}>
      <Table>
        <TableHead sx={{ bgcolor: 'action.hover' }}>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Phone</TableCell>
            <TableCell>Salary</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filteredEmployees.map((user) => (
            <TableRow key={user._id} hover>
              <TableCell>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar src={user.profilePic} alt={user.name}>
                    {user.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" fontWeight="bold">{user.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{user.email}</Typography>
                  </Box>
                </Stack>
              </TableCell>
              <TableCell>
                <Chip label={user.role} size="small" color={user.role === 'hr' ? 'secondary' : 'default'} />
              </TableCell>
              <TableCell>{user.phone}</TableCell>
              <TableCell>
                {user.salary ? `$${user.salary.toLocaleString()}` : 'N/A'}
              </TableCell>
              <TableCell>
                <Chip label={user.status} size="small" color={user.status === 'active' ? 'success' : 'default'} variant="outlined" />
              </TableCell>
              <TableCell align="right">
                <IconButton size="small" onClick={() => handleOpenModal(user)} title="Update Salary"><Edit /></IconButton>
                {user.status === 'active' ? (
                  <IconButton size="small" onClick={() => handleUpdateStatus(user.email, 'terminated')} title="Terminate User"><Block /></IconButton>
                ) : (
                  <IconButton size="small" color="success" onClick={() => handleUpdateStatus(user.email, 'active')} title="Activate User"><Restore /></IconButton>
                )}
                <IconButton size="small" color="error" onClick={() => handleDeleteEmployee(user.email)} title="Delete User"><Delete /></IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderMobileCards = () => (
    <Stack spacing={2}>
      {filteredEmployees.map((user) => (
        <Paper key={user._id} sx={{ p: 2, borderRadius: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <Avatar src={user.profilePic} alt={user.name}>{user.name.charAt(0)}</Avatar>
            <Box flexGrow={1}>
              <Typography variant="body1" fontWeight="bold">{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user.email}</Typography>
            </Box>
            <Chip label={user.status} size="small" color={user.status === 'active' ? 'success' : 'default'} variant="outlined" />
          </Stack>
          {/* Add more details and actions here if needed for mobile */}
        </Paper>
      ))}
    </Stack>
  );

  if (!employees) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} mb={2} spacing={2}>
        <Typography variant="h4" fontWeight={600}>
          Manage Employees
        </Typography>
        {/* <Button variant="contained" color="primary">
          Add Employee
        </Button> */}
      </Stack>
      <Box mb={3}>
        <TextField
          label="Search by Name or Email"
          variant="outlined"
          fullWidth
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Box>
      {filteredEmployees.length > 0 ? (
        isMobile ? renderMobileCards() : renderDesktopTable()
      ) : (
        <Paper sx={{ textAlign: 'center', p: 5, borderRadius: 3 }}>
          <Typography color="text.secondary">No employees found matching your search.</Typography>
        </Paper>
      )}

      {/* Salary Update Modal */}
      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Update Salary
          </Typography>
          <Typography variant="body1" color="text.secondary" mb={2}>
            For {selectedUser?.name}
          </Typography>
          <TextField
            label="New Salary"
            variant="outlined"
            fullWidth
            margin="normal"
            type="number"
            value={newSalary}
            onChange={(e) => setNewSalary(e.target.value)}
          />
          <Button variant="contained" onClick={handleUpdateSalary} fullWidth sx={{ mt: 2 }}>
            Save Changes
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default CompanyEmployeeTable;