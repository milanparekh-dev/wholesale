"use client";
import React, { useState, useEffect } from "react";
import ThickCircleLoader from "./Loading";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  AppBar,
  Toolbar,
  Typography,
  Avatar,
  Tooltip,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
import MuiMenu from "@mui/material/Menu";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import {
  Storefront,
  ShoppingCart,
  People,
  Settings,
  Category,
  Inventory2,
  ChevronLeft,
  ChevronRight,
  Menu,
} from "@mui/icons-material";
import { RequestQuote } from "@mui/icons-material";

export default function AdminLayout({ children }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const openProfileMenu = Boolean(anchorEl);

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);

  const router = useRouter();
  const [open, setOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url) => {
      if (url !== router.asPath) setLoading(true);
    };
    const handleComplete = () => setLoading(false);
    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  const isMobile = useMediaQuery("(max-width:768px)");
  const drawerWidth = 240;

  const handleLogout = async () => {
    setAnchorEl(null);
    const result = await Swal.fire({
      title: "Are you sure you want to logout?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Logout",
      cancelButtonText: "Cancel",
      background: "#161b22",
      color: "#f5f7fa",
      confirmButtonColor: "#8ab4f8",
      cancelButtonColor: "#30363d",
    });
    if (result.isConfirmed) {
      localStorage.setItem("api_token", "");
      router.push("/admin/login");
    }
  };

  const menuItems = [
    // { label: "Product", icon: <Storefront />, path: "/admin/product" },
    // { label: "Brand", icon: <Inventory2 />, path: "/admin/brand" },
    // { label: "Category", icon: <Category />, path: "/admin/category" },
    { label: "Buyer", icon: <ShoppingCart />, path: "/admin/buyer" },
    // { label: "Vendor", icon: <People />, path: "/admin/vendor" },
    // { label: "Quotes", icon: <RequestQuote />, path: "/admin/quotes" },
  ];

  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        height: "100vh",
        fontFamily: "Inter, sans-serif",
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      })}
    >
      {/* SIDEBAR */}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={open}
        onClose={() => setOpen(false)}
        sx={(theme) => ({
          width: open ? drawerWidth : isMobile ? drawerWidth : 70,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? drawerWidth : isMobile ? drawerWidth : 70,
            boxSizing: "border-box",
            transition: "width 0.3s ease",
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.primary,
          },
        })}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: open ? "space-between" : "center",
            p: 2,
          }}
        >
          {open && (
            <Typography
              variant="h6"
              sx={(theme) => ({ fontWeight: 700, color: theme.palette.text.primary })}
            >
              Wholesale Leville Inc.
            </Typography>
          )}
          <IconButton
            onClick={() => setOpen(!open)}
            sx={(theme) => ({ color: theme.palette.text.primary })}
          >
            {open ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </Box>

        <Divider sx={(theme) => ({ borderColor: theme.palette.divider })} />

        {/* MENU ITEMS */}
        <List sx={{ flexGrow: 1 }}>
          {menuItems.map((item) => (
            <Link key={item.path} href={item.path} style={{ textDecoration: "none" }}>
              <ListItemButton
                sx={(theme) => ({
                  color: theme.palette.text.primary,
                  "&:hover": { backgroundColor: "rgba(138, 180, 248, 0.12)" },
                  backgroundColor:
                    router.pathname === item.path ? "rgba(138, 180, 248, 0.18)" : "transparent",
                  borderLeft:
                    router.pathname === item.path
                      ? `4px solid ${theme.palette.primary.main}`
                      : "4px solid transparent",
                })}
                onClick={() => isMobile && setOpen(false)}
              >
                <ListItemIcon sx={(theme) => ({ color: theme.palette.text.primary })}>
                  {item.icon}
                </ListItemIcon>
                {open && <ListItemText primary={item.label} />}
              </ListItemButton>
            </Link>
          ))}
        </List>

        <Divider sx={(theme) => ({ borderColor: theme.palette.divider })} />

        <Link href="/admin/settings" style={{ textDecoration: "none" }}>
          <ListItemButton
            sx={(theme) => ({
              color: theme.palette.text.primary,
              "&:hover": { backgroundColor: "rgba(138, 180, 248, 0.12)" },
              backgroundColor:
                router.pathname === "/admin/settings"
                  ? "rgba(138, 180, 248, 0.18)"
                  : "transparent",
              borderLeft:
                router.pathname === "/admin/settings"
                  ? `4px solid ${theme.palette.primary.main}`
                  : "4px solid transparent",
            })}
            onClick={() => isMobile && setOpen(false)}
          >
            <ListItemIcon sx={(theme) => ({ color: theme.palette.text.primary })}>
              <Settings />
            </ListItemIcon>
            {open && <ListItemText primary="Settings" />}
          </ListItemButton>
        </Link>
      </Drawer>

      {/* NAVBAR + PAGE */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
        <AppBar
          position="sticky"
          sx={(theme) => ({
            top: 0,
            backgroundColor: theme.palette.background.paper,
            borderBottom: `1px solid ${theme.palette.divider}`,
            boxShadow: "none",
          })}
        >
          <Toolbar sx={{ display: "flex", justifyContent: "space-between", px: 3 }}>
            {isMobile && (
              <IconButton
                onClick={() => setOpen(true)}
                sx={(theme) => ({ color: theme.palette.text.primary })}
              >
                <Menu />
              </IconButton>
            )}
            <Typography
              variant="h6"
              sx={(theme) => ({ fontWeight: 600, color: theme.palette.text.primary })}
            >
              Dashboard
            </Typography>
            <Tooltip title="Profile / Settings">
              <Avatar
                sx={(theme) => ({
                  bgcolor: theme.palette.primary.main,
                  color: theme.palette.background.default,
                  cursor: "pointer",
                })}
                onClick={handleProfileClick}
              >
                U
              </Avatar>
            </Tooltip>
            <MuiMenu
              anchorEl={anchorEl}
              open={openProfileMenu}
              onClose={handleProfileClose}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
              PaperProps={{
                sx: (theme) => ({
                  bgcolor: theme.palette.background.paper,
                  color: theme.palette.text.primary,
                  minWidth: 140,
                  border: `1px solid ${theme.palette.divider}`,
                }),
              }}
            >
              <MenuItem
                onClick={handleLogout}
                sx={(theme) => ({ color: theme.palette.secondary.main })}
              >
                Logout
              </MenuItem>
            </MuiMenu>
          </Toolbar>
        </AppBar>

        <Box
          sx={(theme) => ({
            flexGrow: 1,
            p: isMobile ? 2 : 4,
            background: theme.palette.background.default,
            overflowY: "auto",
            minHeight: 0,
          })}
        >
          {loading ? <ThickCircleLoader /> : children}
        </Box>
      </Box>
    </Box>
  );
}
