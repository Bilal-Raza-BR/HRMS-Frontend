// components/CompanyStep.jsx

import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Grid,
  Typography,
  Button,
  Avatar,
  colors,
} from "@mui/material";
import { jwtDecode } from "jwt-decode";

const CompanyStep = ({ formData, setFormData, handleNext }) => {
  const [logoPreview, setLogoPreview] = useState(null);
  const [disabledFields, setDisabledFields] = useState({});

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log(decoded);
        
        setFormData((prev) => ({
          ...prev,
          name: decoded.companyName || "",
          email: decoded.email || "",
          industry: decoded.industry || "",
        }));
        setDisabledFields({
          name: true,
          email: true,
          industry: true,
        });
      } catch (err) {
        console.error("Token decode error:", err);
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, logo: file }));
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const isValid = () => {
    const { website, phone, address } = formData;
    return website && phone && address;
  };
// console.log(formData);

  return (
    <Box>
      <Box textAlign="center" mb={3}>
        <Avatar
          src="https://static.wixstatic.com/media/7d0a46_9dfd0747f3014c78be9dce782dfcf377~mv2.png"
          sx={{ width: 150, height: 80, mx: "auto" }}
        />
        <Typography variant="h5" fontWeight="bold" mt={1}>
          Welcome to HRMS Solutions
        </Typography>
        <Typography variant="subtitle1">Company Registration Step</Typography>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField
            label="Company Name"
            name="name"
            value={formData.name || ""}
            fullWidth
            disabled={disabledFields.name}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Email"
            name="email"
            value={formData.email || ""}
            fullWidth
            disabled={disabledFields.email}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Industry"
            name="industry"
            value={formData.industry || ""}
            fullWidth
            disabled={disabledFields.industry}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Website"
            name="website"
            value={formData.website || ""}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Phone"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            label="Address"
            name="address"
            value={formData.address || ""}
            onChange={handleChange}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            component="label"
            fullWidth
            color="success"
    sx={{ color: "white" }}

          >
            Upload Company Logo
            <input type="file" hidden accept="image/*" onChange={handleLogoUpload} />
          </Button>
        </Grid>

        {logoPreview && (
          <Grid item xs={12}>
            <Box textAlign="center">
              <Typography variant="caption">Logo Preview:</Typography>
              <Avatar
                src={logoPreview}
                alt="Logo Preview"
                sx={{ width: 80, height: 80, mx: "auto", mt: 1 }}
              />
            </Box>
          </Grid>
        )}

        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleNext}
            disabled={!isValid()}
          >
            Continue to Admin Info
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CompanyStep;
