// components/AuthPopup.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { login, register } from "../store/authSlice";
import { Box, Button, TextField, Typography, Modal, useTheme } from "@mui/material";

export default function AuthPopup({ open, onClose }) {
  const [mode, setMode] = useState("login"); // login or register
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const dispatch = useDispatch();
  const theme = useTheme();

  const handleSubmit = () => {
    if (mode === "login") {
      dispatch(login({ email }));
    } else {
      dispatch(register({ name, email }));
    }
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          width: { xs: "90%", md: 900 },
          height: { xs: "90%", md: 500 },
          margin: "auto",
          mt: { xs: 2, md: 10 },
          display: "flex",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 24,
          fontFamily: "Inter, sans-serif",
          background: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Left side */}
        <Box
          sx={{
            flex: 1,
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
            background: `linear-gradient(180deg, ${theme.palette.background.default} 0%, ${theme.palette.background.elevated || theme.palette.background.subtle || theme.palette.background.paper} 100%)`,
            gap: 2,
            color: theme.palette.text.primary,
          }}
        >
          <Typography sx={{ fontSize: 18, display: "flex", alignItems: "center", gap: 1 }}>
            <span style={{ color: theme.palette.secondary.main }}>🎁</span> Perfume & Gift Shop
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, textAlign: "center" }}>
            Find the perfect <br /> scent & gift
          </Typography>
          <Typography sx={{ color: theme.palette.text.secondary, textAlign: "center", maxWidth: 300 }}>
            Explore premium perfumes and curated gifts to delight yourself or your loved ones.
          </Typography>
        </Box>

        {/* Right side */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            p: 6,
            backgroundColor: theme.palette.background.paper,
            gap: 3,
            color: theme.palette.text.primary,
          }}
        >
          <Typography variant="h4" sx={{ fontWeight: 700, textAlign: "center" }}>
            {mode === "login" ? "Login to your account" : "Create your account"}
          </Typography>

          {mode === "register" && (
            <TextField
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              sx={{
                input: { color: theme.palette.text.primary },
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  backgroundColor: theme.palette.background.subtle,
                  "& fieldset": { borderColor: theme.palette.divider },
                  "&:hover fieldset": { borderColor: theme.palette.primary.main },
                  "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
                },
              }}
            />
          )}

          <TextField
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            sx={{
              input: { color: theme.palette.text.primary },
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                backgroundColor: theme.palette.background.subtle,
                "& fieldset": { borderColor: theme.palette.divider },
                "&:hover fieldset": { borderColor: theme.palette.primary.main },
                "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
              },
            }}
          />

          <Button
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.background.default,
              fontWeight: 600,
              "&:hover": { backgroundColor: theme.palette.secondary.light },
            }}
          >
            {mode === "login" ? "Login" : "Register"}
          </Button>

          <Typography
            sx={{ textAlign: "center", color: theme.palette.secondary.main, cursor: "pointer" }}
            onClick={() => setMode(mode === "login" ? "register" : "login")}
          >
            {mode === "login"
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </Typography>
        </Box>
      </Box>
    </Modal>
  );
}
