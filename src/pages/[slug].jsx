import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  Avatar,
  Button,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import ApplyModal from "../components/ApplyModal"; // modal create karna padega

const CompanyPage = () => {
  const { slug } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyOpen, setApplyOpen] = useState(false);

  const fetchCompanyData = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/company/${slug}`
      );
      const data = await res.json();
      setCompany(data);
    } catch (err) {
      console.error("Error fetching company", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyData();
  }, [slug]);

  if (loading) {
    return (
      <Box minHeight="60vh" display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!company) {
    return (
      <Box p={5} textAlign="center">
        <Typography variant="h5" color="error">Company not found</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={6} sx={{ p: 4, borderRadius: 4, textAlign: "center" }}>
        <Avatar
          src={company.logoUrl}
          alt={company.name}
          sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
        />
        <Typography variant="h5" fontWeight="bold">
          {company.name}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Industry: {company.industry}
        </Typography>

        <Box mt={3} display="flex" justifyContent="center" gap={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setApplyOpen(true)}
          >
            Apply for Job
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              // Navigate to login page for this company
              window.location.href = `/${slug}/login`;
            }}
          >
            Company Login
          </Button>
        </Box>
      </Paper>

      {/* Apply Modal */}
      <ApplyModal open={applyOpen} handleClose={() => setApplyOpen(false)} slug={slug} />
    </Container>
  );
};

export default CompanyPage;
