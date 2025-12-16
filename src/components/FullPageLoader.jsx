// components/common/FullPageLoader.jsx

import React from "react";
import { Box, CircularProgress, Typography } from "@mui/material";

const FullPageLoader = () => {
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        color: "text.primary",
      }}
    >
      <CircularProgress size={60} thickness={5} />
      <Typography
        variant="h6"
        mt={3}
        sx={{
          fontWeight: "bold",
          letterSpacing: 1,
          fontFamily: "'JetBrains Mono', monospace",
          animation: "fadeIn 1.5s ease-in-out infinite",
        }}
      >
        Loading Dashboard...
      </Typography>
    </Box>
  );
};

export default FullPageLoader;
