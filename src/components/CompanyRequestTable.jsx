import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress,
  useTheme,
  useMediaQuery,
  Stack,
  Card,
  CardContent,
  Divider,
  CardActions,
  IconButton,
} from "@mui/material";
import { toast } from "react-toastify";
import { MdDone, MdError, MdInfo } from "react-icons/md";
import "react-toastify/dist/ReactToastify.css";
import { alpha } from "@mui/material/styles";
import BusinessIcon from "@mui/icons-material/Business";
import EmailIcon from "@mui/icons-material/Email";
import DeleteIcon from "@mui/icons-material/Delete";

const CompanyRequestTable = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const fetchRequests = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/admin/requests", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("ownerToken")}`
        },
      });
      const data = await res.json();
      
      if (res.ok) {
        setRequests(data.requests || []);
      } else {
        toast.error(
          <span>
            <MdError style={{ verticalAlign: "middle" }} /> {data.message}
          </span>
        );
      }
    } catch (error) {
      toast.error(
        <span>
          <MdError style={{ verticalAlign: "middle" }} /> Failed to fetch requests
        </span>
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleDecision = async (id, status, requestData) => {
    try {
      const patchRes = await fetch(
        `http://localhost:5000/api/admin/request/${id}/handled`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("ownerToken")}`,
          },
          body: JSON.stringify({ status }),
        }
      );

      const patchData = await patchRes.json();

      if (patchRes.ok) {
        setRequests((prev) =>
          prev.map((r) =>
            r._id === id ? { ...r, isHandled: true, handledStatus: status } : r
          )
        );

        if (status === "approved") {
          const inviteRes = await fetch(
            "http://localhost:5000/api/admin/invite-company",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("ownerToken")}`,
              },
              body: JSON.stringify({
                email: requestData.companyEmail,
                companyName: requestData.companyName,
                industry: requestData.industry,
              }),
            }
          );

          const inviteData = await inviteRes.json();

          if (inviteRes.ok) {
            toast.success(
              <span>
                <MdDone style={{ verticalAlign: "middle" }} /> Invite sent successfully
              </span>
            );
          } else {
            toast.error(
              <span>
                <MdError style={{ verticalAlign: "middle" }} />{" "}
                {inviteData.message || "Failed to send invite"}
              </span>
            );
          }
        }

        toast.success(
          <span>
            <MdDone style={{ verticalAlign: "middle" }} /> Request{" "}
            {status === "approved" ? "approved" : "rejected"}
          </span>
        );
      } else {
        toast.error(
          <span>
            <MdError style={{ verticalAlign: "middle" }} />{" "}
            {patchData.message || "Failed to update request"}
          </span>
        );
      }
    } catch (error) {
      toast.error(
        <span>
          <MdError style={{ verticalAlign: "middle" }} /> Something went wrong
        </span>
      );
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

  const handleDeleteRequest = async (id) => {
    const confirmDelete = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/request/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ownerToken")}`,
          },
        });

        if (res.ok) {
          toast.success("Request deleted successfully.");
          setRequests((prev) => prev.filter((r) => r._id !== id));
        } else {
          const data = await res.json();
          toast.error(data.message || "Failed to delete request.");
        }
      } catch (error) {
        toast.error("Something went wrong while deleting.");
      }
    };

    toast(<ConfirmationToast onConfirm={confirmDelete} message="Are you sure you want to delete this request?" />, { autoClose: false, closeButton: false });
  };

  const handleDeleteAllRequests = async () => {
    const confirmDeleteAll = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/admin/requests/delete-all`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ownerToken")}`,
          },
        });

        if (res.ok) {
          toast.success("All requests have been deleted.");
          setRequests([]);
        } else {
          const data = await res.json();
          toast.error(data.message || "Failed to delete all requests.");
        }
      } catch (error) {
        toast.error("Something went wrong while deleting all requests.");
      }
    };

    toast(<ConfirmationToast onConfirm={confirmDeleteAll} message="Are you sure you want to delete ALL requests? This action cannot be undone." />, { autoClose: false, closeButton: false });
  };

  const renderStatusChip = (request) => {
    if (!request.isHandled) {
      return <Chip label="Pending" color="warning" size="small" />;
    }
    if (request.handledStatus === "approved") {
      return <Chip label="Approved" color="success" size="small" />;
    }
    if (request.handledStatus === "rejected") {
      return <Chip label="Rejected" color="error" size="small" />;
    }
    return <Chip label="Handled" color="default" size="small" />;
  };

  const renderActionButtons = (request) => {
    if (request.isHandled) return <IconButton size="small" onClick={() => handleDeleteRequest(request._id)}><DeleteIcon fontSize="small" color="action" /></IconButton>;
    return (
      <Box display="flex" justifyContent={{ xs: 'flex-end', md: 'center' }} gap={1}>
        <Button
          variant="contained"
          size="small"
          color="success"
          onClick={() => handleDecision(request._id, "approved", request)}
        >
          Approve
        </Button>
        <Button
          variant="outlined"
          size="small"
          color="error"
          onClick={() => handleDecision(request._id, "rejected", request)}
        >
          Reject
        </Button>
      </Box>
    );
  };

  const renderDesktopTable = () => (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: alpha(theme.palette.primary.light, 0.1) }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Company</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Industry</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Message</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {requests.map((r) => (
            <TableRow key={r._id} hover>
              <TableCell>{r.companyName}</TableCell>
              <TableCell>{r.companyEmail}</TableCell>
              <TableCell>{r.industry}</TableCell>
              <TableCell sx={{ maxWidth: 200, whiteSpace: 'normal' }}>{r.message}</TableCell>
              <TableCell>{renderStatusChip(r)}</TableCell>
              <TableCell align="center">{renderActionButtons(r)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderMobileCards = () => (
    <Stack spacing={2}>
      {requests.map((r) => (
        <Card key={r._id} sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h6" fontWeight={600}>{r.companyName}</Typography>
                <Typography color="text.secondary" variant="body2">{r.industry}</Typography>
              </Box>
              {renderStatusChip(r)}
            </Stack>
            <Divider sx={{ my: 1.5 }} />
            <Stack spacing={1.5}>
              <Stack direction="row" alignItems="center" spacing={1} color="text.secondary">
                <EmailIcon fontSize="small" />
                <Typography variant="body2">{r.companyEmail}</Typography>
              </Stack>
              {r.message && (
                <Paper variant="outlined" sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}>
                  <Typography variant="body2" color="text.secondary">{r.message}</Typography>
                </Paper>
              )}
            </Stack>
          </CardContent>
          {!r.isHandled && (
            <CardActions sx={{ justifyContent: 'flex-end', px: 2, pb: 2 }}>
              {renderActionButtons(r)}
            </CardActions>
          )}
        </Card>
      ))}
    </Stack>
  );

  return (
    <Paper elevation={0} sx={{ p: { xs: 1, sm: 2 } }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" component="h2" fontWeight={600} sx={{ typography: { xs: 'h6', sm: 'h5' } }}>
          Company Service Requests
        </Typography>
        {requests.length > 0 && (
          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteAllRequests}
          >
            Delete All
          </Button>
        )}
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : requests.length > 0 ? (
        isMobile ? renderMobileCards() : renderDesktopTable()
      ) : (
        <Paper sx={{ textAlign: 'center', p: { xs: 3, sm: 5 }, borderRadius: 3, mt: 2 }}>
          <Typography variant="h6" color="text.secondary">
            <MdInfo style={{ verticalAlign: "middle", marginRight: '8px' }} />
            No new company requests found.
          </Typography>
        </Paper>
      )}
    </Paper>
  );
};

export default CompanyRequestTable;
