import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const ResumePreviewModal = ({ open, onClose, resumeUrl, applicantName }) => {
  const isPDF = resumeUrl?.toLowerCase().endsWith(".pdf");

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ m: 0, p: 2 }}>
        Resume Preview – {applicantName}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {resumeUrl ? (
          isPDF ? (
            <Box
              component="iframe"
              src={`https://docs.google.com/gview?url=${encodeURIComponent(resumeUrl)}&embedded=true`}
              width="100%"
              height="600px"
              title="Resume PDF"
              sx={{ border: "none", borderRadius: 2 }}
            />
          ) : (
            <Typography color="text.secondary">
              File not previewable.{" "}
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                Click here to download
              </a>
            </Typography>
          )
        ) : (
          <Typography color="text.secondary">No resume uploaded</Typography>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ResumePreviewModal;
