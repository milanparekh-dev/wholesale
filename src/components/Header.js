import React, { useEffect, useState } from "react";
import { Box, Typography, IconButton, useMediaQuery } from "@mui/material";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { useTheme } from "@mui/material/styles";
import CartButton from "/src/components/CartButton";
import LogoutIcon from "@mui/icons-material/Logout";

const Header = () => {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:768px)");
  const [logoHref, setLogoHref] = useState("/");

  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("api_token")) {
      setLogoHref("/products");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("api_token");
    router.push("/login");
  };

  return (
    <Box
      sx={{
        background: theme.palette.background.paper,
        padding: isMobile ? "10px 10px" : "10px 70px",
        display: "flex",
        justifyContent: "space-between",
        boxShadow: "0 2px 10px rgba(4,6,8,0.6)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <NextLink href={logoHref} passHref legacyBehavior>
        <Typography
          component="a"
          variant="h5"
          sx={{ 
            fontWeight: 700, 
            color: theme.palette.text.primary, 
            alignSelf: "center", 
            cursor: "pointer",
            textDecoration: "none",
            "&:hover": { opacity: 0.8 }
          }}
        >
          Beauté Leville Inc.
        </Typography>
      </NextLink>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <CartButton />
        <IconButton onClick={handleLogout} sx={{ color: theme.palette.text.primary }}>
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Header;
