import React from "react";
import { Box, Grid, Typography, Link, IconButton, Container } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

import { useTheme } from "@mui/material/styles";

const Footer = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        color: "#fff",
        py: 6,
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Contact Info Column */}
          <Grid item xs={12} sm={4}>
            <Box sx={{ mb: 3 }}>
              <img 
                src="/logo.png" 
                alt="Beauté Leville Logo" 
                style={{ maxHeight: "60px", marginBottom: "15px" }} 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff", mb: 2 }}>
                Beauté Leville Inc.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <LocationOnIcon sx={{ color: "#ccc", fontSize: 20 }} />
                <Typography sx={{ fontSize: "0.85rem", color: "#ccc" }}>
                  208-1960 Rue Wellington Montréal, QC H3K 0A1, Canada
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <PhoneIcon sx={{ color: "#ccc", fontSize: 20 }} />
                <Link
                  href="tel:+18663100101"
                  color="inherit"
                  underline="hover"
                  sx={{ fontSize: "0.85rem", color: "#ccc" }}
                >
                  +1(866)310-0101
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links Column */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Information
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Link href="#" color="inherit" underline="hover" sx={{ fontSize: "0.9rem", color: "#ccc" }}>
                About us
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ fontSize: "0.9rem", color: "#ccc" }}>
                Shipping Policy
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ fontSize: "0.9rem", color: "#ccc" }}>
                Terms & Conditions
              </Link>
              <Link href="#" color="inherit" underline="hover" sx={{ fontSize: "0.9rem", color: "#ccc" }}>
                Payment Policy
              </Link>
            </Box>
          </Grid>

          {/* Social Column */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Follow Us
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              <IconButton
                size="small"
                sx={{ bgcolor: "#333", color: "#fff", "&:hover": { bgcolor: "#444" }, borderRadius: 1 }}
              >
                <FacebookIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{ bgcolor: "#333", color: "#fff", "&:hover": { bgcolor: "#444" }, borderRadius: 1 }}
              >
                <InstagramIcon fontSize="small" />
              </IconButton>
            </Box>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, pt: 2, borderTop: "1px solid #222", textAlign: "center" }}>
          <Typography variant="caption" sx={{ color: "#666" }}>
            &copy; {new Date().getFullYear()} Beauté Leville Inc. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
