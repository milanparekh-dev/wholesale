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
      const response = await adminApi.get("/api/admin/vendor-quotes/");
      if (response?.status == "success") {
        setBrands(response?.data?.data || []);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to fetch quotes!");
    } finally {
      setLoading(false);
    }
  };

  const sortBrands = (data) => {
    if (!sortBy) return data;
    const sorted = [...data].sort((a, b) => {
      if (sortBy === "created_asc")
        return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "created_desc")
        return new Date(b.created_at) - new Date(a.created_at);
      return 0;
    });
    return sorted;
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const filteredBrands = sortBrands(
    brands.filter((b) =>
      b?.vendor_quote_number?.toLowerCase().includes(search.toLowerCase()) ||
      b?.vendor_source_name?.toLowerCase().includes(search.toLowerCase())
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

        {/* -------------------- DESKTOP TABLE -------------------- */}
        <TableContainer
          component={Paper}
          ref={containerRef}
          sx={{
            background: theme.palette.background.paper,
            borderRadius: "4px",
            border: `1px solid ${theme.palette.divider}`,
            maxHeight: "80vh",
            overflowY: "auto",
            mt: 0,
            boxShadow: "0 20px 48px rgba(4,6,8,0.5)",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  "Quote Number",
                  "Vendor Source",
                  "Status",
                  "Subtotal",
                  "Total",
                  "Created At",
                  "Final Sent At",
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
                    <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                      {b?.vendor_quote_number || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <Typography sx={{ color: theme.palette.text.primary }}>
                      {b?.vendor_source_name || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <Chip
                      label={b?.status?.replaceAll("_", " ") || "unknown"}
                      size="small"
                      sx={{
                        fontSize: "12px",
                        height: "22px",
                        textTransform: "capitalize",
                        color:
                          b?.status === "draft"
                            ? theme.palette.text.secondary
                            : b?.status === "final_sent"
                            ? theme.palette.success.main
                            : theme.palette.info.main,
                        borderColor:
                          b?.status === "draft"
                            ? theme.palette.text.secondary
                            : b?.status === "final_sent"
                            ? theme.palette.success.main
                            : theme.palette.info.main,
                        border: "1px solid",
                        backgroundColor: theme.palette.background.subtle,
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600 }}>
                      ${Number(b?.totals?.subtotal || 0).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <Typography sx={{ color: theme.palette.text.primary, fontWeight: 700 }}>
                      ${Number(b?.totals?.total || 0).toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <Typography sx={{ color: theme.palette.text.secondary }}>
                      {b?.created_at ? dayjs(b.created_at).format("DD MMM YYYY hh:mm A") : "-"}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: "4px 8px" }}>
                    <Typography sx={{ color: theme.palette.text.secondary }}>
                      {b?.final_sent_at ? dayjs(b.final_sent_at).format("DD MMM YYYY hh:mm A") : "-"}
                    </Typography>
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
