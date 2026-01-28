export async function getServerSideProps() {
  return {
    redirect: { destination: "/cart", permanent: false },
  };
}

export default function CartCopyRemoved() {
  return null;
}

/* REMOVED: legacy cart copy page

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Divider,
  Link,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from "@mui/material";
import { Add, Remove, Delete, ArrowBack } from "@mui/icons-material";
import Swal from "sweetalert2";
import {
  addToCart,
  removeFromCart,
  decreaseQty,
  clearCart,
} from "../store/cartSlice";
import { useRouter } from "next/router";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe(
  "pk_test_51SLeIK2MeiSSz0aav72m94WabLmdDA663EAuqeTyRoOkq8sneA3i2psD4UvlWHm61KpwN1U2nX0aSqx2zNKAySd600G8A7Cg2W"
);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#fff",
      "::placeholder": { color: "#888" },
      fontFamily: "Roboto, sans-serif",
    },
    invalid: { color: "#f44336" },
  },
};

function CheckoutForm({ clientSecret, onSuccess, onCancel }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!stripe || !elements) return;
    setLoading(true);
    const cardElement = elements.getElement(CardElement);
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: { name: "Test User" },
        },
      });
      if (result.error) {
        Swal.fire({
          icon: "error",
          title: "Payment failed",
          text: result.error.message || "Try again",
          confirmButtonColor: "#d33",
        });
      } else if (result.paymentIntent?.status === "succeeded") {
        onSuccess(result.paymentIntent);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Payment error",
        text: "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Box sx={{ mb: 2 }}>
        <Typography variant="body2" sx={{ mb: 1, color: "#ccc" }}>
          Use Stripe test card: <b>4242 4242 4242 4242</b> — any expiry, CVC,
          ZIP.
        </Typography>
        <Box
          sx={{
            border: "1px solid #555",
            borderRadius: 1,
            p: 2,
            background: "#1e1e1e",
          }}
        >
          <CardElement options={CARD_ELEMENT_OPTIONS} />
        </Box>
      </Box>
      <DialogActions sx={{ px: 0, justifyContent: "space-between" }}>
        <Button
          onClick={onCancel}
          disabled={loading}
          sx={{ color: "#fff", borderColor: "#555" }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleConfirm}
          disabled={loading || !stripe}
          sx={{ textTransform: "none" }}
        >
          {loading ? <CircularProgress size={20} /> : "Pay"}
        </Button>
      </DialogActions>
    </>
  );
}

*/

