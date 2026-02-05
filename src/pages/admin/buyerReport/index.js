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
  const [buyers, setBuyers] = useState([]);
  const [buyersTotal, setBuyersTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const isMobile = useMediaQuery("(max-width:768px)");
  const containerRef = useRef(null);

  const fetchQuotes = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get("/api/admin/reports/buyers/");
      if (response?.status == "success") {
        const data = response?.data;
        setBuyersTotal(data?.buyers_total || 0);
        
        // Convert stats_by_buyer object to array
        const statsByBuyer = data?.stats_by_buyer || {};
        const buyersArray = Object.entries(statsByBuyer).map(([buyerId, stats]) => ({
          buyer_id: buyerId,
          ...stats
        }));
        setBuyers(buyersArray);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to fetch buyer reports!");
    } finally {
      setLoading(false);
    }
  };

  const sortBuyers = (data) => {
    if (!sortBy) return data;
    const sorted = [...data].sort((a, b) => {
      if (sortBy === "total_asc")
        return a.total_rfqs - b.total_rfqs;
      if (sortBy === "total_desc")
        return b.total_rfqs - a.total_rfqs;
      if (sortBy === "submitted_asc")
        return a.submitted - b.submitted;
      if (sortBy === "submitted_desc")
        return b.submitted - a.submitted;
      return 0;
    });
    return sorted;
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const filteredBuyers = sortBuyers(
    buyers.filter((b) =>
      b?.buyer_id?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <AdminLayout>
      <Box
        sx={{
          background: theme.palette.background.default,
          minHeight: "100vh",
          p: 2,
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            mb: 2,
            p: "5px 10px",
            background: theme.palette.background.paper,
            borderRadius: "4px",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: "0 18px 44px rgba(4,6,8,0.45)",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              Buyer Reports
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Total Buyers: {buyersTotal}
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Search by Buyer ID"
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
                <MenuItem value="total_asc">Total RFQs (Low to High)</MenuItem>
                <MenuItem value="total_desc">Total RFQs (High to Low)</MenuItem>
                <MenuItem value="submitted_asc">Submitted (Low to High)</MenuItem>
                <MenuItem value="submitted_desc">Submitted (High to Low)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>

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
            mt: 2,
            boxShadow: "0 20px 48px rgba(4,6,8,0.5)",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {[
                  "Buyer ID",
                  "Total RFQs",
                  "Submitted",
                  "Final Sent",
                  "Cancelled",
                ].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      color: theme.palette.text.primary,
                      background: theme.palette.background.elevated,
                      fontWeight: 600,
                      padding: "2px 16px",
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {filteredBuyers.length > 0 ? (
                filteredBuyers.map((buyer, index) => (
                  <TableRow
                    key={buyer?.buyer_id || index}
                    sx={{
                      "&:hover": {
                        background: theme.palette.background.subtle,
                      },
                    }}
                  >
                    <TableCell sx={{ padding: "4px 10px" }}>
                      <Typography sx={{ color: theme.palette.text.primary, fontWeight: 600, fontFamily: "monospace" }}>
                        {buyer?.buyer_id || "-"}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ padding: "4px 10px" }}>
                      <Chip
                        label={buyer?.total_rfqs || 0}
                        size="small"
                        sx={{
                          fontSize: "14px",
                          fontWeight: 700,
                          background: theme.palette.primary.main + "20",
                          color: theme.palette.primary.main,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: "4px 10px" }}>
                      <Chip
                        label={buyer?.submitted || 0}
                        size="small"
                        sx={{
                          fontSize: "14px",
                          fontWeight: 700,
                          background: theme.palette.info.main + "20",
                          color: theme.palette.info.main,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: "4px 10px" }}>
                      <Chip
                        label={buyer?.final_sent || 0}
                        size="small"
                        sx={{
                          fontSize: "14px",
                          fontWeight: 700,
                          background: theme.palette.success.main + "20",
                          color: theme.palette.success.main,
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ padding: "4px 10px" }}>
                      <Chip
                        label={buyer?.cancelled || 0}
                        size="small"
                        sx={{
                          fontSize: "14px",
                          fontWeight: 700,
                          background: theme.palette.error.main + "20",
                          color: theme.palette.error.main,
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ padding: "24px" }}>
                    <Typography color="text.secondary">
                      No buyer data available
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </AdminLayout>
  );
}
