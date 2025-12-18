import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Box, IconButton, Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';

const ApplyModal = ({ open, handleClose, slug }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    position: '',
    resume: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = formData.resume;
    if (!file || file.type !== 'application/pdf') {
      return toast.error("Please upload a PDF resume");
    }

    const body = new FormData();
    body.append('name', formData.name);
    body.append('email', formData.email);
    body.append('position', formData.position);
    body.append('resume', file);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/job/apply/${slug}`, {
        method: 'POST',
        body
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Application submitted!");
        handleClose();
        setFormData({ name: '', email: '', position: '', resume: null });
      } else {
        toast.error(data.message || "Submission failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Apply for Job</Typography>
          <IconButton onClick={handleClose}><CloseIcon /></IconButton>
        </Box>
      </DialogTitle>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <DialogContent>
          <TextField
            fullWidth label="Full Name" name="name"
            margin="normal" required value={formData.name}
            onChange={handleChange}
          />
          <TextField
            fullWidth label="Email" name="email" type="email"
            margin="normal" required value={formData.email}
            onChange={handleChange}
          />
          <TextField
            fullWidth label="Position Applying For" name="position"
            margin="normal" required value={formData.position}
            onChange={handleChange}
          />
          <Button
            variant="outlined"
            component="label"
            sx={{ mt: 2 }}
          >
            Upload Resume bilal(PDF)
            <input
              type="file"
              hidden
              accept="application/pdf"
              onChange={handleFileChange}
            />
          </Button>
          {formData.resume && (
            <Typography variant="body2" mt={1}>
              Selected: {formData.resume.name}
            </Typography>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained" color="primary">Submit</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default ApplyModal;
