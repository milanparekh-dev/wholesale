export async function getServerSideProps() {
  return {
    redirect: { destination: "/products", permanent: false },
  };
}

export default function AdminQuotesRemoved() {
  return null;
}

/* REMOVED: legacy admin quotes page (auth/session disabled)
"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Typography,
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
  Chip,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css";
import { toast } from "react-toastify";
import adminApi from "/src/utility/adminApi";
import AdminLayout from "/src/components/AdminLayout";
import dayjs from "dayjs";

export default function Home() {
  const theme = useTheme();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const isMobile = useMediaQuery("(max-width:768px)");
  const containerRef = useRef(null);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get("/api/quotes/");
      if (response?.status == "success") {
        setBrands(response?.data?.data || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to fetch brands!");
    } finally {
      setLoading(false);
    }
  };

  const sortBrands = (data) => {
    if (!sortBy) return data;
    const sorted = [...data].sort((a, b) => {
      if (sortBy === "created_asc")
        return new Date(a.submitted_at) - new Date(b.submitted_at);
      if (sortBy === "created_desc")
        return new Date(b.submitted_at) - new Date(a.submitted_at);
      return 0;
    });
    return sorted;
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const filteredBrands = sortBrands(
    brands.filter((b) =>
      b?.buyer_name?.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleStatus = async (vendor, status) => {
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `You want to ${
        status == "approved" ? "approve" : "reject"
      } the quote request for ${vendor?.buyer_name}?`,
      icon: "warning",
      showCancelButton: true,
      background: theme.palette.background.paper,
      color: theme.palette.text.primary,
      confirmButtonColor:
        status == "approved"
          ? theme.palette.success.main
          : theme.palette.error.main,
      cancelButtonColor: theme.palette.text.secondary,
      confirmButtonText: `Yes, ${status == "approved" ? "approve" : "reject"}`,
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const body = { status };
      const response = await adminApi.post(
        `/api/quotes/${vendor?._id}/status/`,
        body
      );

      if (response?.status === "success") {
        if (status === "approved") {
          toast.success(`Quote request ${status} for ${vendor?.buyer_name}`);
        } else {
          toast.error(`Quote request ${status} for ${vendor?.buyer_name}`);
        }
        fetchQuotes();
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.message || "Unable to update status!",
        icon: "error",
      });
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
        {/* SEARCH + SORT */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            mb: 3,
            p: 2,
            background: theme.palette.background.paper,
            borderRadius: "8px",
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
                background: theme.palette.background.subtle,
                borderRadius: "8px",
                "& fieldset": { border: `1px solid ${theme.palette.divider}` },
                color: theme.palette.text.primary,
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
              sx={{ color: theme.palette.text.primary }}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="created_asc">
                Created On (Earliest First)
              </MenuItem>
              <MenuItem value="created_desc">
                Created On (Latest First)
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* -------------------- DESKTOP TABLE -------------------- */}
        <TableContainer
          component={Paper}
          ref={containerRef}
          sx={{
            background: theme.palette.background.paper,
            borderRadius: "12px",
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
                  "Buyer",
                  "Phone",
                  "Status",
                  "Requested On",
                  "IP",
                  "Items",
                  "Actions",
                ].map((h) => (
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
              {filteredBrands.map((b) => (
                <TableRow
                  key={b?._id}
                  sx={{
                    "&:hover": {
                      background: theme.palette.background.subtle,
                    },
                  }}
                >
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <Typography sx={{ color: theme.palette.text.primary }}>
                      {b?.buyer_name}
                    </Typography>
                    <Typography sx={{ color: theme.palette.text.secondary, fontSize: "12px" }}>
                      {b?.buyer_email}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <Typography sx={{ color: theme.palette.text.secondary }}>
                      {b?.buyer_phone}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <Chip
                      label={b?.status}
                      size="small"
                      sx={{
                        fontSize: "12px",
                        height: "22px",
                        textTransform: "capitalize",
                        color:
                          b?.status === "pending"
                            ? theme.palette.warning.main
                            : b?.status === "rejected"
                            ? theme.palette.error.main
                            : theme.palette.success.main,
                        borderColor:
                          b?.status === "pending"
                            ? theme.palette.warning.main
                            : b?.status === "rejected"
                            ? theme.palette.error.main
                            : theme.palette.success.main,
                        border: "1px solid",
                        backgroundColor: theme.palette.background.subtle,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <Typography sx={{ color: theme.palette.text.secondary }}>
                      {dayjs(b?.submitted_at).format("DD MMM YYYY hh:mm A")}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <Typography sx={{ color: theme.palette.text.secondary }}>
                      {b?.meta?.ip || "N/A"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <Typography sx={{ color: theme.palette.text.secondary }}>
                      {b?.items_count || "0"} item(s)
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ padding: "4px 8px" }}>
                    <CheckCircleIcon
                      sx={{ color: theme.palette.success.main, cursor: "pointer" }}
                      onClick={() => handleStatus(b, "approved")}
                    />
                    <CancelIcon
                      sx={{ color: theme.palette.error.main, cursor: "pointer", ml: 1 }}
                      onClick={() => handleStatus(b, "rejected")}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </AdminLayout>
  );
}

*/
