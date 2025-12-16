import React, { useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Button,
  MenuItem,
  Typography,
  Avatar,
  Stack,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { styled, width } from "@mui/system";

const Input = styled("input")({
  display: "none",
});

const genders = ["Male", "Female", "Other"];

const AdminStep = ({
  adminData,
  setAdminData,
  handleBack,
  handleSubmit,
  isSubmitting,
}) => {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setAdminData({ ...adminData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAdminData({ ...adminData, profilePic: file });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!adminData.name) newErrors.name = "Name is required";
    if (!adminData.password) newErrors.password = "Password is required";
    if (!adminData.phone) newErrors.phone = "Phone is required";
    if (!adminData.gender) newErrors.gender = "Gender is required";
    if (!adminData.dob) newErrors.dob = "Date of birth is required";
    // if (!adminData.joiningDate) newErrors.joiningDate = "Joining date is required";
    if (!adminData.address) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      handleSubmit();
    }
  };

  return (
    <Box component="form" onSubmit={handleFinalSubmit}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        👤 Company Admin Information
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Full Name"
            name="name"
            fullWidth
            value={adminData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            error={!!errors.name}
            helperText={errors.name}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Password"
            name="password"
            type="password"
            fullWidth
            value={adminData.password}
            onChange={handleChange}
            disabled={isSubmitting}
            error={!!errors.password}
            helperText={errors.password}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone"
            name="phone"
            fullWidth
            value={adminData.phone}
            onChange={handleChange}
            disabled={isSubmitting}
            error={!!errors.phone}
            helperText={errors.phone}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
          sx={{width:"220px"}}
            select
            label="Gender"
            name="gender"
            width="100px"
            placeholder="Gender"
            value={adminData.gender}
            onChange={handleChange}
            disabled={isSubmitting}
            error={!!errors.gender}
            helperText={errors.gender}
          >
            {genders.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Date of Birth"
            value={adminData.dob || null}
            onChange={(newValue) =>
              setAdminData({ ...adminData, dob: newValue })
            }
            renderInput={(params) => (
              <TextField
                {...params}
                fullWidth
                disabled={isSubmitting}
                error={!!errors.dob}
                helperText={errors.dob}
              />
            )}
          />
        </Grid>


        <Grid item xs={12}>
          <TextField
            label="Address"
            name="address"
            fullWidth
            value={adminData.address}
            onChange={handleChange}
            disabled={isSubmitting}
            error={!!errors.address}
            helperText={errors.address}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" fontWeight="medium" mb={1}>
            Upload Profile Picture
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <label htmlFor="profile-upload">
              <Input
                accept="image/*"
                id="profile-upload"
                type="file"
                onChange={handleFileChange}
                disabled={isSubmitting}
              />
              <Button variant="contained" component="span" disabled={isSubmitting}>
                Upload
              </Button>
            </label>
            {adminData.profilePic && (
              <Avatar
                src={
                  typeof adminData.profilePic === "string"
                    ? adminData.profilePic
                    : URL.createObjectURL(adminData.profilePic)
                }
                alt="Profile"
                sx={{ width: 56, height: 56 }}
              />
            )}
          </Stack>
        </Grid>

        <Grid item xs={12} display="flex" justifyContent="space-between" mt={2}>
          <Button onClick={handleBack} variant="outlined" disabled={isSubmitting}>
            Back
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            endIcon={
              isSubmitting ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminStep;
