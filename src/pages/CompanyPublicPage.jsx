import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Container,
  Grid,
  Paper,
  Button,
  Avatar,
  TextField,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import BusinessIcon from "@mui/icons-material/Business";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import JobApplicationModal from "../components/JobApplicationModal";
import FullPageLoader from "../components/FullPageLoader";
import Footer from "../components/Footer";

const CompanyPublicPage = ({ refresh }) => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [jobModalOpen, setJobModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fetchCompany = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/public/${slug}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Company not found");
      setCompany(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompany();
  }, [slug]);

  const handleLogin = async () => {
    if (!email || !password) return toast.error("Please fill all fields");

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login/${slug}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      refresh();

      toast.success("Login successful!");
      setTimeout(() => navigate(`/company/${slug}`), 1000);
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleApplyClick = () => {
    setSelectedJob({ title: "General Job Application" });
    setJobModalOpen(true);
  };

  if (loading) return <FullPageLoader />;

  if (!company) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom right, #e0f2fe, #f8fafc)",
        }}
      >
        <Container sx={{ py: 8, textAlign: "center" }}>
          <Typography variant="h4" color="error">
            Company Not Found
          </Typography>

          <Typography sx={{ mt: 2 }}>
            The company you are looking for does not exist or is no longer active.
          </Typography>

          <Button
            variant="contained"
            sx={{ mt: 4, px: 4, py: 1.5, borderRadius: "12px" }}
            onClick={() => navigate("/")}
          >
            Go to Homepage
          </Button>
        </Container>

        <Footer />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        background: "linear-gradient(to bottom right, #e0f7ff, #ffffff)",
        minHeight: "100vh",
      }}
    >
      {/* HEADER */}
      <Box
        sx={{
          width: "100%",
          py: 6,
          px: 2,
          background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)",
          color: "white",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          boxShadow: "0px 6px 20px rgba(0,0,0,0.15)",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                src={company.logoUrl}
                alt={company.name}
                sx={{
                  width: 110,
                  height: 110,
                  border: "4px solid rgba(255,255,255,0.8)",
                  boxShadow: "0px 4px 20px rgba(0,0,0,0.3)",
                }}
              />
            </Grid>

            <Grid item xs>
              <Typography
                variant="h3"
                fontWeight="700"
                sx={{ textShadow: "0px 3px 8px rgba(0,0,0,0.2)" }}
              >
                {company.name}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
                <Chip
                  icon={<BusinessIcon />}
                  label={company.industry}
                  sx={{
                    background: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
                <Chip
                  icon={<LocationOnIcon />}
                  label={company.address}
                  sx={{
                    background: "rgba(255,255,255,0.2)",
                    color: "white",
                    fontWeight: 600,
                  }}
                />
              </Box>
            </Grid>
          </Grid>

          {/* Apply Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button
              variant="contained"
              sx={{
                px: 5,
                py: 1.6,
                borderRadius: "30px",
                fontSize: "1rem",
                fontWeight: "bold",
                background: "linear-gradient(135deg, #22c55e, #16a34a)",
                boxShadow: "0px 6px 18px rgba(22,163,74,0.5)",
                "&:hover": {
                  background: "linear-gradient(135deg, #16a34a, #15803d)",
                },
              }}
              onClick={handleApplyClick}
            >
              Apply for a Job
            </Button>
          </Box>
        </Container>
      </Box>

      {/* CONTENT */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 4 }}>
        <Grid container spacing={4}>
          {/* About */}
          <Grid item xs={12} md={8}>
            <Paper
              elevation={4}
              sx={{
                p: 4,
                borderRadius: 4,
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(10px)",
                boxShadow: "0px 6px 20px rgba(0,0,0,0.08)",
              }}
            >
              <Typography variant="h5" fontWeight="700" sx={{ mb: 2 }}>
                About {company.name}
              </Typography>

              <Typography
                variant="body1"
                sx={{ color: "#334155", lineHeight: 1.8, fontSize: "1.1rem" }}
              >
                {company.description || "No description provided."}
              </Typography>
            </Paper>
          </Grid>

          {/* Login */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={4}
              sx={{
                borderRadius: 4,
                overflow: "hidden",
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(10px)",
              }}
            >
              <Accordion defaultExpanded>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight="700"> Login</Typography>
                </AccordionSummary>

                <AccordionDetails>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    variant="outlined"
                    sx={{ mb: 2 }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />

                  <TextField
                    fullWidth
                    label="Password"
                    type="password"
                    sx={{ mb: 2 }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />

                  <Button fullWidth variant="contained" onClick={handleLogin}>
                    Login
                  </Button>
                </AccordionDetails>
              </Accordion>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Footer />

      {selectedJob && (
        <JobApplicationModal
          open={jobModalOpen}
          handleClose={() => setJobModalOpen(false)}
          slug={slug}
          jobTitle={selectedJob.title}
        />
      )}
    </Box>
  );
};

export default CompanyPublicPage;
