import React, { useState } from "react";
import {
  Dialog,
  Box,
  TextField,
  Button,
  IconButton,
  Typography,
  Fade,
  Backdrop,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

const RequestModal = ({ open, handleClose }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    companyEmail: "",
    industry: "",
    contactPerson: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { companyName, companyEmail, industry, contactPerson, phone } =
      formData;

    // ✅ Frontend validation
    if (!companyName || !companyEmail || !industry || !contactPerson || !phone) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/request-service`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ SUCCESS TOAST FIRST
        toast.success(data.message || "Request sent successfully!");

        // ✅ Reset form
        setFormData({
          companyName: "",
          companyEmail: "",
          industry: "",
          contactPerson: "",
          phone: "",
          message: "",
        });

        // ✅ CLOSE MODAL AFTER TOAST SHOWS
        setTimeout(() => {
          handleClose();
        }, 400);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        sx: {
          backdropFilter: "blur(6px)",
          backgroundColor: "rgba(0,0,0,0.3)",
        },
      }}
      sx={{ "& .MuiPaper-root": { borderRadius: 3 } }}
    >
      <Fade in={open}>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 4,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            position: "relative",
          }}
        >
          {/* Header */}
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={700}>
              Request HRMS Service
            </Typography>
            <IconButton onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Inputs */}
          <TextField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} required />
          <TextField label="Official Email" name="companyEmail" value={formData.companyEmail} onChange={handleChange} required />
          <TextField label="Industry" name="industry" value={formData.industry} onChange={handleChange} required />
          <TextField label="Contact Person" name="contactPerson" value={formData.contactPerson} onChange={handleChange} required />
          <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} required />
          <TextField label="Message (Optional)" name="message" value={formData.message} onChange={handleChange} multiline rows={3} />

          {/* Actions */}
          <Box display="flex" justifyContent="flex-end" gap={1}>
            <Button onClick={handleClose} color="error" variant="outlined">
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? "Submitting..." : "Submit"}
            </Button>
          </Box>
        </Box>
      </Fade>
    </Dialog>
  );
};

export default RequestModal;
