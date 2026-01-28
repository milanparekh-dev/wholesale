export async function getServerSideProps() {
  return {
    redirect: { destination: "/products", permanent: false },
  };
}

export default function AdminLoginRemoved() {
  return null;
}

/* REMOVED: legacy admin login page (auth/session disabled)
"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
  useTheme,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import adminApi from "/src/utility/adminApi";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter email and password");
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      formData.append("role", "admin");

      const response = await adminApi.post("/api/login", formData);

      if (response?.status === "success") {
        localStorage.setItem("api_token", response?.data?.api_token);
        router.push("/admin");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      backgroundColor: theme.palette.background.subtle,
      color: theme.palette.text.primary,
      "& fieldset": {
        border: `1px solid ${theme.palette.divider}`,
      },
      "&:hover fieldset": {
        border: `1px solid ${theme.palette.primary.main}`,
      },
      "&.Mui-focused fieldset": {
        border: `1px solid ${theme.palette.primary.main}`,
      },
    },
    "& .MuiInputLabel-root": {
      color: theme.palette.text.secondary,
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: theme.palette.primary.main,
    },
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
      }}
    >
      <Paper
        sx={{
          width: { xs: "100%", md: 960 },
          minHeight: 520,
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: 3,
          overflow: "hidden",
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 28px 60px rgba(4,6,8,0.55)",
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {/* LEFT IMAGE */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
            color: theme.palette.common.white,
            textAlign: "center",
            backgroundImage:
              "url(https://res.cloudinary.com/dbxjpuupy/image/upload/v1766603718/ChatGPT_Image_Dec_25_2025_12_45_14_AM_iuxzup.png)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(0,0,0,0.55), rgba(0,0,0,0.75))",
            }}
          />

          <Box sx={{ position: "relative", px: 4 }}>
            <Typography fontSize={18} fontWeight={600}>
              Wholesale Leville Inc.
            </Typography>
            <Typography fontSize={32} fontWeight={700} mt={1}>
              Welcome Back
            </Typography>
            <Typography sx={{ opacity: 0.9, maxWidth: 320, mx: "auto", mt: 1 }}>
              Trade premium fragrances and manage your inventory with ease.
            </Typography>
          </Box>
        </Box>

        {/* RIGHT FORM */}
        <Box
          component="form"
          onSubmit={handleLogin}
          sx={{
            flex: 1,
            p: { xs: 3, md: 6 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2.5,
          }}
        >
          <Typography
            fontSize={24}
            fontWeight={700}
            textAlign="center"
            color={theme.palette.text.primary}
          >
            Login to your account
          </Typography>

          <>
            <TextField
              label="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
              sx={inputStyles}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
              sx={inputStyles}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              disabled={loading}
              sx={{
                py: 1.2,
                fontWeight: 600,
                backgroundColor: theme.palette.primary.main,
                color: `${theme.palette.primary.contrastText} !important`,
                textTransform: "none",
                "&:hover": { backgroundColor: theme.palette.primary.light },
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </>

          <Divider />

          <Typography
            textAlign="center"
            fontSize={14}
            sx={{ color: theme.palette.text.secondary }}
          >
            Having trouble logging in?{" "}
            <Link
              href="mailto:support@nypx.com"
              style={{ color: theme.palette.primary.main }}
            >
              Contact Support
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

*/
