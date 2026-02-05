"use client";

import React, { useState } from "react";
import {
  Box,
  IconButton,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import AdminLayout from "/src/components/AdminLayout";

export default function HomePage() {
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const isMobile = useMediaQuery("(max-width:768px)");
  const drawerWidth = 240;
  const handleDrawerToggle = () => setOpen(!open);

  return (
    <AdminLayout>
      {/* Main Content */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <Box
          sx={{
            flexGrow: 1,
            p: isMobile ? 2 : 4,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: theme.palette.background.paper,
              p: isMobile ? 3 : 6,
              borderRadius: 2,
              boxShadow: "0 24px 60px rgba(4,6,8,0.5)",
              border: `1px solid ${theme.palette.divider}`,
              textAlign: "center",
              maxWidth: isMobile ? "95%" : 600,
              width: "100%",
            }}
          >
            <Typography
              variant={isMobile ? "h5" : "h4"}
              sx={{
                mb: 2,
                color: theme.palette.primary.main,
                fontWeight: 700,
              }}
            >
              Welcome to Beauté Leville Inc.
            </Typography>
            <Typography
              sx={{
                color: theme.palette.text.secondary,
                fontSize: isMobile ? 14 : 16,
              }}
            >
              Manage your <strong>Products</strong>, <strong>Buyers</strong>,{" "}
              <strong>Vendors</strong>,<strong> Brands</strong> &{" "}
              <strong>Categories</strong> — all in one place.
            </Typography>
          </Box>
        </Box>
      </Box>
    </AdminLayout>
  );
}
