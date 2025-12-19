import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  List,
  Avatar,
  Typography,
  CircularProgress,
  Paper,
  InputAdornment,
  Container,
  Grid,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { Link } from "react-router-dom";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import { motion } from "framer-motion";

const SearchCompanyPage = () => {
  const [allCompanies, setAllCompanies] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/company/get`, {
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setAllCompanies(data.companies || []);
      setFiltered(data.companies || []);
    } catch (err) {
      console.error("Failed to load companies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    const keyword = search.toLowerCase();
    const results = allCompanies.filter(
      (company) =>
        company.name.toLowerCase().includes(keyword) ||
        company.email.toLowerCase().includes(keyword) ||
        company.industry.toLowerCase().includes(keyword)
    );
    setFiltered(results);
  }, [search, allCompanies]);

  return (
    <Box sx={{
      background: 'linear-gradient(170deg, #f3f5f9 0%, #e0eafc 100%)',
      minHeight: "100vh",
      py: { xs: 3, sm: 5 }
    }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight={700}
            sx={{
              color: "primary.dark",
              typography: { xs: 'h4', sm: 'h3' }
            }}
          >
            Find Your Next Opportunity
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
            Explore top companies and discover your perfect fit.
          </Typography>
        </Box>

        {/* Search Bar */}
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by company name, industry, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{
              mb: 4,
              "& .MuiOutlinedInput-root": {
                borderRadius: 3,
                backgroundColor: 'background.paper',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                "& fieldset": {
                  border: "none",
                },
                '&:hover fieldset': {
                  borderColor: 'primary.light',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />

        {/* Results */}
        {loading ? (
          <Box display="flex" justifyContent="center" mt={8}>
            <CircularProgress size={50} />
          </Box>
        ) : filtered.length > 0 ? (
          <Stack spacing={2.5}>
            {filtered.map((company) => (
              <motion.div
                key={company._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Paper
                  component={Link}
                  to={`/company/${company.slug}`}
                  elevation={0}
                  sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 4,
                    textDecoration: 'none',
                    color: 'inherit',
                    display: 'block',
                    border: '1px solid rgba(0,0,0,0.08)',
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                      borderColor: 'primary.main',
                    }
                  }}
                >
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs="auto">
                      <Avatar
                        src={company.logoUrl || "https://via.placeholder.com/150"}
                        alt={company.name}
                        sx={{ width: 64, height: 64, borderRadius: 3 }}
                      />
                    </Grid>
                    <Grid item xs>
                      <Typography variant="h6" fontWeight={600} color="primary.main">
                        {company.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {company.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm="auto">
                      <Stack spacing={1} alignItems={{ xs: 'flex-start', sm: 'flex-end' }}>
                        <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                          <BusinessCenterIcon fontSize="small" />
                          <Typography variant="body2">{company.industry}</Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                          <LocationCityIcon fontSize="small" />
                          <Typography variant="body2">{company.address || "Location not specified"}</Typography>
                        </Stack>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
              </motion.div>
            ))}
          </Stack>
        ) : (
          <Box textAlign="center" p={5}>
            <SearchOffIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No Companies Found
            </Typography>
            <Typography color="text.secondary">
              Try adjusting your search terms to find what you're looking for.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default SearchCompanyPage;
