export async function getServerSideProps() {
  return {
    redirect: { destination: "/products", permanent: false },
  };
}

export default function VendorRemoved() {
  return null;
}

/* REMOVED: legacy vendor page (auth/session disabled)
"use client";

import React from "react";
import { Box, Typography, Button } from "@mui/material";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

export default function ComingSoonPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #1a1a1a 0%, #000 60%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        color: "#fff",
        px: 2,
      }}
    >
      <Box
        sx={{
          textAlign: "center",
          backgroundColor: "#0f0f0f",
          p: { xs: 4, md: 6 },
          borderRadius: 4,
          boxShadow: "0 0 40px rgba(255,105,180,0.25)",
          maxWidth: 520,
          width: "100%",
          border: "1px solid #222",
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            width: 90,
            height: 90,
            mx: "auto",
            mb: 3,
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, #ff69b4 0%, #ff1493 100%)",
            boxShadow: "0 0 25px rgba(255,105,180,0.6)",
          }}
        >
          <HourglassBottomIcon sx={{ fontSize: 44, color: "#000" }} />
        </Box>

        {/* Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 1,
            letterSpacing: 1,
            color: "#ff69b4",
          }}
        >
          Coming Soon
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            color: "#bbb",
            fontSize: { xs: 14, md: 16 },
            lineHeight: 1.7,
            mb: 3,
          }}
        >
          We’re crafting something <strong>beautiful</strong>, powerful, and
          seamless for you.
          <br />
          Stay tuned — the experience is almost ready ✨
        </Typography>

        {/* Divider */}
        <Box
          sx={{
            width: 80,
            height: 3,
            mx: "auto",
            mb: 3,
            borderRadius: 2,
            background:
              "linear-gradient(90deg, transparent, #ff69b4, transparent)",
          }}
        />

        {/* CTA */}
        <Button
          disabled
          sx={{
            px: 4,
            py: 1.3,
            borderRadius: 3,
            fontWeight: 600,
            backgroundColor: "#1f1f1f",
            color: "#ff69b4 !important",
            border: "1px solid #333",
            cursor: "default",
          }}
        >
          Launching Soon 🚀
        </Button>
      </Box>
    </Box>
  );
}

*/
