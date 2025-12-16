import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Fade,
  Backdrop,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-toastify";

const JobApplicationModal = ({ open, handleClose, slug, jobTitle }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    message: "",
  });
  const [resume, setResume] = useState(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setFormData((prev) => ({ ...prev, position: jobTitle || "" }));
      setResume(null);
      setFileName("");
    }
  }, [open, jobTitle]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowed.includes(file.type)) {
      toast.error("Only PDF, DOC, or DOCX files are allowed");
      return;
    }

    setResume(file);
    setFileName(file.name);
  };

  const handleSubmit = async () => {
    const { name, email, position } = formData;

    if (!name || !email || !position || !resume) {
      toast.error("Please fill all required fields");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("position", formData.position);
    data.append("message", formData.message);
    data.append("resume", resume);

    setLoading(true);

    try {
      const res = await fetch(`http://localhost:5000/api/${slug}/apply`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.message || "Failed to apply");
        return;
      }

      toast.success("Application submitted successfully!");
      handleClose();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{ timeout: 500, sx: { backdropFilter: "blur(4px)" } }}
    >
      <Fade in={open}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: { xs: "90%", sm: 500 },
            bgcolor: "rgba(255,255,255,0.9)",
            borderRadius: 3,
            p: 4,
            boxShadow: 24,
            outline: "none",
            backdropFilter: "blur(10px)",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleClose}
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "#374151",
              "&:hover": { color: "#1f2937" },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Header */}
          <Typography
            variant="h5"
            fontWeight={700}
            mb={3}
            textAlign="center"
            sx={{ color: "#1e3a8a" }}
          >
            Apply for {jobTitle}
          </Typography>

          {/* Form Fields */}
          <TextField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            required
            variant="outlined"
            InputProps={{ sx: { borderRadius: 2 } }}
          />
          <TextField
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            required
            variant="outlined"
            InputProps={{ sx: { borderRadius: 2 } }}
          />
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            variant="outlined"
            InputProps={{ sx: { borderRadius: 2 } }}
          />
          <TextField
            label="Position Applying For"
            name="position"
            value={formData.position}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            required
            // disabled
            variant="outlined"
            InputProps={{ sx: { borderRadius: 2, backgroundColor: "#f3f4f6" } }}
          />
          <TextField
            label="Message"
            name="message"
            multiline
            rows={3}
            value={formData.message}
            onChange={handleChange}
            fullWidth
            sx={{ mb: 2 }}
            variant="outlined"
            InputProps={{ sx: { borderRadius: 2 } }}
          />

          {/* Resume Upload */}
          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{
              mb: 1,
              fontWeight: 600,
              borderRadius: 2,
              borderColor: "#6366f1",
              color: "#4f46e5",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#eef2ff",
                borderColor: "#4f46e5",
              },
            }}
          >
            Upload Resume (PDF/DOC)
            <input type="file" hidden onChange={handleFileChange} />
          </Button>

          {/* Selected File */}
          {fileName && (
            <Typography
              variant="body2"
              sx={{
                mb: 2,
                color: "#4b5563",
                fontStyle: "italic",
                textAlign: "left",
              }}
            >
              Selected: {fileName}
            </Typography>
          )}

          {/* Submit Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={loading}
            sx={{
              backgroundColor: "#4f46e5",
              "&:hover": { backgroundColor: "#4338ca" },
              fontWeight: 600,
              py: 1.5,
              borderRadius: 2,
            }}
          >
            {loading ? "Submitting..." : "Submit Application"}
          </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default JobApplicationModal;
