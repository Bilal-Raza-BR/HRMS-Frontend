import React, { useState, useRef } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  CircularProgress,
  Slide,
  Grid,
  InputAdornment,
} from "@mui/material";
import { toast } from "react-toastify";
import { MdDone, MdError, MdSend } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import confetti from "canvas-confetti";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import ApartmentIcon from "@mui/icons-material/Apartment";

const InviteCompanyForm = () => {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    industry: "",
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const formRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { companyName, email, industry } = formData;

    if (!companyName || !email || !industry) {
      toast.error(
        "All fields are required"
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/admin/invite-company", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ownerToken")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(
          <span>
            <MdDone style={{ verticalAlign: "middle" }} /> Invite sent successfully
          </span>
        );
        triggerConfetti();
        setFormData({ companyName: "", email: "", industry: "" });
      } else {
        toast.error(
          <span>
            <MdError style={{ verticalAlign: "middle" }} /> {data.message || "Something went wrong"}
          </span>
        );
      }
    } catch (error) {
      toast.error(
        <span>
          <MdError style={{ verticalAlign: "middle" }} /> Something went wrong
        </span>
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: { xs: 2, sm: 4 },
        borderRadius: 4,
        background: "linear-gradient(145deg, #f9f9f9, #ffffff)",
        boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.1)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <MdSend style={{ marginRight: "12px", fontSize: "2rem", color: "#4f46e5" }} />
        <Typography variant="h5" fontWeight={700} sx={{ color: "#1e3a8a" }}>
          Invite a New Company
        </Typography>
      </Box>

      <Slide direction="up" in={showForm} mountOnEnter unmountOnExit>
        <Box component="form" onSubmit={handleSubmit} noValidate ref={formRef}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <BusinessIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Company Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              fullWidth
              label="Industry"
              name="industry"
              value={formData.industry}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ApartmentIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box mt={4}>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              fullWidth
              size="large"
              endIcon={loading ? null : <MdSend />}
              sx={{
                py: 1.5,
                fontWeight: 600,
                borderRadius: 2,
                background: "linear-gradient(90deg, #6366f1, #4f46e5)",
                "&:hover": { background: "linear-gradient(90deg, #4f46e5, #4338ca)" },
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Send Invite"}
            </Button>
          </Box>
        </Box>
      </Slide>
    </Paper>
  );
};

export default InviteCompanyForm;