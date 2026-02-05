import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Divider,
  Link,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import { Add, Remove, Delete, ArrowBack } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import Swal from "sweetalert2";
import {
  addToCart,
  removeFromCart,
  decreaseQty,
  clearCart,
} from "../store/cartSlice";
import { toast } from "react-toastify";
import adminApi from "../utility/adminApi";
import { DEFAULT_PRODUCT_IMAGE } from "../utility/constants";

export default function CartCheckout() {
  const theme = useTheme();
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:600px)");
  const [loadingQuote, setLoadingQuote] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("api_token");
    router.push("/login");
  };

  const totalPrice = items.reduce(
    (acc, item) => acc + (item.price || 20) * (item.qty || 1),
    0
  );
  const totalWithShipping = totalPrice + 5;

  useEffect(() => {
    const originalBg = document.body.style.backgroundColor;
    const originalColor = document.body.style.color;
    document.body.style.backgroundColor = theme.palette.background.default;
    document.body.style.color = theme.palette.text.primary;
    return () => {
      document.body.style.backgroundColor = originalBg;
      document.body.style.color = originalColor;
    };
  }, [theme.palette.background.default, theme.palette.text.primary]);

  const handleRequestQuote = async () => {
    if (items.length === 0) {
      return Swal.fire({
        icon: "info",
        title: "Cart is empty",
        text: "Please add items first.",
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
        confirmButtonColor: theme.palette.primary.main,
      });
    }

    setLoadingQuote(true);
    try {
      let customerData;

      const token = localStorage.getItem("api_token");
      if (token) {
        // User is logged in, fetch user data
        try {
          const res = await adminApi.get("/api/user-me");
          const user = res.data || {};
          customerData = {
            name: user.name || "",
            email: user.email || "",
            company: "",
            phone: user.phone || "",
            note: "",
          };
        } catch (error) {
          // If fetching user data fails, fall back to popup
          console.error("Failed to fetch user data:", error);
        }
      }

      if (!customerData) {
        // Not logged in or failed to fetch, show popup
        const result = await Swal.fire({
          title: "Send Quote",
          html:
            '<input id="q_name" class="swal2-input" placeholder="Your name" />' +
            '<input id="q_email" class="swal2-input" placeholder="Your email" type="email" />' +
            '<input id="q_company" class="swal2-input" placeholder="Company (optional)" />' +
            '<input id="q_phone" class="swal2-input" placeholder="Phone (optional)" />' +
            '<textarea id="q_note" class="swal2-textarea" placeholder="Note (optional)"></textarea>',
          focusConfirm: false,
          showCancelButton: true,
          confirmButtonText: "Send",
          cancelButtonText: "Cancel",
          confirmButtonColor: theme.palette.primary.main,
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          preConfirm: () => {
            const name = document.getElementById("q_name")?.value?.trim();
            const email = document.getElementById("q_email")?.value?.trim();
            const company = document.getElementById("q_company")?.value?.trim();
            const phone = document.getElementById("q_phone")?.value?.trim();
            const note = document.getElementById("q_note")?.value?.trim();

            if (!name) {
              Swal.showValidationMessage("Name is required");
              return;
            }
            if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
              Swal.showValidationMessage("Valid email is required");
              return;
            }
            return { name, email, company, phone, note };
          },
        });

        if (!result.isConfirmed) return;
        customerData = result.value;
      }
      // For logged in users, customerData is already set, proceed to send

      const res = await fetch("/api/send-quote-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: customerData, items }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.message || "Unable to send quote!");
      }

      Swal.fire({
        title: "Sent ✅",
        text: "Your quote has been emailed successfully.",
        icon: "success",
        confirmButtonColor: theme.palette.primary.main,
        background: theme.palette.background.paper,
        color: theme.palette.text.primary,
      }).then(() => {
        dispatch(clearCart());
        router.push("/");
      });
    } catch (error) {
      toast.error(error?.message || "Unable to send quote!");
    } finally {
      setLoadingQuote(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: theme.palette.background.default,
        color: theme.palette.text.primary,
        pb: 4,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: theme.palette.background.paper,
          padding: isMobile ? "10px 15px" : "15px 70px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 18px 36px rgba(4,6,8,0.4)",
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Typography variant={isMobile ? "h6" : "h5"} sx={{ fontWeight: 700 }}>
          <Link
            href="/"
            underline="none"
            sx={{
              display: "flex",
              alignItems: "center",
              color: theme.palette.text.primary,
            }}
          >
            <ArrowBack
              fontSize="small"
              sx={{
                fontSize: isMobile ? "21px" : "25px",
                background: theme.palette.background.elevated,
                padding: "4px",
                borderRadius: "50%",
                marginRight: "8px",
                cursor: "pointer",
              }}
            />
            Wholesale Leville Inc.
          </Link>
        </Typography>
        <IconButton onClick={handleLogout} sx={{ color: theme.palette.text.primary }}>
          <LogoutIcon />
        </IconButton>
      </Box>

      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{ my: 3, textAlign: "center", fontWeight: 700 }}
      >
        🛒 Your Cart
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 3,
          mx: "auto",
          maxWidth: 1200,
          px: isMobile ? 2 : 0,
        }}
      >
        {/* Cart Items */}
        <Box sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {items.length === 0 ? (
            <Typography
              sx={{
                textAlign: "center",
                mt: 4,
                color: theme.palette.text.secondary,
              }}
            >
              Your cart is empty 🛍️
            </Typography>
          ) : (
            items.map((item) => (
              <Paper
                key={`${item.upc}-${item.vendor}`}
                sx={{
                  display: "flex",
                  flexDirection: isMobile ? "column" : "row",
                  justifyContent: "space-between",
                  alignItems: isMobile ? "flex-start" : "center",
                  p: 2,
                  borderRadius: "4px",
                  bgcolor: theme.palette.background.paper,
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: "0 14px 40px rgba(4,6,8,0.45)",
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: "0 22px 46px rgba(4,6,8,0.55)",
                    borderColor: theme.palette.primary.main,
                  },
                }}
              >
                <Box
                  sx={{
                    flex: 2,
                    minWidth: 180,
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <img
                    src={item.image || DEFAULT_PRODUCT_IMAGE}
                    width={45}
                    height={45}
                    style={{ borderRadius: 4, objectFit: "cover" }}
                  />
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {item.title}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: 13,
                        color: theme.palette.success.main,
                        fontWeight: 600,
                      }}
                    >
                      ${item.price?.toFixed(2) || 20}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1, mt: isMobile ? 2 : 0 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      bgcolor: theme.palette.background.subtle,
                      p: "4px 10px",
                      borderRadius: "8px",
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => dispatch(decreaseQty(item))}
                      disabled={item.qty <= 1}
                    >
                      <Remove />
                    </IconButton>
                    <Typography sx={{ minWidth: 25, textAlign: "center" }}>
                      {item.qty}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => dispatch(addToCart({ ...item, qty: 1 }))}
                    >
                      <Add />
                    </IconButton>
                  </Box>

                  <IconButton
                    onClick={() => dispatch(removeFromCart(item))}
                    sx={{ color: theme.palette.error.main }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Paper>
            ))
          )}
        </Box>

        {/* Order Summary */}
        <Paper
          sx={{
            flex: 1,
            p: 3,
            borderRadius: "12px",
            bgcolor: theme.palette.background.paper,
            boxShadow: "0 18px 44px rgba(4,6,8,0.5)",
            border: `1px solid ${theme.palette.divider}`,
            minWidth: 280,
            position: { md: "sticky" },
            top: { md: 24 },
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Order Summary
          </Typography>
          <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography>Items ({items.length})</Typography>
            <Typography>${totalPrice.toFixed(2)}</Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography>Shipping</Typography>
            <Typography>$5.00</Typography>
          </Box>

          <Divider sx={{ mb: 2, borderColor: theme.palette.divider }} />

          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h6">Total</Typography>
            <Typography
              variant="h6"
              sx={{ color: theme.palette.success.main, fontWeight: 700 }}
            >
              ${totalWithShipping.toFixed(2)}
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            onClick={handleRequestQuote}
            disabled={loadingQuote}
            sx={{
              textTransform: "none",
              borderRadius: "10px",
              bgcolor: theme.palette.primary.main,
              "&:hover": { bgcolor: theme.palette.primary.light },
              fontWeight: 600,
            }}
          >
            {loadingQuote ? <CircularProgress size={20} color="inherit" /> : "Request Quote"}
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
