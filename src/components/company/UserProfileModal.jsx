import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  Typography,
  Box,
  Divider,
} from "@mui/material";

const UserProfileModal = ({ open, onClose, user }) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>My Profile</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={1} mt={1}>
          <Avatar
            src={user?.profilePic}
            alt={user?.name}
            sx={{ width: 80, height: 80 }}
          />
          <Typography variant="h6">{user?.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.email}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Role: {user?.role?.toUpperCase()}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        {/* You can add more user info below */}
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
