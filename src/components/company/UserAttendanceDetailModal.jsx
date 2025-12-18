import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, IconButton, useTheme, CircularProgress, Stack, Chip } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify';
import { format, getMonth, getYear } from 'date-fns';
import CloseIcon from '@mui/icons-material/Close';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: 450 },
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 3,
};

const UserAttendanceDetailModal = ({ open, onClose, user, slug }) => {
  const theme = useTheme();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (open && user) {
      fetchMonthlyAttendance(currentDate);
    }
  }, [open, user, currentDate]);

  const fetchMonthlyAttendance = async (date) => {
    setLoading(true);
    const month = format(date, 'yyyy-MM');
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/${slug}/attendance/user/${user.userId}?month=${month}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const result = await response.json();
      if (response.ok) {
        setAttendance(result.attendance);
        setUserName(result.userName);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to fetch attendance.");
    } finally {
      setLoading(false);
    }
  };

  const getTileClassName = ({ date, view }) => {
    if (view === 'month') {
      const record = attendance.find(att => format(new Date(att.date), 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'));
      if (record) {
        return `attendance-tile--${record.status}`;
      }
    }
  };

  const handleActiveStartDateChange = ({ activeStartDate }) => {
    // Fetch data only if month or year changes
    if (getMonth(activeStartDate) !== getMonth(currentDate) || getYear(activeStartDate) !== getYear(currentDate)) {
      setCurrentDate(activeStartDate);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight={600}>
            {userName || user?.name}'s Attendance
          </Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Stack>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box className="attendance-calendar-wrapper">
            <style>{`
              .attendance-tile--present { background-color: ${theme.palette.success.light}80; }
              .attendance-tile--absent { background-color: ${theme.palette.error.light}80; }
              .attendance-tile--leave { background-color: ${theme.palette.warning.light}80; }
              .react-calendar { border: none; width: 100%; }
              .react-calendar__tile { border-radius: 4px; }
            `}</style>
            <Calendar
              onActiveStartDateChange={handleActiveStartDateChange}
              value={currentDate}
              tileClassName={getTileClassName}
              maxDate={new Date()}
            />
          </Box>
        )}
        <Stack direction="row" spacing={2} mt={2} justifyContent="center">
            <Chip label="Present" sx={{ bgcolor: `${theme.palette.success.light}80` }} size="small" />
            <Chip label="Absent" sx={{ bgcolor: `${theme.palette.error.light}80` }} size="small" />
            <Chip label="On Leave" sx={{ bgcolor: `${theme.palette.warning.light}80` }} size="small" />
        </Stack>
      </Box>
    </Modal>
  );
};

export default UserAttendanceDetailModal;