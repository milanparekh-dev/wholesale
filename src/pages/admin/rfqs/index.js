"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  LinearProgress,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import adminApi from "/src/utility/adminApi";
import AdminLayout from "/src/components/AdminLayout";

const statusOptions = [
  { label: "All", value: "" },
  { label: "Draft", value: "draft" },
  { label: "Submitted", value: "submitted" },
  { label: "Responded", value: "responded" },
  { label: "Final Sent", value: "final_sent" },
  { label: "Approved", value: "approved" },
  { label: "Cancelled", value: "cancelled" },
];

export default function AdminRfqsPage() {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:900px)");
  const containerRef = useRef(null);

  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [rfqs, setRfqs] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchRfqs(1);
  }, [status]);

  const fetchRfqs = async (pageToLoad = 1) => {
    try {
      setLoading(true);
      const res = await adminApi.get("/api/admin/rfqs", {
        params: {
          status: status || undefined,
          page: pageToLoad,
          limit,
        },
      });
      if (res?.status === "success") {
        const payload = res?.data || res?.data?.data || {};
        const list = payload?.data || payload?.rfqs || [];
        setRfqs(list);
        setPage(payload?.current_page || pageToLoad);
        setLimit(payload?.per_page || limit);
        setTotal(payload?.total || list.length);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to fetch RFQs");
    } finally {
      setLoading(false);
    }
  };

  const filtered = rfqs.filter((r) => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      r?.trade_quote_id?.toLowerCase().includes(term) ||
      r?.buyer?.name?.toLowerCase().includes(term) ||
      r?.buyer?.email?.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const renderStatus = (value) => {
    const palette = theme.palette;
    const map = {
      draft: { bg: palette.background.subtle, color: palette.text.secondary },
      submitted: { bg: palette.info.light, color: palette.info.dark },
      responded: { bg: palette.primary.light, color: palette.primary.dark },
      final_sent: { bg: palette.success.light, color: palette.success.dark },
      approved: { bg: palette.success.light, color: palette.success.dark },
      cancelled: { bg: palette.error.light, color: palette.error.dark },
    };
    const variant = map[value] || {
      bg: palette.background.elevated,
      color: palette.text.primary,
    };
    return (
      <Chip
        size="small"
        label={(value || "").replace("_", " ") || "unknown"}
        sx={{
          backgroundColor: variant.bg,
          color: variant.color,
          textTransform: "capitalize",
          fontWeight: 600,
        }}
      />
    );
  };

  return (
    <AdminLayout>
      <Box
        sx={{
          background: theme.palette.background.default,
          minHeight: "100vh",
          p: isMobile ? 1.5 : 2,
        }}
      >
        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={1.5}
          justifyContent="space-between"
          alignItems={isMobile ? "flex-start" : "center"}
          sx={{
            mb: 2,
            p: "5px 10px",
            background: theme.palette.background.paper,
            borderRadius: "4px",
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: "0 18px 44px rgba(4,6,8,0.45)",
          }}
        >
          <Stack
            spacing={1}
            direction={isMobile ? "column" : "row"}
            alignItems={isMobile ? "flex-start" : "center"}
          >
            <TextField
              size="small"
              label="Search by buyer or ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ minWidth: 220 }}
            />
            <TextField
              select
              size="small"
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={{ minWidth: 160 }}
            >
              {statusOptions.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>
                  {opt.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>
          <IconButton onClick={() => fetchRfqs(page)}>
            <RefreshIcon />
          </IconButton>
        </Stack>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        <TableContainer
          component={Paper}
          ref={containerRef}
          sx={{
            borderRadius: 1,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: "0 18px 44px rgba(4,6,8,0.4)",
            maxHeight: "75vh",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow sx={{ p: "2px 8px" }}>
                {[
                  "Trade Quote",
                  "Buyer",
                  "Items",
                  "Vendors",
                  "Status",
                  "Submitted",
                  "Action",
                ].map((h) => (
                  <TableCell
                    key={h}
                    sx={{
                      padding: "2px 8px",
                      fontWeight: 700,
                      background: theme.palette.background.elevated,
                    }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((rfq) => (
                <TableRow key={rfq?._id} hover>
                  <TableCell sx={{ padding: "2px 8px" }}>
                    <Typography sx={{ fontWeight: 700 }}>
                      {rfq?.trade_quote_id || rfq?._id}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: "2px 8px" }}>
                    <Typography sx={{ fontWeight: 600 }}>
                      {rfq?.buyer?.name || "-"}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: theme.palette.text.secondary }}
                    >
                      {rfq?.buyer?.email || ""}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ padding: "2px 8px" }}>
                    {rfq?.items_count || rfq?.items?.length || 0}
                  </TableCell>
                  <TableCell sx={{ padding: "2px 8px" }}>
                    {rfq?.vendor_quotes?.length ?? "-"}
                  </TableCell>
                  <TableCell sx={{ padding: "2px 8px" }}>
                    {renderStatus(rfq?.status)}
                  </TableCell>
                  <TableCell sx={{ padding: "2px 8px" }}>
                    {rfq?.submitted_at
                      ? dayjs(rfq.submitted_at).format("DD MMM YYYY, HH:mm")
                      : ""}
                  </TableCell>
                  <TableCell sx={{ padding: "2px 8px" }}>
                    <Button
                      size="small"
                      variant="contained"
                      endIcon={<ArrowForwardIcon />}
                      onClick={() => router.push(`/admin/rfqs/${rfq?._id}`)}
                      sx={{ textTransform: "none" }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
                    <Typography sx={{ color: theme.palette.text.secondary }}>
                      No RFQs found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Stack
          direction="row"
          spacing={1.5}
          justifyContent="flex-end"
          alignItems="center"
          sx={{ mt: 2 }}
        >
          <Button
            variant="outlined"
            disabled={page <= 1}
            onClick={() => fetchRfqs(page - 1)}
          >
            Prev
          </Button>
          <Typography>
            Page {page} / {totalPages}
          </Typography>
          <Button
            variant="outlined"
            disabled={page >= totalPages}
            onClick={() => fetchRfqs(page + 1)}
          >
            Next
          </Button>
        </Stack>
      </Box>
    </AdminLayout>
  );
}
