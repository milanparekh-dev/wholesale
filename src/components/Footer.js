import React from "react";
import { Box, Grid, Typography, Link, IconButton, Container } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import NextLink from "next/link";

import { useTheme } from "@mui/material/styles";

const Footer = () => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.default,
        color: "#fff",
        py: 3,
        borderTop: `1px solid ${theme.palette.divider}`,
        mt: "auto",
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          {/* Logo and Contact Info Column */}
          <Grid item xs={12} sm={4}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <img 
                src="/logo.png" 
                alt="Beauté Leville Logo" 
                style={{ maxHeight: "60px" }} 
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, color: "#fff" }}>
                Beauté Leville Inc.
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Box sx={{ display: "flex", gap: 2 }}>
                <LocationOnIcon sx={{ color: "#ccc", fontSize: 20 }} />
                <Typography sx={{ fontSize: "0.85rem", color: "#ccc" }}>
                  208-1960 Rue Wellington Montréal, QC H3K 0A1, Canada
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2 }}>
                <PhoneIcon sx={{ color: "#ccc", fontSize: 20 }} />
                <Link
                  href="tel:+12639997776"
                  color="inherit"
                  underline="hover"
                  sx={{ fontSize: "0.85rem", color: "#ccc" }}
                >
                  +1(263)999-7776
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Quick Links Column */}
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              Information
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
              <NextLink href="/about-us" passHref legacyBehavior>
                <Link color="inherit" underline="hover" sx={{ fontSize: "0.9rem", color: "#ccc" }}>
                  About us
                </Link>
              </NextLink>
              <NextLink href="/shipping-policy" passHref legacyBehavior>
                <Link color="inherit" underline="hover" sx={{ fontSize: "0.9rem", color: "#ccc" }}>
                  Shipping Policy
                </Link>
              </NextLink>
              <NextLink href="/terms-and-conditions" passHref legacyBehavior>
                <Link color="inherit" underline="hover" sx={{ fontSize: "0.9rem", color: "#ccc" }}>
                  Terms & Conditions
                </Link>
              </NextLink>
              <NextLink href="/payment-policy" passHref legacyBehavior>
                <Link color="inherit" underline="hover" sx={{ fontSize: "0.9rem", color: "#ccc" }}>
                  Payment Policy
                </Link>
              </NextLink>
            </Box>
          </Grid>

          {/* Social Column */}
         
        </Grid>
        <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #222", textAlign: "center" }}>
          <Typography variant="caption" sx={{ color: "#666" }}>
            &copy; {new Date().getFullYear()} Beauté Leville Inc. All Rights Reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
