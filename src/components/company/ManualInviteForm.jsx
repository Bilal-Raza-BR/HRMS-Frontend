import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Stack,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { toast } from 'react-toastify';
import SendIcon from '@mui/icons-material/Send';
import { useParams } from 'react-router-dom';

const roles = [
  { value: 'employee', label: 'Employee' },
  { value: 'hr', label: 'HR' },
  { value: 'admin', label: 'Admin' },
];

const ManualInviteForm = () => {
  const { slug } = useParams(); // ✅ Get slug from URL
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('employee');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    let tempErrors = {};
    let isValid = true;
    if (!email) {
      tempErrors.email = "Email is required.";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = "Email is not valid.";
      isValid = false;
    }
    if (!role) {
      tempErrors.role = "Role is required.";
      isValid = false;
    }
    setErrors(tempErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the errors before submitting.");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/${slug}/invite/manual`, { // ✅ Use slug in URL
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ email, role }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Invite sent successfully!");
        setEmail('');
        setRole('employee');
        setErrors({});
      } else {
        toast.error(result.message || "Failed to send invite.");
      }
    } catch (error) {
      console.error("Manual invite error:", error);
      toast.error("An error occurred while sending the invite.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3, maxWidth: 500, mx: 'auto' }}>
      <Typography variant="h5" fontWeight={700} mb={3} textAlign="center">
        Invite New User
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <TextField
            label="User Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            required
          />
          <TextField select label="Assign Role" value={role} onChange={(e) => setRole(e.target.value)} fullWidth required>
            {roles.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Button type="submit" variant="contained" size="large" startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SendIcon />} disabled={loading}>
            {loading ? 'Sending...' : 'Send Invite'}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default ManualInviteForm;