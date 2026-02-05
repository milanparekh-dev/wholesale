"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import adminApi from "/src/utility/adminApi";
import { useRouter } from "next/router";
import AdminLayout from "/src/components/AdminLayout";

/* ================= STATUS CHIP ================= */
const StatusChip = ({ status, type = "default" }) => {
  const getColor = () => {
    if (type === "payment") {
      return status === "confirmed"
        ? "success"
        : status === "pending"
          ? "warning"
          : "error";
    }
    return status === "confirmed"
      ? "success"
      : status === "pending"
        ? "warning"
        : "info";
  };

  return (
    <Chip
      label={(status || "unknown").replaceAll("_", " ")}
      color={getColor()}
      size="small"
      sx={{
        textTransform: "capitalize",
        fontWeight: 600,
        fontSize: 12,
      }}
    />
  );
};

export default function OrderDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) fetchOrderDetail(id);
  }, [id]);

  const fetchOrderDetail = async (orderId) => {
    try {
      setLoading(true);
      const res = await adminApi.get(`/api/admin/orders/${orderId}`);
      setOrder(res?.data?.data?.order || res?.data?.order || res?.data || null);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to load order details",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      {loading && <LinearProgress />}

      {!loading && order && (
          <Stack spacing={3}>
            {/* ================= ORDER SUMMARY ================= */}
            <Card sx={{ background: "#0a0a0a" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={800} mb={2}>
                  Order Summary
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Order Number
                    </Typography>
                    <Typography fontWeight={700}>
                      {order?.order_number || "-"}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Status
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <StatusChip status={order?.status} />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Payment Status
                    </Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <StatusChip
                        status={order?.payment_status}
                        type="payment"
                      />
                    </Box>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Items Count
                    </Typography>
                    <Typography fontWeight={700}>
                      {order?.items_count || 0}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Confirmed At
                    </Typography>
                    <Typography fontWeight={600}>
                      {order?.confirmed_at
                        ? dayjs(order.confirmed_at).format("DD MMM YYYY, HH:mm")
                        : "-"}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Created At
                    </Typography>
                    <Typography fontWeight={600}>
                      {order?.created_at
                        ? dayjs(order.created_at).format("DD MMM YYYY, HH:mm")
                        : "-"}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Updated At
                    </Typography>
                    <Typography fontWeight={600}>
                      {order?.updated_at
                        ? dayjs(order.updated_at).format("DD MMM YYYY, HH:mm")
                        : "-"}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* ================= FINANCIAL DETAILS ================= */}
            <Card sx={{ background: "#0a0a0a" }}>
              <CardContent>
                <Typography variant="h6" fontWeight={800} mb={2}>
                  Financial Details
                </Typography>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Subtotal
                    </Typography>
                    <Typography fontWeight={700} fontSize={18}>
                      ${Number(order?.subtotal || 0).toFixed(2)}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Discount
                    </Typography>
                    <Typography
                      fontWeight={700}
                      fontSize={18}
                      color="success.main"
                    >
                      -${Number(order?.discount_amount || 0).toFixed(2)}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Credits Reserved
                    </Typography>
                    <Typography fontWeight={700} fontSize={18}>
                      ${Number(order?.credits_reserved || 0).toFixed(2)}
                    </Typography>
                  </Grid>

                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="body2" color="text.secondary">
                      Credits Charged
                    </Typography>
                    <Typography
                      fontWeight={700}
                      fontSize={18}
                      color="error.main"
                    >
                      ${Number(order?.credits_charged || 0).toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 2 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Typography variant="h6" color="text.secondary">
                      Total Amount
                    </Typography>
                    <Typography
                      fontWeight={800}
                      fontSize={24}
                      color="primary.main"
                    >
                      ${Number(order?.total_amount || 0).toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* ================= METADATA ================= */}
            {order?.metadata && (
              <Card sx={{ background: "#0a0a0a" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={800} mb={2}>
                    Additional Information
                  </Typography>

                  <Grid container spacing={2}>
                    {order?.metadata?.trade_quote_id && (
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Trade Quote ID
                        </Typography>
                        <Typography fontWeight={600}>
                          {order.metadata.trade_quote_id}
                        </Typography>
                      </Grid>
                    )}

                    {order?.metadata?.vendor_quote_number && (
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          Vendor Quote Number
                        </Typography>
                        <Typography fontWeight={600}>
                          {order.metadata.vendor_quote_number}
                        </Typography>
                      </Grid>
                    )}

                    {order?.rfq_id && (
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="body2" color="text.secondary">
                          RFQ ID
                        </Typography>
                        <Typography fontWeight={600}>{order.rfq_id}</Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            )}

            {/* ================= ORDER ITEMS ================= */}
            {order?.items && order.items.length > 0 && (
              <Card sx={{ background: "#0a0a0a" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={800} mb={2}>
                    Order Items
                  </Typography>

                  <TableContainer
                    component={Paper}
                    sx={{
                      background: "#121212",
                      maxHeight: 400,
                      overflowY: "auto",
                    }}
                  >
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          {[
                            "Item",
                            "UPC",
                            "SKU",
                            "Quantity",
                            "Unit Price",
                            "Discount",
                            "Subtotal",
                            "Total",
                            "Status",
                          ].map((h) => (
                            <TableCell
                              key={h}
                              sx={{
                                background: "#1a1a1a",
                                color: "text.primary",
                                fontWeight: 700,
                                padding: "4px 8px",
                              }}
                            >
                              {h}
                            </TableCell>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {order.items.map((item, idx) => (
                          <TableRow key={item?._id || idx}>
                            <TableCell sx={{ padding: "4px 8px" }}>
                              <Typography fontWeight={600}>
                                {item?.title || "-"}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ padding: "4px 8px" }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {item?.upc || "-"}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ padding: "4px 8px" }}>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {item?.sku || "-"}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ padding: "4px 8px" }}>
                              <Typography fontWeight={600}>
                                {item?.qty_ordered || 0}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ padding: "4px 8px" }}>
                              <Typography>
                                ${Number(item?.unit_price || 0).toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ padding: "4px 8px" }}>
                              <Typography color="success.main" fontWeight={600}>
                                {item?.discount_percent || 0}%
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ padding: "4px 8px" }}>
                              <Typography>
                                ${Number(item?.subtotal || 0).toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ padding: "4px 8px" }}>
                              <Typography fontWeight={700}>
                                ${Number(item?.total_amount || 0).toFixed(2)}
                              </Typography>
                            </TableCell>
                            <TableCell sx={{ padding: "4px 8px" }}>
                              <StatusChip status={item?.status} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            )}
          </Stack>
      )}
    </AdminLayout>
  );
}
