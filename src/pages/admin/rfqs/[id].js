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
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import adminApi from "/src/utility/adminApi";
import AdminLayout from "/src/components/AdminLayout";

const badge = (status, theme) => {
  const palette = theme.palette;
  const map = {
    draft: { bg: palette.background.subtle, color: palette.text.secondary },
    submitted: { bg: palette.info.light, color: palette.info.dark },
    responded: { bg: palette.primary.light, color: palette.primary.dark },
    final_sent: { bg: palette.success.light, color: palette.success.dark },
    approved: { bg: palette.success.light, color: palette.success.dark },
    cancelled: { bg: palette.error.light, color: palette.error.dark },
  };
  const variant = map[status] || { bg: palette.background.elevated, color: palette.text.primary };
  return (
    <Chip
      size="small"
      label={(status || "").replace("_", " ") || "unknown"}
      sx={{ backgroundColor: variant.bg, color: variant.color, textTransform: "capitalize", fontWeight: 600 }}
    />
  );
};

export default function AdminRfqDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:900px)");

  const [rfq, setRfq] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) fetchDetail(id);
  }, [id]);

  const fetchDetail = async (rfqId) => {
    try {
      setLoading(true);
      const res = await adminApi.get(`/api/admin/rfqs/${rfqId}`);
      const data = res?.data || res?.data?.data || {};
      setRfq(data?.rfq || data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to load RFQ detail");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{ minHeight: "100vh", background: theme.palette.background.default, color: theme.palette.text.primary, p: isMobile ? 2 : 4 }}>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/admin/rfqs")}>Back</Button>
          <Typography variant="h5" sx={{ fontWeight: 800 }}>RFQ Detail</Typography>
        </Stack>

        {loading && <LinearProgress sx={{ mb: 2 }} />}

        {!loading && rfq && (
          <Stack spacing={2}>
            <Card sx={{ border: `1px solid ${theme.palette.divider}` }}>
              <CardContent>
                <Stack direction={isMobile ? "column" : "row"} spacing={1} justifyContent="space-between" alignItems={isMobile ? "flex-start" : "center"}>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 800 }}>Trade Quote {rfq?.trade_quote_id || rfq?._id}</Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Submitted {rfq?.submitted_at ? dayjs(rfq.submitted_at).format("DD MMM YYYY, HH:mm") : ""}
                    </Typography>
                  </Box>
                  {badge(rfq?.status, theme)}
                </Stack>
              </CardContent>
            </Card>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Card sx={{ border: `1px solid ${theme.palette.divider}` }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Buyer</Typography>
                    <Typography sx={{ fontWeight: 700 }}>{rfq?.buyer?.name || "-"}</Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>{rfq?.buyer?.email || ""}</Typography>
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>{rfq?.buyer?.phone || rfq?.buyer?.mobile || ""}</Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={6}>
                <Card sx={{ border: `1px solid ${theme.palette.divider}` }}>
                  <CardContent>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Meta</Typography>
                    <Typography variant="body2">Items: {rfq?.items?.length || rfq?.items_count || 0}</Typography>
                    <Typography variant="body2">Vendors: {rfq?.vendor_quotes?.length || 0}</Typography>
                    <Typography variant="body2">Created: {rfq?.created_at ? dayjs(rfq.created_at).format("DD MMM YYYY, HH:mm") : ""}</Typography>
                    <Typography variant="body2">Updated: {rfq?.updated_at ? dayjs(rfq.updated_at).format("DD MMM YYYY, HH:mm") : ""}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            <Card sx={{ border: `1px solid ${theme.palette.divider}` }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Items</Typography>
                <Grid container spacing={2}>
                  {(rfq?.items || []).map((item) => (
                    <Grid item xs={12} md={6} key={item?._id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography sx={{ fontWeight: 700 }}>{item?.title || item?.upc}</Typography>
                          <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>UPC {item?.upc}</Typography>
                          <Typography variant="body2">Qty {item?.qty}</Typography>
                          {(item?.vendor_options || []).length > 0 && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>Vendor options</Typography>
                              <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                                {item.vendor_options.map((opt, idx) => (
                                  <Typography key={idx} variant="body2" sx={{ color: theme.palette.text.secondary }}>
                                    {opt?.name || opt?.vendor_source_name || "Vendor"}: ${opt?.price} · Qty {opt?.qty}
                                  </Typography>
                                ))}
                              </Stack>
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                  {(rfq?.items || []).length === 0 && (
                    <Grid item xs={12}>
                      <Typography sx={{ color: theme.palette.text.secondary }}>No items found.</Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>

            <Card sx={{ border: `1px solid ${theme.palette.divider}` }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>Vendor quotes</Typography>
                <Stack spacing={2}>
                  {(rfq?.vendor_quotes || []).map((vq) => (
                    <Card key={vq?._id} variant="outlined">
                      <CardContent>
                        <Stack direction={isMobile ? "column" : "row"} justifyContent="space-between" spacing={1} alignItems={isMobile ? "flex-start" : "center"}>
                          <Box>
                            <Typography sx={{ fontWeight: 700 }}>Vendor: {vq?.vendor_source_name || vq?.vendor_name || vq?.vendor_user_id}</Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                              Payment: {vq?.payment_terms || "n/a"} · Discount: {vq?.discount_percent || 0}%
                            </Typography>
                            <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                              Validity: {vq?.validity_period_hours ? `${vq.validity_period_hours} hrs` : "n/a"}
                            </Typography>
                          </Box>
                          {badge(vq?.status, theme)}
                        </Stack>
                        <Divider sx={{ my: 1 }} />
                        <Grid container spacing={1}>
                          {(vq?.items || []).map((line) => (
                            <Grid item xs={12} md={6} key={line?._id}>
                              <Card variant="outlined">
                                <CardContent>
                                  <Typography sx={{ fontWeight: 700 }}>{line?.sku || "Item"}</Typography>
                                  <Typography variant="body2">Requested: {line?.qty_requested}</Typography>
                                  <Typography variant="body2">Available: {line?.qty_available}</Typography>
                                  <Typography variant="body2">Approved: {line?.qty_approved}</Typography>
                                  <Typography variant="body2">Price: {line?.unit_price ? `$${Number(line.unit_price).toFixed(2)}` : "n/a"}</Typography>
                                  <Typography variant="body2">Status: {line?.status}</Typography>
                                  {line?.rejection_reason && (
                                    <Typography variant="body2" sx={{ color: theme.palette.error.main }}>
                                      Reason: {line.rejection_reason}
                                    </Typography>
                                  )}
                                </CardContent>
                              </Card>
                            </Grid>
                          ))}
                          {(vq?.items || []).length === 0 && (
                            <Grid item xs={12}>
                              <Typography sx={{ color: theme.palette.text.secondary }}>No quote items.</Typography>
                            </Grid>
                          )}
                        </Grid>
                      </CardContent>
                    </Card>
                  ))}
                  {(rfq?.vendor_quotes || []).length === 0 && (
                    <Typography sx={{ color: theme.palette.text.secondary }}>No vendor quotes.</Typography>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        )}
      </Box>
    </AdminLayout>
  );
}
