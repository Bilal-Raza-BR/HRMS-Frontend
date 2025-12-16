import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  TextField,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  Link,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  MailOutline,
  LockOutlined,
  Visibility,
  VisibilityOff,
  Close,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const LoginModal = ({ open, handleClose }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFinish = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/owner/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Login successful!");
        localStorage.setItem("ownerToken", data.token);
        handleClose();
        navigate("/owner/dashboard");
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (err) {
      toast.error("Server error");
    }

    setLoading(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          background: "#fff",
          boxShadow:
            "0 20px 40px rgba(0,0,0,0.08), 0 4px 15px rgba(0,0,0,0.04)",
        },
      }}
    >
      <DialogContent
        component={motion.div}
        initial={{ opacity: 0, scale: 0.95, y: 25 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        sx={{
          p: 4,
          position: "relative",
        }}
      >
        {/* Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 15,
            top: 15,
            background: "#f1f1f1",
            "&:hover": { background: "#e6e6e6" },
          }}
        >
          <Close sx={{ fontSize: 22 }} />
        </IconButton>

        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 3 }}>
          <Typography
            variant="h4"
            fontWeight="700"
            sx={{ color: "rgb(90,102,209)" }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary" mt={1}>
            Login to continue to your dashboard
          </Typography>
        </Box>

        <form onSubmit={onFinish}>
          {/* Email */}
          <TextField
            label="Email Address"
            fullWidth
            required
            value={email}
            margin="normal"
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
              "& label.Mui-focused": {
                color: "rgb(90,102,209)",
              },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "rgb(90,102,209)",
              },
            }}
            InputProps={{
              startAdornment: (
                <MailOutline sx={{ mr: 1, color: "rgb(90,102,209)" }} />
              ),
            }}
          />

          {/* Password */}
          <TextField
            label="Password"
            fullWidth
            required
            margin="normal"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
              },
              "& label.Mui-focused": {
                color: "rgb(90,102,209)",
              },
              "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                borderColor: "rgb(90,102,209)",
              },
            }}
            InputProps={{
              startAdornment: (
                <LockOutlined sx={{ mr: 1, color: "rgb(90,102,209)" }} />
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)}>
                    {showPassword ? (
                      <VisibilityOff sx={{ color: "rgb(90,102,209)" }} />
                    ) : (
                      <Visibility sx={{ color: "rgb(90,102,209)" }} />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ textAlign: "right", mt: 1 }}>
            <Link
              sx={{
                color: "rgb(90,102,209)",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Forgot password?
            </Link>
          </Box>

          {/* LOGIN Button */}
          <LoadingButton
            type="submit"
            variant="contained"
            fullWidth
            loading={loading}
            sx={{
              mt: 3,
              py: 1.4,
              fontSize: "1rem",
              fontWeight: "600",
              borderRadius: "12px",
              background: "rgb(90,102,209)",
              textTransform: "none",
              "&:hover": {
                background: "rgb(75, 85, 190)",
              },
            }}
          >
            Login
          </LoadingButton>
        </form>

        <Typography
          textAlign="center"
          mt={3}
          fontSize="0.8rem"
          color="text.secondary"
        >
          © {new Date().getFullYear()} HRMS — All Rights Reserved.
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
