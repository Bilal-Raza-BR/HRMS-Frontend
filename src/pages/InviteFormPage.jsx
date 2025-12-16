// ✅ FINAL UPDATED InviteFormPage.jsx with LocalizationProvider

import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import confetti from "canvas-confetti";
import { toast } from "react-toastify";

import {
  Container,
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import CompanyStep from "../components/CompanyStep";
import AdminStep from "../components/AdminStep";

const steps = ["Company Info", "Admin Info"];

const InviteFormPage = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [companyData, setCompanyData] = useState({
    name: "",
    slug: "",
    email: "",
    industry: "",
    website: "",
    phone: "",
    address: "",
    logo: null,
  });

  const [adminData, setAdminData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    dob: "",
    joiningDate: "",
    salary: "",
    address: "",
    role: "admin",
    profilePic: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setCompanyData((prev) => ({
          ...prev,
          email: decoded.email,
          industry: decoded.industry,
          name: decoded.companyName,
          slug: decoded.companyName.toLowerCase().replace(/\s+/g, "-"),
        }));
        setAdminData((prev) => ({
          ...prev,
          email: decoded.email,
        }));
      } catch (err) {
        toast.error("Invalid or expired invitation link");
      }
    }
  }, []);

  const validateStep = () => {
    const stepErrors = {};
    if (activeStep === 0) {
      if (!companyData.name) stepErrors.name = "Required";
      if (!companyData.phone) stepErrors.phone = "Required";
      if (!companyData.address) stepErrors.address = "Required";
    } else if (activeStep === 1) {
      if (!adminData.name) stepErrors.name = "Required";
      if (!adminData.password) stepErrors.password = "Required";
      if (!adminData.phone) stepErrors.phone = "Required";
      if (!adminData.gender) stepErrors.gender = "Required";
      if (!adminData.dob) stepErrors.dob = "Required";
      // if (!adminData.joiningDate) stepErrors.joiningDate = "Required";
    }
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSubmit = async () => {
  setLoading(true);
  let companySlug = null;

  try {
    // 🏢 Company Registration
    const formData = new FormData();
    Object.entries(companyData).forEach(([key, value]) =>
      formData.append(key, value)
    );
    
    const companyRes = await fetch("http://localhost:5000/api/register/company", {
      method: "POST",
      body: formData,
    });

    const companyResult = await companyRes.json();
    if (!companyRes.ok) {
      throw new Error(companyResult.message || "Company registration failed.");
    }
    companySlug = companyResult.company.slug;

    // 👤 Admin Registration (also use FormData now)
    const adminFormData = new FormData();
    Object.entries(adminData).forEach(([key, value]) =>
      adminFormData.append(key, value)
    );
    adminFormData.append("companySlug", companySlug); // manually append slug

    const adminRes = await fetch("http://localhost:5000/api/register/company-admin", {
      method: "POST",
      body: adminFormData,
    });

    const adminResult = await adminRes.json();
    if (!adminRes.ok) {
      // Agar admin fail ho, to user ko batayein ke company ban gayi hai
      throw new Error(adminResult.message || "Admin registration failed, but company was created.");
    }

    // 🎉 Success
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.6 } });
    toast.success(`🎉 ${adminResult.message || "Company & Admin successfully registered!"}`);

    // Reset form
    setActiveStep(0);
    // Form reset logic can be put here
  } catch (err) {
    let errorMessage = err.message || "Something went wrong!";
    // Specific error message if admin registration fails after company success
    if (companySlug && !errorMessage.includes("Admin registration failed")) {
        errorMessage = `Company registered, but admin creation failed: ${errorMessage}`;
    }
    toast.error(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ py: 5 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            🏢 Company Invitation Form
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box>
            {activeStep === 0 && (
              <CompanyStep
                formData={companyData}
                setFormData={setCompanyData}
                handleNext={handleNext}
                errors={errors}
              />
            )}
            {activeStep === 1 && (
              <AdminStep
                adminData={adminData}
                setAdminData={setAdminData}
                handleBack={handleBack}
                handleSubmit={handleSubmit}
                isSubmitting={loading}
              />
            )}
          </Box>

          <Box mt={4} display="flex" justifyContent="space-between">
            <Button
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
              variant="outlined"
            >
              Back
            </Button>

            {activeStep === steps.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={22} /> : "Submit"}
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={loading}
              >
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
};

export default InviteFormPage;
