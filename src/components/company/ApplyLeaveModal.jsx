import React, { useState } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 500 },
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 3,
};

const ApplyLeaveModal = ({ open, onClose, slug }) => {
  const [leaveType, setLeaveType] = useState('sick');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      return toast.error("Please fill all fields.");
    }
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication error. Please log in again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/${slug}/leave/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ leaveType, startDate, endDate, reason }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
        onClose();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to submit leave request.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>Apply for Leave</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Stack>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <FormControl fullWidth>
              <InputLabel>Leave Type</InputLabel>
              <Select
                value={leaveType}
                label="Leave Type"
                onChange={(e) => setLeaveType(e.target.value)}
              >
                <MenuItem value="sick">Sick Leave</MenuItem>
                <MenuItem value="casual">Casual Leave</MenuItem>
                <MenuItem value="annual">Annual Leave</MenuItem>
                <MenuItem value="unpaid">Unpaid Leave</MenuItem>
              </Select>
            </FormControl>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Start Date"
                type="date"
                fullWidth
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="End Date"
                type="date"
                fullWidth
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Stack>

            <TextField
              label="Reason for Leave"
              multiline
              rows={4}
              fullWidth
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
            >{isSubmitting ? 'Submitting...' : 'Submit Request'}</Button>
          </Stack>
        </form>
      </Box>

    </Modal>
  );
};

export default ApplyLeaveModal;