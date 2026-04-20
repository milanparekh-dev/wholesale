import React from "react";
import { useRouter } from "next/router";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Footer from "./Footer";

const LandingPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ bgcolor: "#0f1115", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* Hero Section - Full Screen */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          py: { xs: 6, md: 10 },
          bgcolor: "#0f1115",
        }}
      >
        <Container maxWidth="lg">
          <Grid 
            container 
            spacing={{ xs: 4, md: 8 }} 
            alignItems="center"
            sx={{
              flexDirection: { xs: "column", md: "row" },
              flexWrap: "nowrap",
            }}
          >
            {/* Left Side - Text Content */}
            <Grid item xs={12} md={6} sx={{ width: { xs: "100%", md: "50%" } }}>
              <Typography
                variant="overline"
                sx={{
                  fontSize: { xs: "0.75rem", md: "0.85rem" },
                  letterSpacing: 2,
                  mb: 3,
                  fontWeight: 600,
                  display: "block",
                  color: "#C850C0",
                }}
              >
                B2B BEAUTY PARTNERSHIPS
              </Typography>
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                  lineHeight: 1.2,
                  color: "#FFFFFF",
                }}
              >
                Beauté Leville Inc.
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 5,
                  fontSize: { xs: "1rem", md: "1.125rem" },
                  lineHeight: 1.8,
                  color: "#CCCCCC",
                  maxWidth: "500px",
                }}
              >
                 Independent wholesale distributor of authentic designer fragrances and beauty products.
                 Supplying retailers across Canada with competitive pricing, verified sourcing, and reliable inventory.
               </Typography>
               <Box component="ul" sx={{ listStyle: "none", p: 0, m: 0, mb: 5 }}>
                 {[
                   "Authentic, brand-name products",
                   "UPC-verified inventory",
                   "Established supplier network",
                   "Serving retailers and resellers",
                 ].map((item) => (
                   <Box
                     component="li"
                     key={item}
                     sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                   >
                     <Box component="span" sx={{ color: "#C850C0", fontWeight: 700, fontSize: "1.1rem" }}>✔</Box>
                     <Typography variant="body2" sx={{ color: "#CCCCCC", fontSize: { xs: "0.95rem", md: "1rem" } }}>
                       {item}
                     </Typography>
                   </Box>
                 ))}
               </Box>
               {/* Login Button */}
               <Button
                variant="contained"
                size="large"
                onClick={() => router.push("/login")}
                sx={{
                  textTransform: "none",
                  fontSize: "1rem",
                  px: 5,
                  py: 1.5,
                  bgcolor: "#C850C0",
                  color: "#fff",
                  fontWeight: 600,
                  borderRadius: "4px",
                  "&:hover": {
                    bgcolor: "#B040B0",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                Login
              </Button>
            </Grid>

            {/* Right Side - Product Image */}
            <Grid item xs={12} md={6} sx={{ width: { xs: "100%", md: "50%" } }}>
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <img
                  src="/landing-page.jpeg"
                  alt="Beauty Products"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "600px",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default LandingPage;
