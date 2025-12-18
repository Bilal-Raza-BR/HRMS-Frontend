import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Box, CircularProgress } from "@mui/material";
import PendingActionsIcon from "@mui/icons-material/PendingActions";

const PendingRequestSection = () => {
  const [pendingCount, setPendingCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/admin/requests`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("ownerToken")}`,
          },
        });
        const data = await res.json();
        const pending = data.requests.filter(r => !r.isHandled);
        setPendingCount(pending.length);
      } catch (err) {
        console.error("Failed to fetch pending requests:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPending();
  }, []);

  return (
    <Card
      sx={{
        p: 2,
        display: "flex",
        alignItems: "center",
        gap: 2,
        backgroundColor: "#fce4ec",
        border: "1px solid #f8bbd0",
        borderRadius: "16px",
        minHeight: "100px",
      }}
      elevation={3}
    >
      <PendingActionsIcon sx={{ fontSize: 40, color: "#c2185b" }} />
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="subtitle2" color="textSecondary">
          Pending Requests
        </Typography>
        {loading ? (
          <CircularProgress size={20} />
        ) : (
          <Typography variant="h6" fontWeight="bold">
            {pendingCount}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default PendingRequestSection;
