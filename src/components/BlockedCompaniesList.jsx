import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Stack,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material';
import { alpha } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import BusinessIcon from "@mui/icons-material/Business";
import { toast } from 'react-toastify';

const BlockedCompaniesList = ({refresh}) => {
  const [blockedCompanies, setBlockedCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // Fetch only blocked companies
  const fetchBlockedCompanies = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('ownerToken')}`,
        },
      });

      const data = await res.json();
      const blocked = data?.companies?.filter((c) => !c.isActive) || [];
      setBlockedCompanies(blocked);

    } catch (err) {
      console.error('Error fetching blocked companies:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlockedCompanies();
  }, [refresh]);

  const handleUnblock = async (slug) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/owner/company/${slug}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('ownerToken')}`,
          },
          body: JSON.stringify({ isActive: true }),
        }
      );

      if (res.ok) {
        toast.success('Company unblocked successfully!');
        setBlockedCompanies((prev) => prev.filter((c) => c.slug !== slug));
        refresh()
      } else {
        toast.error('Failed to unblock company');
      }
    } catch (err) {
      console.error('Error unblocking:', err);
      toast.error('Something went wrong');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  const renderDesktopTable = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: alpha(theme.palette.primary.light, 0.1) }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Company Name</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Industry</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {blockedCompanies.map((company) => (
            <TableRow key={company._id} hover>
              <TableCell>{company.name}</TableCell>
              <TableCell>{company.email}</TableCell>
              <TableCell>{company.industry || 'N/A'}</TableCell>
              <TableCell align="center">
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  onClick={() => handleUnblock(company.slug)}
                >
                  Unblock
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderMobileCards = () => (
    <Stack spacing={2}>
      {blockedCompanies.map((company) => (
        <Card key={company._id} sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600}>{company.name}</Typography>
            <Stack spacing={1} color="text.secondary" mt={1}>
              <Stack direction="row" alignItems="center" spacing={1}><EmailIcon fontSize="small" /><Typography variant="body2">{company.email}</Typography></Stack>
              <Stack direction="row" alignItems="center" spacing={1}><BusinessIcon fontSize="small" /><Typography variant="body2">{company.industry || 'N/A'}</Typography></Stack>
            </Stack>
          </CardContent>
          <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => handleUnblock(company.slug)}
            >
              Unblock
            </Button>
          </CardActions>
        </Card>
      ))}
    </Stack>
  );

  return (
    <Paper elevation={0} sx={{ p: { xs: 1, sm: 2 } }}>
      <Typography variant="h5" component="h2" fontWeight={600} sx={{ mb: 2, typography: { xs: 'h6', sm: 'h5' } }}>
        Blocked Companies
      </Typography>

      {blockedCompanies.length > 0 ? (
        isMobile ? renderMobileCards() : renderDesktopTable()
      ) : (
        <Paper sx={{ textAlign: 'center', p: { xs: 3, sm: 5 }, borderRadius: 3, mt: 2 }}>
          <Typography variant="h6" color="text.secondary">
            No blocked companies found.
          </Typography>
        </Paper>
      )}
    </Paper>
  );
};

export default BlockedCompaniesList;
