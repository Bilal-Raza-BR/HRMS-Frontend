import React, { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Tooltip,
  Chip,
  Typography,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fade,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
  Divider,
  CardActions,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Cancel";
import WorkIcon from "@mui/icons-material/Work";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import { toast } from "react-toastify";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import DeleteIcon from "@mui/icons-material/Delete";
import ResumePreviewModal from "./ResumePreviewModal";
import { alpha } from "@mui/material/styles";

const ApplicationTable = ({ applications, companySlug, refreshData, currentUser }) => {
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [selectedResume, setSelectedResume] = useState(null);
  const [selectedApplicant, setSelectedApplicant] = useState("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [selectedHireRole, setSelectedHireRole] = useState("employee");
  const [hireTarget, setHireTarget] = useState(null); // {email, position, name}

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: null, id: null });

  const isAdminOrHR = ["admin", "hr"].includes(currentUser.role);
  const isAdmin = currentUser.role === "admin";

  const handleStatusUpdate = async (email, position, status, roleToAssign, name = "") => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/${companySlug}/applications/status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, position, status, roleToAssign, name }),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        refreshData();
      } else {
        toast.error(data.message || "Failed to update status.");
      }
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Server error occurred");
    }
  };

  const handleViewResume = (url, name) => {
    setSelectedResume(url);
    setSelectedApplicant(name);
    setResumeModalOpen(true);
  };

  const handleOpenHireModal = (email, position, name) => {
    setHireTarget({ email, position, name });
    setSelectedHireRole("employee");
    setHireModalOpen(true);
  };

  const handleConfirmHire = () => {
    if (!hireTarget) return;
    handleStatusUpdate(hireTarget.email, hireTarget.position, "hired", selectedHireRole, hireTarget.name);
    setHireModalOpen(false);
  };

  const handleDelete = (applicationId) => {
    setDeleteTarget({ type: "single", id: applicationId });
    setDeleteModalOpen(true);
  };

  const handleDeleteAll = () => {
    setDeleteTarget({ type: "all" });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      let res;

      if (deleteTarget.type === "all") {
        res = await fetch(`${import.meta.env.VITE_API_URL}/api/${companySlug}/applications/delete-all`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        res = await fetch(`${import.meta.env.VITE_API_URL}/api/${companySlug}/applications/delete`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ applicationId: deleteTarget.id }),
        });
      }

      const data = await res.json();
      if (res.ok) {
        toast.success(data.message);
        refreshData();
      } else {
        toast.error(data.message || "Failed to delete.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Server error occurred");
    } finally {
      setDeleteModalOpen(false);
      setDeleteTarget({ type: null, id: null });
    }
  };

  const renderDesktopTable = () => (
    <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 2 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: alpha(theme.palette.primary.light, 0.1) }}>
            <TableCell sx={{ fontWeight: 'bold' }}>Applicant</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Phone</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Position</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Resume</TableCell>
            <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
            {isAdminOrHR && <TableCell align="center" sx={{ fontWeight: 'bold' }}>Actions</TableCell>}
          </TableRow>
        </TableHead>

        <TableBody>
          {applications.map((app, idx) => (
            <TableRow key={app._id || idx} hover>
              <TableCell>{app.name || "N/A"}</TableCell>
              <TableCell>{app.email}</TableCell>
              <TableCell>{app.phone || "-"}</TableCell>
              <TableCell>{app.position}</TableCell>
              <TableCell>
                {app.resume ? (
                  <Button size="small" onClick={() => handleViewResume(app.resume, app.name)}>
                    View
                  </Button>
                ) : "-"}
              </TableCell>
              <TableCell>
                <Chip
                  label={app.status.toUpperCase()}
                  color={
                    app.status === "accepted" ? "success" :
                    app.status === "rejected" ? "error" :
                    app.status === "hired" ? "info" : "default"
                  }
                  variant="outlined"
                  size="small"
                />
              </TableCell>
              {isAdminOrHR && (
                <TableCell align="center">
                  <Tooltip title="Accept">
                    <IconButton color="success" onClick={() => handleStatusUpdate(app.email, app.position, "accepted")} disabled={app.status !== "pending"}>
                      <CheckIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Reject">
                    <IconButton color="error" onClick={() => handleStatusUpdate(app.email, app.position, "rejected")} disabled={app.status !== "pending"}>
                      <CloseIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Hire">
                    <IconButton color="primary" onClick={() => handleOpenHireModal(app.email, app.position, app.name)} disabled={app.status !== "accepted"}>
                      <WorkIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Application">
                    <IconButton onClick={() => handleDelete(app._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

  const renderMobileCards = () => (
    <Stack spacing={2}>
      {applications.map((app) => (
        <Card key={app._id} sx={{ borderRadius: 3, boxShadow: 2 }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography variant="h6" fontWeight={600}>{app.name}</Typography>
                <Typography color="text.secondary" variant="body2">{app.position}</Typography>
              </Box>
              <Chip label={app.status.toUpperCase()} color={app.status === "accepted" ? "success" : app.status === "rejected" ? "error" : app.status === "hired" ? "info" : "default"} size="small" />
            </Stack>
            <Divider sx={{ my: 1.5 }} />
            <Stack spacing={1} color="text.secondary">
              <Stack direction="row" alignItems="center" spacing={1}><EmailIcon fontSize="small" /><Typography variant="body2">{app.email}</Typography></Stack>
              <Stack direction="row" alignItems="center" spacing={1}><PhoneIcon fontSize="small" /><Typography variant="body2">{app.phone || 'N/A'}</Typography></Stack>
            </Stack>
          </CardContent>
          <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
            {app.resume ? <Button size="small" onClick={() => handleViewResume(app.resume, app.name)}>View Resume</Button> : <Box />}
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Accept"><IconButton size="small" color="success" onClick={() => handleStatusUpdate(app.email, app.position, "accepted")} disabled={app.status !== "pending"}><CheckIcon /></IconButton></Tooltip>
              <Tooltip title="Reject"><IconButton size="small" color="error" onClick={() => handleStatusUpdate(app.email, app.position, "rejected")} disabled={app.status !== "pending"}><CloseIcon /></IconButton></Tooltip>
              <Tooltip title="Hire"><IconButton size="small" color="primary" onClick={() => handleOpenHireModal(app.email, app.position, app.name)} disabled={app.status !== "accepted"}><WorkIcon /></IconButton></Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={() => handleDelete(app._id)}><DeleteIcon /></IconButton>
              </Tooltip>
            </Box>
          </CardActions>
        </Card>
      ))}
    </Stack>
  );

  return (
    <Box mt={4}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} mb={2} spacing={2}>
        <Typography variant="h5" component="h2" fontWeight={600} sx={{ typography: { xs: 'h6', sm: 'h5' } }}>
          📝 Applications Received
        </Typography>
        {isAdminOrHR && applications.length > 0 && (
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={handleDeleteAll}
          >
            Delete All
          </Button>
        )}
      </Stack>

      {applications.length > 0 ? (
        isMobile ? renderMobileCards() : renderDesktopTable()
      ) : (
        <Paper sx={{ textAlign: 'center', p: { xs: 3, sm: 5 }, borderRadius: 3, mt: 2 }}>
          <Typography variant="h6" color="text.secondary">
            No applications received yet.
          </Typography>
        </Paper>
      )}

      <ResumePreviewModal
        open={resumeModalOpen}
        onClose={() => setResumeModalOpen(false)}
        resumeUrl={selectedResume}
        applicantName={selectedApplicant}
      />

      <Dialog
        open={hireModalOpen}
        onClose={() => setHireModalOpen(false)}
        TransitionComponent={Fade}
        keepMounted
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            px: 3,
            py: 2,
            bgcolor: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(12px)",
            boxShadow: 24,
            transition: "all 0.4s ease-in-out",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            fontSize: "1.5rem",
            mb: 1,
          }}
        >
          Hire {" "}
          <Typography component="span" color="primary" fontWeight="bold" display="inline">
            {hireTarget?.name || "Candidate"}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography textAlign="center" mb={3} color="text.secondary">
            Choose the role you want to assign:
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            {[{
              role: "employee",
              label: "Employee",
              desc: "Standard access role",
              icon: <PersonIcon />,
            }, {
              role: "hr",
              label: "HR",
              desc: "Manage hiring & people",
              icon: <GroupIcon />,
            }].map(({ role, label, desc, icon }) => (
              <Grid item xs={12} sm={6} key={role}>
                <Card
                  onClick={() => setSelectedHireRole(role)}
                  sx={{
                    p: 2,
                    borderRadius: 3,
                    cursor: "pointer",
                    textAlign: "center",
                    boxShadow: selectedHireRole === role ? 4 : "0 0 0 1px rgba(0,0,0,0.08)",
                    border: selectedHireRole === role ? "2px solid #1976d2" : "none",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: 6,
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      mx: "auto",
                      mb: 1,
                      borderRadius: "50%",
                      bgcolor: "primary.light",
                      color: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 28,
                    }}
                  >
                    {icon}
                  </Box>
                  <Typography fontWeight={600}>{label}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {desc}
                  </Typography>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "space-between", mt: 2 }}>
          <Button onClick={() => setHireModalOpen(false)} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmHire} variant="contained" disabled={!selectedHireRole}>
            Confirm Hire
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            {deleteTarget.type === "all"
              ? "Are you sure you want to delete ALL applications? This action cannot be undone."
              : "Are you sure you want to delete this application?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} color="inherit">Cancel</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApplicationTable;
