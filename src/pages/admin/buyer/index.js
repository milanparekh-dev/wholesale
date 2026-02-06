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
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  useTheme,
} from "@mui/material";
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

  // Fetch vendors
  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get("/api/users?role=buyer");
      if (response?.status === "success") {
        setVendors(response?.data?.users || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to fetch vendors!");
    } finally {
      setLoading(false);
    }
  };

  const sortVendors = (data) => {
    if (!sortBy) return data;

    const sorted = [...data].sort((a, b) => {
      if (sortBy === "created_asc")
        return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "created_desc")
        return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "updated_asc")
        return new Date(a.updated_at) - new Date(b.updated_at);
      if (sortBy === "updated_desc")
        return new Date(b.updated_at) - new Date(a.updated_at);
      return 0;
    });

    return sorted;
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const filteredVendors = sortVendors(
    vendors.filter((v) =>
      v?.name?.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  const toggleBan = async (vendor) => {
    const isBanned = vendor?.status === "banned";
    const actionText = isBanned ? "Unban" : "Ban";

    const result = await Swal.fire({
      title: `${actionText} this user?`,
      text: `Are you sure you want to ${actionText.toLowerCase()} "${vendor?.name}"?`,
      icon: "warning",
      background: theme.palette.background.paper,
      color: theme.palette.text.primary,
      iconColor: "#ff9800",
      showCancelButton: true,
      confirmButtonText: actionText,
      cancelButtonText: "Cancel",
      confirmButtonColor: theme.palette.warning.main,
      cancelButtonColor: theme.palette.text.secondary,
    });

    if (result.isConfirmed) {
      let response;
      if (!isBanned) {
        response = await adminApi.post(`/api/users/${vendor?._id}/ban`);
      } else {
        response = await adminApi.post(`/api/users/${vendor?._id}/unban/`);
      }
      if (response?.status === "success") {
        toast.success(`User ${actionText.toLowerCase()}d successfully!`);
        fetchVendors();
      } else {
        toast.error(`Failed to ${actionText.toLowerCase()} user!`);
      }
    }
  };

  return (
    <AdminLayout>
      <Box
        sx={{
          background: theme.palette.background.default,
          minHeight: "100vh",
          p: 2,
        }}
      >
        {/* Search + Sort Section */}
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
            sx={{
              width: 220,
              "& .MuiOutlinedInput-root": {
                color: theme.palette.text.primary,
                background: theme.palette.background.subtle,
                borderRadius: "8px",
                "& fieldset": { border: `1px solid ${theme.palette.divider}` },
                "&:hover fieldset": {
                  border: `1px solid ${theme.palette.primary.main}`,
                },
                "&.Mui-focused fieldset": {
                  border: `1px solid ${theme.palette.primary.main}`,
                },
              },
              "& .MuiInputLabel-root": { color: theme.palette.text.secondary },
              "& .MuiInputLabel-root.Mui-focused": {
                color: theme.palette.primary.main,
              },
            }}
          />

          <FormControl
            size="small"
            sx={{
              minWidth: isMobile ? "100%" : "200px",
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                background: theme.palette.background.subtle,
                "& fieldset": { border: `1px solid ${theme.palette.divider}` },
                "&:hover fieldset": {
                  border: `1px solid ${theme.palette.primary.main}`,
                },
                "&.Mui-focused fieldset": {
                  border: `1px solid ${theme.palette.primary.main}`,
                },
              },
            }}
          >
            <InputLabel sx={{ color: theme.palette.text.secondary }}>
              Sort By
            </InputLabel>
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
                  {[
                    "Name",
                    "Email",
                    "Status",
                    "Membership",
                    "Updated On",
                    "Actions",
                  ].map((h) => (
                    <TableCell
                      key={h}
                      sx={{
                        color: theme.palette.text.primary,
                        background: theme.palette.background.elevated,
                        fontWeight: 600,
                        padding: "2px 12px",
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
                      sx={{
                        textAlign: "center",
                        color: theme.palette.text.secondary,
                        padding: "20px",
                      }}
                    >
                      No buyer found
                    </TableCell>
                  </TableRow>
                )}
                {filteredVendors.length > 0 &&
                  filteredVendors.map((v) => (
                    <TableRow
                      key={v?._id}
                      sx={{
                        "&:hover": {
                          background: theme.palette.background.subtle,
                        },
                      }}
                    >
                      <TableCell sx={{ padding: "2px 8px" }}>
                        <Typography sx={{ color: theme.palette.text.primary }}>
                          {v?.name}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: "2px 8px" }}>
                        <Typography sx={{ color: theme.palette.text.secondary }}>
                          {v?.email}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ padding: "2px 8px" }}>
                        <Typography
                          sx={{
                            color:
                              v?.status === "banned"
                                ? theme.palette.error.main
                                : theme.palette.success.main,
                            textTransform: "capitalize",
                            fontWeight: 600,
                          }}
                        >
                          {v?.status}
                        </Typography>
                      </TableCell>
                      <TableCell
                        sx={{
                          color: theme.palette.text.secondary,
                          padding: "2px 8px",
                        }}
                      >
                        {v?.membership_level || "Wholesale"}
                      </TableCell>
                      <TableCell
                        sx={{
                          color: theme.palette.text.secondary,
                          padding: "2px 8px",
                        }}
                      >
                        {dayjs(v?.updated_at).format("DD MMM YYYY hh:mm A")}
                      </TableCell>
                      <TableCell sx={{ padding: "2px 8px" }}>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          {/* <Button
                            variant="contained"
                            size="small"
                            onClick={() => toggleBan(v)}
                            sx={{
                              background:
                                v?.status === "banned"
                                  ? theme.palette.success.main
                                  : theme.palette.error.main,
                              color: theme.palette.primary.contrastText,
                              textTransform: "none",
                              "&:hover": {
                                background:
                                  v?.status === "banned"
                                    ? theme.palette.success.light
                                    : theme.palette.error.light,
                              },
                            }}
                          >
                            {v?.status === "banned" ? "Unban" : "Ban"}
                          </Button> */}

                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => {
                              setVendorPopup(v);
                              setCategoryPopup(true);
                            }}
                            sx={{
                              textTransform: "none",
                              borderColor: theme.palette.primary.main,
                              color: theme.palette.primary.main,
                              "&:hover": {
                                borderColor: theme.palette.primary.light,
                                color: theme.palette.primary.light,
                              },
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
                <Typography
                  sx={{
                    textAlign: "center",
                    color: theme.palette.text.secondary,
                    padding: "20px",
                  }}
                >
                  No buyer found
                </Typography>
              )}
              {filteredVendors.length > 0 &&
                filteredVendors.map((v) => (
                  <Box
                    key={v?._id}
                    sx={{
                      background: theme.palette.background.paper,
                      padding: 1,
                      mb: 1,
                      borderRadius: "8px",
                      border: `1px solid ${theme.palette.divider}`,
                      boxShadow: "0 14px 32px rgba(4,6,8,0.45)",
                    }}
                  >
                    <Typography
                      sx={{ color: theme.palette.text.primary, fontWeight: 600 }}
                    >
                      {v?.name}
                    </Typography>
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "12px",
                      }}
                    >
                      Email: {v?.email}
                    </Typography>
                    <Typography
                      sx={{
                        color:
                          v?.status === "banned"
                            ? theme.palette.error.main
                            : theme.palette.success.main,
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      Status: {v?.status}
                    </Typography>
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "12px",
                      }}
                    >
                      Membership: {v?.membership_level || "Wholesale"}
                    </Typography>
                    <Typography
                      sx={{
                        color: theme.palette.text.secondary,
                        fontSize: "12px",
                      }}
                    >
                      Updated:{" "}
                      {dayjs(v?.updated_at).format("DD MMM YYYY hh:mm A")}
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{
                          textTransform: "none",
                          fontSize: "11px",
                          background:
                            v?.status === "banned"
                              ? theme.palette.success.main
                              : theme.palette.error.main,
                          color: theme.palette.primary.contrastText,
                          "&:hover": {
                            background:
                              v?.status === "banned"
                                ? theme.palette.success.light
                                : theme.palette.error.light,
                          },
                        }}
                        onClick={() => toggleBan(v)}
                      >
                        {v?.status === "banned" ? "Unban" : "Ban"}
                      </Button>

                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          textTransform: "none",
                          fontSize: "11px",
                          borderColor: theme.palette.primary.main,
                          color: theme.palette.primary.main,
                          minWidth: "unset",
                          padding: "0px 6px",
                          "&:hover": {
                            borderColor: theme.palette.primary.light,
                            color: theme.palette.primary.light,
                          },
                        }}
                        onClick={() => {
                          setVendorPopup(v);
                          setCategoryPopup(true);
                        }}
                      >
                        Edit <EditIcon sx={{ fontSize: 12 }} />
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
