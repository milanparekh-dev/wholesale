"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { toast } from "react-toastify";
import adminApi from "/src/utility/adminApi";
import dayjs from "dayjs";
import ThickCircleLoader from "/src/components/Loading";
import { useRouter } from "next/router";
import AdminLayout from "/src/components/AdminLayout";

export default function OrderPage() {
  const theme = useTheme();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const isMobile = useMediaQuery("(max-width:768px)");
  const containerRef = useRef(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await adminApi.get(
        "/api/admin/orders?status=&page=1&limit=-1",
      );
      if (response) setOrders(response?.data?.data || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to fetch orders!");
    } finally {
      setLoading(false);
    }
  };

  const sortOrders = (data) => {
    if (!sortBy) return data;
    const sorted = [...data].sort((a, b) => {
      if (sortBy === "created_asc")
        return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === "created_desc")
        return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === "confirmed_asc")
        return new Date(a.confirmed_at) - new Date(b.confirmed_at);
      if (sortBy === "confirmed_desc")
        return new Date(b.confirmed_at) - new Date(a.confirmed_at);
      return 0;
    });
    return sorted;
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = sortOrders(
    orders.filter((o) =>
      o?.order_number?.toLowerCase().includes(search.toLowerCase()),
    ),
  );

  return (
    <AdminLayout>
      <Box
        sx={{
          minHeight: "100vh",
          p: 2,
        }}
      >
        {loading ? (
          <ThickCircleLoader />
        ) : (
          <>
            {!isMobile ? (
              <TableContainer
                component={Paper}
                ref={containerRef}
                sx={{
                  background: "#0a0a0a",
                  borderRadius: "4px",
                  border: `1px solid ${theme.palette.divider}`,
                  maxHeight: "80vh",
                  overflowY: "auto",
                  mt: 0,
                  boxShadow: "0 20px 48px rgba(4,6,8,0.5)",
                }}
              >
                <Table stickyHeader>
                  <TableHead sx={{ background: "#0a0a0a" }}>
                    <TableRow>
                      {[
                        "Order Number",
                        "Status",
                        "Payment Status",
                        "Items",
                        "Total Amount",
                        "Confirmed On",
                        "Action",
                      ].map((h) => (
                        <TableCell
                          key={h}
                          sx={{
                            color: theme.palette.text.primary,
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
                    {filteredOrders.map((order) => (
                      <TableRow
                        key={order?._id}
                        sx={{
                          "&:hover": {
                            background: theme.palette.background.subtle,
                          },
                        }}
                      >
                        <TableCell sx={{ padding: "4px 8px" }}>
                          <Typography
                            sx={{
                              color: theme.palette.text.primary,
                              fontWeight: 600,
                            }}
                          >
                            {order?.order_number || "-"}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ padding: "4px 8px" }}>
                          <Box
                            sx={{
                              display: "inline-block",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              background:
                                order?.status === "confirmed"
                                  ? "#4caf5020"
                                  : "#ff980020",
                              color:
                                order?.status === "confirmed"
                                  ? "#4caf50"
                                  : "#ff9800",
                              fontSize: "12px",
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          >
                            {order?.status || "-"}
                          </Box>
                        </TableCell>

                        <TableCell sx={{ padding: "4px 8px" }}>
                          <Box
                            sx={{
                              display: "inline-block",
                              px: 1,
                              py: 0.5,
                              borderRadius: 1,
                              background:
                                order?.payment_status === "confirmed"
                                  ? "#2196f320"
                                  : "#f4433620",
                              color:
                                order?.payment_status === "confirmed"
                                  ? "#2196f3"
                                  : "#f44336",
                              fontSize: "12px",
                              fontWeight: 600,
                              textTransform: "capitalize",
                            }}
                          >
                            {order?.payment_status || "-"}
                          </Box>
                        </TableCell>

                        <TableCell sx={{ padding: "4px 8px" }}>
                          <Typography
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {order?.items_count || 0}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ padding: "4px 8px" }}>
                          <Typography
                            sx={{
                              color: theme.palette.text.primary,
                              fontWeight: 600,
                            }}
                          >
                            ${Number(order?.total_amount || 0).toFixed(2)}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ padding: "4px 8px" }}>
                          <Typography
                            sx={{ color: theme.palette.text.secondary }}
                          >
                            {order?.confirmed_at
                              ? dayjs(order.confirmed_at).format(
                                  "DD MMM YYYY hh:mm A",
                                )
                              : "-"}
                          </Typography>
                        </TableCell>

                        <TableCell sx={{ padding: "4px 8px" }}>
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<VisibilityIcon fontSize="small" />}
                            onClick={() => router.push(`/admin/orders/${order._id}`)}
                            sx={{
                              textTransform: "none",
                              background: theme.palette.primary.main,
                              "&:hover": {
                                background: theme.palette.primary.dark,
                              },
                            }}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Box sx={{ width: "100%", mt: 2 }}>
                <Box sx={{ maxHeight: "78vh", overflowY: "auto", pb: 2 }}>
                  {filteredOrders.map((order) => (
                    <Box
                      key={order?._id}
                      sx={{
                        background: theme.palette.background.paper,
                        padding: 2,
                        mb: 2,
                        borderRadius: "6px",
                        border: `1px solid ${theme.palette.divider}`,
                        boxShadow: "0 14px 36px rgba(4,6,8,0.45)",
                      }}
                    >
                      <Typography
                        sx={{
                          color: theme.palette.text.primary,
                          fontWeight: 600,
                        }}
                      >
                        {order?.order_number}
                      </Typography>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "12px",
                        }}
                      >
                        Status:{" "}
                        <Box
                          component="span"
                          sx={{
                            color:
                              order?.status === "confirmed"
                                ? "#4caf50"
                                : "#ff9800",
                            fontWeight: 600,
                          }}
                        >
                          {order?.status}
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "12px",
                        }}
                      >
                        Payment:{" "}
                        <Box
                          component="span"
                          sx={{
                            color:
                              order?.payment_status === "confirmed"
                                ? "#2196f3"
                                : "#f44336",
                            fontWeight: 600,
                          }}
                        >
                          {order?.payment_status}
                        </Box>
                      </Typography>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "12px",
                        }}
                      >
                        Items: {order?.items_count || 0} · Total: $
                        {Number(order?.total_amount || 0).toFixed(2)}
                      </Typography>
                      <Typography
                        sx={{
                          color: theme.palette.text.secondary,
                          fontSize: "12px",
                        }}
                      >
                        Confirmed:{" "}
                        {order?.confirmed_at
                          ? dayjs(order.confirmed_at).format(
                              "DD MMM YYYY hh:mm A",
                            )
                          : "-"}
                      </Typography>

                      <Box sx={{ mt: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          fullWidth
                          startIcon={<VisibilityIcon sx={{ fontSize: 14 }} />}
                          sx={{
                            textTransform: "none",
                            fontSize: "12px",
                            background: theme.palette.primary.main,
                          }}
                          onClick={() => router.push(`/orders/${order._id}`)}
                        >
                          View Details
                        </Button>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
          </>
        )}
      </Box>
    </AdminLayout>
  );
}
