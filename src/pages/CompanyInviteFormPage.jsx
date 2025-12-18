import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Avatar,
  Divider,
  Paper,
  Slide,
  LinearProgress,
  Stack,
  Stepper,
  Step,
  StepLabel,
  MenuItem,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  CloudUpload as CloudUploadIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useNavigate, useSearchParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import dayjs from "dayjs";

const genders = ["Male", "Female", "Other"];
const steps = ["Personal Details", "Account Information", "Confirm & Submit"];

const CompanyInviteFormPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    companyId: "",
    companySlug: "",
    phone: "",
    gender: "",
    dob: null,
    address: "",
    profilePic: null,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!token) {
      toast.error("Invite token missing");
      navigate("/");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      if (!decoded.email || !decoded.role || !decoded.companyId) {
        throw new Error("Missing required token data.");
      }

      setFormData((prev) => ({
        ...prev,
        email: decoded.email,
        role: decoded.role,
        companyId: decoded.companyId,
        companySlug: decoded.companySlug,
        name: decoded.name || "",
      }));
      setLoading(false);
    } catch (err) {
      console.error("Token decode error:", err);
      toast.error("Invalid or expired invite link.");
      navigate("/");
    }
  }, [token, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, profilePic: file });
      setAvatarPreview(URL.createObjectURL(file));
      setErrors((prev) => ({ ...prev, profilePic: "" }));
    }
  };

  const validateStep = (step) => {
    let currentErrors = {};
    let isValid = true;

    if (step === 0) {
      if (!formData.dob) {
        currentErrors.dob = "Date of Birth is required";
        isValid = false;
      }
      if (!formData.gender) {
        currentErrors.gender = "Gender is required";
        isValid = false;
      }
      if (!formData.phone) {
        currentErrors.phone = "Phone Number is required";
        isValid = false;
      }
    } else if (step === 1) {
      if (!formData.password) {
        currentErrors.password = "Password is required";
        isValid = false;
      }
      if (!formData.address) {
        currentErrors.address = "Address is required";
        isValid = false;
      }
    } else if (step === 2) {
      if (!formData.profilePic) {
        currentErrors.profilePic = "Profile picture is required";
        isValid = false;
      }
    }

    setErrors(currentErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    } else {
      toast.error("Please fill all required fields correctly.");
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
    if (!validateStep(activeStep)) {
      toast.error("Please complete all required information.");
      return;
    }

    setSubmitting(true);
    const fd = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        fd.append(key, key === "dob" ? dayjs(value).format("YYYY-MM-DD") : value);
      }
    });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register/company-admin`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Registration successful!");
        navigate(`/company/${formData.companySlug}`);
      } else {
        toast.error(data.message || "Failed to submit. Try again.");
      }
    } catch (err) {
      toast.error("Server error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Stack spacing={2}>
            <TextField
              label="Full Name"
              name="name"
              fullWidth
              value={formData.name}
              onChange={handleChange}
              required
              error={!!errors.name}
              helperText={errors.name}
            />
            <DatePicker
              label="Date of Birth"
              value={formData.dob}
              onChange={(val) => {
                setFormData({ ...formData, dob: val });
                setErrors((prev) => ({ ...prev, dob: "" }));
              }}
              slotProps={{
                textField: {
                  fullWidth: true,
                  error: !!errors.dob,
                  helperText: errors.dob,
                },
              }}
            />
            <TextField
              select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              fullWidth
              error={!!errors.gender}
              helperText={errors.gender}
            >
              {genders.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              error={!!errors.phone}
              helperText={errors.phone}
            />
          </Stack>
        );
      case 1:
        return (
          <Stack spacing={2}>
            <TextField
              label="Email"
              value={formData.email}
              fullWidth
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Role"
              value={formData.role}
              fullWidth
              InputProps={{ readOnly: true }}
            />
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              fullWidth
              error={!!errors.password}
              helperText={errors.password}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              label="Address"
              name="address"
              multiline
              rows={3}
              value={formData.address}
              onChange={handleChange}
              fullWidth
              error={!!errors.address}
              helperText={errors.address}
            />
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={3} alignItems="center">
            <Typography variant="h6">Upload Profile Picture</Typography>
            <Avatar
              src={avatarPreview || "/default-avatar.png"}
              sx={{ width: 100, height: 100 }}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUploadIcon />}
            >
              Upload
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            <Typography color="error">{errors.profilePic}</Typography>
          </Stack>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Paper sx={{ p: 3, textAlign: "center" }}>
          <Typography variant="h6">Loading invite details...</Typography>
          <LinearProgress sx={{ mt: 2 }} />
        </Paper>
      </Container>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="sm" sx={{ mt: 6, mb: 6 }}>
        <Slide direction="down" in mountOnEnter unmountOnExit>
          <Paper elevation={8} sx={{ p: 4, borderRadius: 3 }}>
            <Typography variant="h4" fontWeight={700} textAlign="center" gutterBottom>
              Complete Your Profile
            </Typography>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {getStepContent(activeStep)}

            <Box display="flex" justifyContent="space-between" mt={4}>
              <Button onClick={handleBack} disabled={activeStep === 0}>
                Back
              </Button>
              {activeStep === steps.length - 1 ? (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit"}
                </Button>
              ) : (
                <Button variant="contained" onClick={handleNext}>
                  Next
                </Button>
              )}
            </Box>
          </Paper>
        </Slide>
      </Container>
    </LocalizationProvider>
  );
};

export default CompanyInviteFormPage;