export default function CartCheckout() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const router = useRouter();

  const [openStripe, setOpenStripe] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [creating, setCreating] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const user = useSelector((state) => state.auth.user);
  const totalPrice = items.reduce(
    (acc, item) => acc + (item.price || 20) * (item.qty || 1),
    0
  );
  const totalWithShipping = totalPrice + 5;
  const amountInCents = Math.round(totalWithShipping * 100);
  const handleAuthButton = () => {
    if (user) dispatch(logout());
    else setAuthOpen(true);
  };
  useEffect(() => {
    document.body.style.backgroundColor = "#121212";
    document.body.style.color = "#fff";
    return () => {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
    };
  }, []);

  const handleOpenStripe = async () => {
    if (items.length === 0)
      return Swal.fire({
        icon: "info",
        title: "Cart empty",
        text: "Add items first.",
      });
    try {
      setCreating(true);
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInCents,
          currency: "usd",
          metadata: { items: items.length },
        }),
      });
      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Failed to create PaymentIntent");
      setClientSecret(data.clientSecret);
      setOpenStripe(true);
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Payment init failed",
        text: err.message || "Could not start payment.",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleSuccess = (paymentIntent) => {
    const orderId = `ORD-${Math.floor(100000 + Math.random() * 900000)}`;
    setOpenStripe(false);
    Swal.fire({
      title: "🎉 Purchase Successful!",
      html: `
        <div style="text-align:left; font-size:15px; line-height:1.6; color:black;">
          <b>Order ID:</b> ${orderId}<br/>
          <b>Items:</b> ${items.length}<br/>
          <b>Total:</b> $${totalWithShipping.toFixed(2)}<br/>
          <b>Payment:</b> Stripe (Test) - ${paymentIntent.id}<br/><br/>
          Your order will be delivered soon.<br/>
          Thank you for shopping with us!
        </div>
      `,
      icon: "success",
      confirmButtonText: "Continue Shopping",
      confirmButtonColor: "#1976d2",
    }).then(() => {
      dispatch(clearCart());
      setClientSecret(null);
      router.push("/");
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#121212", color: "#fff" }}>
      <header
        style={{
          background: "#1e1e1e",
          padding: "15px 30px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #333",
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, color: "#fff" }}>
          <Link
            href="/"
            underline="hover"
            sx={{ color: "#1976d2", fontWeight: 600 }}
          >
            <ArrowBack
              fontSize="small"
              sx={{
                color: "#fff",
                fontSize: "25px",
                verticalAlign: "bottom",
                background: "#b8b4b454",
                padding: "4px",
                borderRadius: "50%",
                marginRight: "8px !important",
              }}
            />
          </Link>
          NYPX
        </Typography>
      </header>

      <Typography
        variant="h4"
        sx={{ my: 3, textAlign: "center", fontWeight: 700 }}
      >
        🛒 Your Cart & Checkout
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
          mx: "auto",
          maxWidth: 1200,
        }}
      >
        {/* Cart Items */}
        <Box sx={{ flex: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {items.length === 0 ? (
            <Typography sx={{ textAlign: "center", mt: 4, color: "#aaa" }}>
              Your cart is empty 🛍️
            </Typography>
          ) : (
            items.map((item) => (
              <Paper
                key={`${item.upc}-${item.vendor}`}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "#1e1e1e",
                  "&:hover": { boxShadow: 5 },
                }}
              >
                <Box sx={{ flex: 2, minWidth: 180 }}>
                  <Typography variant="h6" sx={{ color: "#fff" }}>
                    {item.title}
                  </Typography>
                  <Typography sx={{ color: "#aaa", fontSize: 13 }}>
                    Vendor: {item.vendor}
                  </Typography>
                  <Typography sx={{ color: "#4caf50", fontWeight: 600 }}>
                    ${item.price?.toFixed(2) || 20}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    bgcolor: "#222",
                    p: "4px 10px",
                    borderRadius: 2,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => dispatch(decreaseQty(item))}
                    disabled={item.qty <= 1}
                    sx={{ color: "#fff" }}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                  <Typography
                    sx={{ minWidth: 25, textAlign: "center", color: "#fff" }}
                  >
                    {item.qty}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => dispatch(addToCart({ ...item, qty: 1 }))}
                    sx={{ color: "#fff" }}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </Box>
                <IconButton
                  onClick={() => dispatch(removeFromCart(item))}
                  sx={{ color: "#f44336" }}
                >
                  <Delete />
                </IconButton>
              </Paper>
            ))
          )}
        </Box>

        {/* Order Summary */}
        <Paper
          sx={{
            flex: 1,
            p: 3,
            borderRadius: 3,
            bgcolor: "#1e1e1e",
            minWidth: 280,
            position: { md: "sticky" },
            top: 24,
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: 600, color: "#fff" }}
          >
            Order Summary
          </Typography>
          <Divider sx={{ mb: 2, borderColor: "#fffafade" }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, color: "#fffafade" }}>
            <Typography>Items ({items.length})</Typography>
            <Typography>${totalPrice.toFixed(2)}</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, color: "#fffafade" }}>
            <Typography>Shipping</Typography>
            <Typography>$5.00</Typography>
          </Box>
          <Divider sx={{ mb: 2, borderColor: "#fffafade" }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
            <Typography variant="h6" sx={{ color: "#fff" }}>
              Total
            </Typography>
            <Typography variant="h6" sx={{ color: "#4caf50", fontWeight: 700 }}>
              ${totalWithShipping.toFixed(2)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            fullWidth
            onClick={handleOpenStripe}
            disabled={items.length === 0 || creating}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            {creating ? (
              <CircularProgress size={20} />
            ) : (
              "Pay with Stripe (Test)"
            )}
          </Button>
        </Paper>
      </Box>

      {/* Stripe Modal */}
      <Dialog
        open={openStripe}
        onClose={() => setOpenStripe(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { bgcolor: "#121212", color: "#fff" } }}
      >
        <DialogTitle sx={{ bgcolor: "#121212", color: "#fff" }}>
          Complete Payment
        </DialogTitle>
        <DialogContent sx={{ bgcolor: "#121212" }}>
          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret }}>
              <CheckoutForm
                clientSecret={clientSecret}
                onSuccess={handleSuccess}
                onCancel={() => setOpenStripe(false)}
              />
            </Elements>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
              <CircularProgress />
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}
