import React, { useState } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  RadioGroup,
  FormControlLabel,
  Radio,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify"; // ✅ Toastify import

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: '90%', sm: 350 }, // Make width responsive
  bgcolor: "background.paper",
  borderRadius: 3,
  boxShadow: 24,
  p: 4,
};

const AttendanceModal = ({ open, onClose, companySlug }) => {
  const { slug: routeSlug } = useParams();
  const slug = companySlug || routeSlug;
  const [status, setStatus] = useState("present");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${slug}/attendance/mark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to mark attendance");

      toast.success("✅ Attendance marked successfully");
      onClose(); // close modal
    } catch (error) {
      toast.error(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Mark Attendance
        </Typography>

        <RadioGroup
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          sx={{ mb: 2 }}
        >
          <FormControlLabel value="present" control={<Radio />} label="Present" />
          <FormControlLabel value="absent" control={<Radio />} label="Absent" />
          {/* <FormControlLabel value="leave" control={<Radio />} label="Leave" /> */}
        </RadioGroup>

        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
        </Button>
      </Box>
    </Modal>
  );
};

export default AttendanceModal;
