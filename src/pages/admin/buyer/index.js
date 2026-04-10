"use client";

import React, { useState, useRef, useEffect } from "react";
import BuyerEditPopUp from "/src/components/BuyerEditPopUp";
import {
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Chip,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import EditIcon from "@mui/icons-material/Edit";
import { toast } from "react-toastify";
import adminApi from "/src/utility/adminApi";
import AdminLayout from "/src/components/AdminLayout";
import dayjs from "dayjs";
import Swal from "sweetalert2";

export default function Home() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [vendorPopup, setVendorPopup] = useState(null);
  const [categoryPopup, setCategoryPopup] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(false);

  const isMobile = useMediaQuery("(max-width:768px)");
  const containerRef = useRef(null);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get("/api/users?role=buyer");
      if (response?.status === "success") {
        setVendors(response?.data?.users || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to fetch buyers!");
    } finally {
      setLoading(false);
    }
  };

  const sortVendors = (data) => {
    if (!sortBy) return data;
    return [...data].sort((a, b) => {
      if (sortBy === "created_asc") return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "created_desc") return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "updated_asc") return new Date(a.updated_at) - new Date(b.updated_at);
      if (sortBy === "updated_desc") return new Date(b.updated_at) - new Date(a.updated_at);
      return 0;
    });
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const filteredVendors = sortVendors(
    vendors.filter((v) => v?.name?.toLowerCase().includes(search.toLowerCase()))
  );

  const getStatusChip = (status) => {
    const map = {
      active:   { label: "Active",   color: "success" },
      pending:  { label: "Pending",  color: "warning" },
      rejected: { label: "Rejected", color: "error"   },
      banned:   { label: "Banned",   color: "error"   },
    };
    const cfg = map[status] || { label: status || "—", color: "default" };
    return (
      <Chip
        label={cfg.label}
        color={cfg.color}
        size="small"
        sx={{ fontWeight: 600, textTransform: "capitalize", fontSize: 11 }}
      />
    );
  };

  const handleApprove = async (buyer) => {
    const result = await Swal.fire({
      title: "Approve this buyer?",
      text: `"${buyer?.name}" will be granted access to the platform.`,
      icon: "question",
      background: theme.palette.background.paper,
      color: theme.palette.text.primary,
      iconColor: "#4caf50",
      showCancelButton: true,
      confirmButtonText: "Approve",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#4caf50",
      cancelButtonColor: theme.palette.text.secondary,
    });

    if (result.isConfirmed) {
      try {
        const response = await adminApi.post(`/api/users/${buyer?._id}/approve`);
        if (response?.status === "success") {
          toast.success("Buyer approved successfully!");
          fetchVendors();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to approve buyer!");
      }
    }
  };

  const handleReject = async (buyer) => {
    const result = await Swal.fire({
      title: "Reject this buyer?",
      text: `"${buyer?.name}"'s application will be rejected. They will be notified by email.`,
      icon: "warning",
      background: theme.palette.background.paper,
      color: theme.palette.text.primary,
      iconColor: "#f44336",
      showCancelButton: true,
      confirmButtonText: "Reject",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#f44336",
      cancelButtonColor: theme.palette.text.secondary,
    });

    if (result.isConfirmed) {
      try {
        const response = await adminApi.post(`/api/users/${buyer?._id}/reject`);
        if (response?.status === "success") {
          toast.success("Buyer rejected.");
          fetchVendors();
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to reject buyer!");
      }
    }
  };

  const inputSx = {
    "& .MuiOutlinedInput-root": {
      color: theme.palette.text.primary,
      background: theme.palette.background.subtle,
      borderRadius: "8px",
      "& fieldset": { border: `1px solid ${theme.palette.divider}` },
      "&:hover fieldset": { border: `1px solid ${theme.palette.primary.main}` },
      "&.Mui-focused fieldset": { border: `1px solid ${theme.palette.primary.main}` },
    },
    "& .MuiInputLabel-root": { color: theme.palette.text.secondary },
    "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.primary.main },
  };

  return (
    <AdminLayout>
      <Box sx={{ background: theme.palette.background.default, minHeight: "100vh", p: 2 }}>

        {/* Search + Sort */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            alignItems: "center",
            flexWrap: "wrap",
            mb: 2,
            p: "5px 10px",
            background: theme.palette.background.paper,
            borderRadius: "4px",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: "0 18px 44px rgba(4,6,8,0.45)",
          }}
        >
          <TextField
            label="Search"
            variant="outlined"
            size="small"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 220, ...inputSx }}
          />

          <FormControl size="small" sx={{ minWidth: isMobile ? "100%" : "200px", ...inputSx }}>
            <InputLabel sx={{ color: theme.palette.text.secondary }}>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
              sx={{ color: theme.palette.text.primary }}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="created_asc">Created (Earliest First)</MenuItem>
              <MenuItem value="created_desc">Created (Latest First)</MenuItem>
              <MenuItem value="updated_asc">Updated (Earliest First)</MenuItem>
              <MenuItem value="updated_desc">Updated (Latest First)</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* TABLE VIEW */}
        {!isMobile ? (
          <TableContainer
            component={Paper}
            ref={containerRef}
            sx={{
              background: theme.palette.background.paper,
              borderRadius: "4px",
              border: `1px solid ${theme.palette.divider}`,
              maxHeight: "80vh",
              overflowY: "auto",
              mt: 2,
              boxShadow: "0 20px 48px rgba(4,6,8,0.5)",
            }}
          >
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  {["Name", "Email", "Status", "Membership", "Updated On", "Actions"].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        color: theme.palette.text.primary,
                        background: theme.palette.background.elevated,
                        fontWeight: 600,
                        padding: "6px 12px",
                        borderBottom: `1px solid ${theme.palette.divider}`,
                      }}
                    >
                      {h}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>

              <TableBody>
                {filteredVendors.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      sx={{ textAlign: "center", color: theme.palette.text.secondary, padding: "20px" }}
                    >
                      No buyer found
                    </TableCell>
                  </TableRow>
                )}
                {filteredVendors.map((v) => (
                  <TableRow
                    key={v?._id}
                    sx={{ "&:hover": { background: theme.palette.background.subtle } }}
                  >
                    <TableCell sx={{ padding: "6px 8px" }}>
                      <Typography sx={{ color: theme.palette.text.primary, fontWeight: 500 }}>
                        {v?.name}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ padding: "6px 8px" }}>
                      <Typography sx={{ color: theme.palette.text.secondary, fontSize: 13 }}>
                        {v?.email}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ padding: "6px 8px" }}>
                      {getStatusChip(v?.status)}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.secondary, padding: "6px 8px", textTransform: "capitalize" }}>
                      {v?.membership_level || "Wholesale"}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.text.secondary, padding: "6px 8px", fontSize: 12 }}>
                      {dayjs(v?.updated_at).format("DD MMM YYYY hh:mm A")}
                    </TableCell>
                    <TableCell sx={{ padding: "6px 8px" }}>
                      <Box sx={{ display: "flex", gap: 0.8, flexWrap: "wrap" }}>
                        {v?.status !== "active" && (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<CheckCircleOutlineIcon />}
                            onClick={() => handleApprove(v)}
                            sx={{
                              textTransform: "none",
                              fontSize: 11,
                              background: "#4caf50",
                              color: "#fff",
                              "&:hover": { background: "#388e3c" },
                            }}
                          >
                            Approve
                          </Button>
                        )}

                        {v?.status !== "rejected" && (
                          <Button
                            variant="contained"
                            size="small"
                            startIcon={<CancelOutlinedIcon />}
                            onClick={() => handleReject(v)}
                            sx={{
                              textTransform: "none",
                              fontSize: 11,
                              background: theme.palette.error.main,
                              color: "#fff",
                              "&:hover": { background: theme.palette.error.dark },
                            }}
                          >
                            Reject
                          </Button>
                        )}

                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => { setVendorPopup(v); setCategoryPopup(true); }}
                          sx={{
                            textTransform: "none",
                            fontSize: 11,
                            borderColor: theme.palette.primary.main,
                            color: theme.palette.primary.main,
                            "&:hover": { borderColor: theme.palette.primary.light, color: theme.palette.primary.light },
                          }}
                        >
                          Edit
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          /* MOBILE CARD VIEW */
          <Box sx={{ width: "100%", mt: 2 }}>
            <Box sx={{ maxHeight: "78vh", overflowY: "auto", pb: 2 }}>
              {filteredVendors.length === 0 && (
                <Typography sx={{ textAlign: "center", color: theme.palette.text.secondary, padding: "20px" }}>
                  No buyer found
                </Typography>
              )}
              {filteredVendors.map((v) => (
                <Box
                  key={v?._id}
                  sx={{
                    background: theme.palette.background.paper,
                    padding: 1.5,
                    mb: 1.5,
                    borderRadius: "8px",
                    border: `1px solid ${theme.palette.divider}`,
                    boxShadow: "0 14px 32px rgba(4,6,8,0.45)",
                  }}
                >
                  <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                    {v?.name}
                  </Typography>
                  <Typography sx={{ color: theme.palette.text.secondary, fontSize: "12px" }}>
                    Email: {v?.email}
                  </Typography>
                  <Box sx={{ mt: 0.5, mb: 0.5 }}>
                    {getStatusChip(v?.status)}
                  </Box>
                  <Typography sx={{ color: theme.palette.text.secondary, fontSize: "12px", textTransform: "capitalize" }}>
                    Membership: {v?.membership_level || "Wholesale"}
                  </Typography>
                  <Typography sx={{ color: theme.palette.text.secondary, fontSize: "12px" }}>
                    Updated: {dayjs(v?.updated_at).format("DD MMM YYYY hh:mm A")}
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, mt: 1, flexWrap: "wrap" }}>
                    {v?.status !== "active" && (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<CheckCircleOutlineIcon sx={{ fontSize: 13 }} />}
                        onClick={() => handleApprove(v)}
                        sx={{
                          textTransform: "none",
                          fontSize: "11px",
                          background: "#4caf50",
                          color: "#fff",
                          "&:hover": { background: "#388e3c" },
                        }}
                      >
                        Approve
                      </Button>
                    )}

                    {v?.status !== "rejected" && (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<CancelOutlinedIcon sx={{ fontSize: 13 }} />}
                        onClick={() => handleReject(v)}
                        sx={{
                          textTransform: "none",
                          fontSize: "11px",
                          background: theme.palette.error.main,
                          color: "#fff",
                          "&:hover": { background: theme.palette.error.dark },
                        }}
                      >
                        Reject
                      </Button>
                    )}

                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => { setVendorPopup(v); setCategoryPopup(true); }}
                      sx={{
                        textTransform: "none",
                        fontSize: "11px",
                        borderColor: theme.palette.primary.main,
                        color: theme.palette.primary.main,
                        padding: "0px 8px",
                        "&:hover": { borderColor: theme.palette.primary.light, color: theme.palette.primary.light },
                      }}
                    >
                      Edit <EditIcon sx={{ fontSize: 12, ml: 0.5 }} />
                    </Button>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {categoryPopup && (
          <BuyerEditPopUp
            product={vendorPopup}
            close={() => {
              setVendorPopup(null);
              setCategoryPopup(false);
              fetchVendors();
            }}
          />
        )}
      </Box>
    </AdminLayout>
  );
}
