import React, { useEffect, useState } from 'react';
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Typography,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Stack,
  Card,
  CardContent,
  Divider,
  CardActions,
  Chip,
  Box,
  IconButton,
} from '@mui/material';
import { alpha } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import DeleteIcon from "@mui/icons-material/Delete";
import { toast } from 'react-toastify';

const CompanyListTable = ({ refresh }) => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingSlug, setUpdatingSlug] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ownerToken")}`,
        },
      });
      const data = await res.json();
      console.log(data);
      
      setCompanies(data.companies || []);
      // console.log(companies);
      
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const toggleCompanyStatus = async (slug, currentStatus) => {
    setUpdatingSlug(slug);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/owner/company/${slug}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("ownerToken")}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (res.ok) {
        setCompanies((prev) =>
          prev.map((c) =>
            c.slug === slug ? { ...c, isActive: !currentStatus } : c
          )
        );
        // console.log(refresh);
        refresh()
        
      }
      // if(refresh){setRefresh(true)}else{setRefresh(false)}
    } catch (error) {
      console.error("Error toggling status:", error);
    } finally {
      setUpdatingSlug("");
    }
  };

  const ConfirmationToast = ({ onConfirm, closeToast, message }) => (
    <Box>
      <Typography sx={{ mb: 2 }}>{message}</Typography>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button variant="outlined" size="small" onClick={closeToast}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => {
            onConfirm();
            closeToast();
          }}
        >
          Confirm
        </Button>
      </Stack>
    </Box>
  );

  const handleDeleteCompany = async (slug) => {
    const confirmDelete = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/owner/company/${slug}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ownerToken")}`,
          },
        });

        if (res.ok) {
          toast.success("Company deleted successfully.");
          setCompanies((prev) => prev.filter((c) => c.slug !== slug));
          refresh();
        } else {
          const data = await res.json();
          toast.error(data.message || "Failed to delete company.");
        }
      } catch (error) {
        toast.error("Something went wrong while deleting the company.");
      }
    };

    toast(<ConfirmationToast onConfirm={confirmDelete} message="Are you sure you want to permanently delete this company?" />, { autoClose: false, closeButton: false });
  };

  if (loading) return <CircularProgress />;

  const renderDesktopTable = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: alpha(theme.palette.primary.light, 0.1) }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Industry</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company._id} hover>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.email}</TableCell>
              <TableCell>{company.industry || "—"}</TableCell>
              <TableCell>
                <Chip
                  label={company.isActive ? "Active" : "Blocked"}
                  color={company.isActive ? "success" : "error"}
                  size="small"
                  variant="outlined"
                />
              </TableCell>
              <TableCell align="center">
                <Stack direction="row" spacing={1} justifyContent="center">
                  <Button
                    variant="contained"
                    color={company.isActive ? "error" : "success"}
                    size="small"
                    onClick={() => toggleCompanyStatus(company.slug, company.isActive)}
                    disabled={updatingSlug === company.slug}
                    sx={{ minWidth: 90 }}
                  >
                    {updatingSlug === company.slug ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : company.isActive ? "Block" : "Unblock"}
                  </Button>
                  <IconButton
                    color="warning"
                    size="small"
                    onClick={() => handleDeleteCompany(company.slug)}>
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderMobileCards = () => (
    <Stack spacing={2}>
      {companies.map((company) => (
        <Card key={company._id} sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h6" fontWeight={600}>{company.name}</Typography>
                <Typography color="text.secondary" variant="body2">{company.industry || 'N/A'}</Typography>
              </Box>
              <Chip label={company.isActive ? "Active" : "Blocked"} color={company.isActive ? "success" : "error"} size="small" />
            </Stack>
            <Divider sx={{ my: 1.5 }} />
            <Stack spacing={1} color="text.secondary">
              <Stack direction="row" alignItems="center" spacing={1}><EmailIcon fontSize="small" /><Typography variant="body2">{company.email}</Typography></Stack>
              <Stack direction="row" alignItems="center" spacing={1}><BusinessIcon fontSize="small" /><Typography variant="body2">Slug: {company.slug}</Typography></Stack>
            </Stack>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
            <Stack direction="row" spacing={1} alignItems="center">
              <IconButton
                color="warning"
                size="small"
                onClick={() => handleDeleteCompany(company.slug)}>
                <DeleteIcon />
              </IconButton>
              <Button
                variant="contained"
                color={company.isActive ? "error" : "success"}
                size="small"
                onClick={() => toggleCompanyStatus(company.slug, company.isActive)}
                disabled={updatingSlug === company.slug}
                sx={{ minWidth: 90 }}
              >
                {updatingSlug === company.slug ? (
                  <CircularProgress size={18} color="inherit" />
                ) : company.isActive ? "Block" : "Unblock"}
              </Button>
            </Stack>
          </CardActions>
        </Card>
      ))}
    </Stack>
  );

  return (
    <Paper elevation={0} sx={{ p: { xs: 1, sm: 2 } }}>
      <Typography variant="h5" component="h2" fontWeight={600} sx={{ mb: 2, typography: { xs: 'h6', sm: 'h5' } }}>
        All Companies
      </Typography>

      {companies.length > 0 ? (
        isMobile ? renderMobileCards() : renderDesktopTable()
      ) : (
        <Paper sx={{ textAlign: 'center', p: { xs: 3, sm: 5 }, borderRadius: 3, mt: 2 }}>
          <Typography variant="h6" color="text.secondary">
            No companies found.
          </Typography>
        </Paper>
      )}
    </Paper>
  );
};

export default CompanyListTable;
