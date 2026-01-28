import { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import {
  Paper,
  Typography,
  Button,
  Divider,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

export default function VendorPopup({ product, close }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [selectedQty, setSelectedQty] = useState("1");
  const isMobile = useMediaQuery("(max-width:600px)");
  const [enlargeImg, setEnlargeImg] = useState(false);
  const theme = useTheme();

  const availableVendors = product.vendors || [];
  const totalQty = availableVendors.reduce((sum, v) => sum + (Number(v.qty) || 0), 0);
  const lowestPrice = Math.min(
    ...availableVendors.map((v) => Number(v.price) || 0)
  );

  const handleQtyBlur = () => {
    let num = parseInt(selectedQty);
    if (!num || num < 1) num = 1;
    if (num > totalQty) num = totalQty;
    setSelectedQty(num.toString());
  };

  const handleAddToCart = () => {
    const numQty = parseInt(selectedQty);
    if (numQty > totalQty) {
      alert(`Only ${totalQty} available`);
      return;
    }

    dispatch(
      addToCart({
        upc: product.upc,
        title: product.title,
        brand: product.brand,
        sku:
          product.vendors && product.vendors.length
            ? product.vendors[0].sku
            : "",
        vendor_name:
          product.vendors && product.vendors.length
            ? product.vendors[0].name
            : "",
        qty: numQty,
        price: lowestPrice,
      })
    );
    toast.success("Added to cart");
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        background: "rgba(4, 6, 8, 0.75)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(6px)",
        color: theme.palette.text.primary,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: isMobile ? "95%" : "80%",
          maxWidth: 700,
          maxHeight: "90vh",
          overflowY: "auto",
          background: theme.palette.background.paper,
          p: isMobile ? 2 : 3,
          borderRadius: "4px",
          animation: "scaleIn 0.3s ease",
          boxShadow: "0 20px 40px rgba(4,6,8,0.65)",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* Top Section */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            mb: 2,
            alignItems: isMobile ? "center" : "flex-start",
          }}
        >
          <img
            src={product.image || "https://via.placeholder.com/120"}
            alt={product.title}
            style={{
              width: isMobile ? 140 : 120,
              height: isMobile ? 140 : 120,
              objectFit: "cover",
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              cursor: "pointer",
            }}
            onClick={() => setEnlargeImg(true)}
          />

          {/* Image Enlarge Dialog */}
          <Dialog open={enlargeImg} onClose={() => setEnlargeImg(false)} maxWidth="md">
            <DialogContent
              sx={{
                background: theme.palette.background.paper,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <img
                src={product.image || "https://via.placeholder.com/120"}
                alt={product.title}
                style={{
                  maxWidth: "80vw",
                  maxHeight: "80vh",
                  borderRadius: 4,
                  boxShadow: "0 12px 30px rgba(4,6,8,0.65)",
                }}
              />
            </DialogContent>
          </Dialog>

          <Box sx={{ textAlign: isMobile ? "center" : "left" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: isMobile ? 16 : 18 }}>
              {product.title}
            </Typography>
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: isMobile ? 12 : 14 }}>
              Brand: {product.brand} | Category: {product.category}
            </Typography>
            <Button
              variant="outlined"
              sx={{
                mt: 1,
                textTransform: "none",
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
                "&:hover": { borderColor: theme.palette.primary.light, color: theme.palette.primary.light },
                fontSize: isMobile ? 12 : 14,
              }}
              onClick={() => alert("Report Submitted")}
            >
              Report Product
            </Button>
          </Box>
        </Box>

        <Divider sx={{ borderColor: theme.palette.divider, mb: 2 }} />

        {/* Vendor Table */}
        {!isMobile ? (
          <TableContainer
            component={Paper}
            sx={{
              background: theme.palette.background.subtle,
              borderRadius: "4px",
              border: `1px solid ${theme.palette.divider}`,
              mb: 2,
            }}
          >
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: theme.palette.text.secondary }}>Price</TableCell>
                  <TableCell sx={{ color: theme.palette.text.secondary }}>Available</TableCell>
                  <TableCell sx={{ color: theme.palette.text.secondary }}>Qty</TableCell>
                  <TableCell sx={{ color: theme.palette.text.secondary }}>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>${lowestPrice.toFixed(2)}</TableCell>
                  <TableCell sx={{ color: theme.palette.success.main }}>{totalQty}</TableCell>
                  <TableCell>
                    <TextField
                      type="text"
                      value={selectedQty}
                      onChange={(e) => setSelectedQty(e.target.value)}
                      onBlur={handleQtyBlur}
                      size="small"
                      sx={{
                        width: 70,
                        "& input": {
                          color: theme.palette.text.primary,
                          borderRadius: "4px",
                          padding: "6px",
                          background: theme.palette.background.paper,
                        },
                        "& .MuiOutlinedInput-root": {
                          background: theme.palette.background.paper,
                        },
                        "& fieldset": { borderColor: theme.palette.divider },
                        "&:hover fieldset": { borderColor: theme.palette.primary.main },
                        "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleAddToCart}
                      sx={{
                        textTransform: "none",
                        background: theme.palette.primary.main,
                        color: theme.palette.background.default,
                        "&:hover": { background: theme.palette.primary.light },
                      }}
                    >
                      Add
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box
            sx={{
              background: theme.palette.background.subtle,
              p: 2,
              borderRadius: "4px",
              border: `1px solid ${theme.palette.divider}`,
              mb: 2,
            }}
          >
            <Typography sx={{ fontSize: 14, mb: 1 }}>
              Price: <strong>${lowestPrice.toFixed(2)}</strong>
            </Typography>
            <Typography sx={{ color: theme.palette.success.main, fontSize: 14, mb: 1 }}>
              Available: <strong>{totalQty}</strong>
            </Typography>

            <TextField
              type="text"
              value={selectedQty}
              onChange={(e) => setSelectedQty(e.target.value)}
              onBlur={handleQtyBlur}
              size="small"
              fullWidth
              sx={{
                mb: 2,
                "& input": {
                  color: theme.palette.text.primary,
                  borderRadius: "4px",
                  padding: "6px",
                  background: theme.palette.background.paper,
                },
                "& fieldset": { borderColor: theme.palette.divider },
                "&:hover fieldset": { borderColor: theme.palette.primary.main },
                "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
              }}
            />

            <Button
              fullWidth
              variant="contained"
              onClick={handleAddToCart}
              sx={{
                background: theme.palette.primary.main,
                textTransform: "none",
                fontSize: 13,
                color: theme.palette.background.default,
                "&:hover": { background: theme.palette.primary.light },
              }}
            >
              Add to Cart
            </Button>
          </Box>
        )}

        {/* Footer Actions */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="outlined"
            onClick={close}
            sx={{
              color: theme.palette.text.secondary,
              borderColor: theme.palette.divider,
              textTransform: "none",
              "&:hover": {
                borderColor: theme.palette.primary.main,
                color: theme.palette.primary.main,
              },
            }}
          >
            Cancel
          </Button>

          <Button
            onClick={() => {
              handleAddToCart();
              router.push("/cart");
            }}
            sx={{
              background: theme.palette.secondary.main,
              color: theme.palette.background.default,
              textTransform: "none",
              borderRadius: "4px",
              "&:hover": { background: theme.palette.secondary.light },
            }}
          >
            Request Quote
          </Button>
        </Box>

        <style jsx global>{`
          @keyframes scaleIn {
            from {
              transform: scale(0.95);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
      </Paper>
    </Box>
  );
}
