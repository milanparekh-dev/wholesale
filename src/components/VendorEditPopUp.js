import { useState } from "react";
import {
  Paper,
  Typography,
  Divider,
  Box,
  TextField,
  useMediaQuery,
  Button,
} from "@mui/material";
import { toast } from "react-toastify";
import adminApi from "/src/utility/adminApi";

export default function BrandEditPopUp({ product, close }) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [loading, setLoading] = useState(false);
  const [brandName, setBrandName] = useState(product?.name || "");

  const addCategory = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", brandName);
      const response = await adminApi.post(`/api/vendors`, formData);
      if (response) {
        close();
        setBrandName("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create vendor!");
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async () => {
    try {
      setLoading(true);
      const body = { name: brandName };
      const response = await adminApi.put(`/api/vendors/${product._id}`, body);
      if (response) {
        close();
        setBrandName("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update vendor!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.25)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
        backdropFilter: "blur(3px)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: isMobile ? "95%" : "90%",
          maxWidth: 700,
          maxHeight: "90vh",
          overflowY: "auto",
          background: "#fff",
          p: isMobile ? 2 : 3,
          m: isMobile ? 2 : "auto",
          borderRadius: 3,
          animation: "scaleIn 0.3s ease",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        }}
      >
        <Typography sx={{ color: "#121212", mb: 2, fontSize: 18, fontWeight: 600 }}>
          {product ? "Update" : "Add"} Vendor
        </Typography>

        <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", mb: 2 }} />

        <Typography sx={{ color: "#121212", mb: 1 }}>Vendor Name</Typography>
        <TextField
          fullWidth
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              backgroundColor: "#f9f9f9",
              "& fieldset": { borderColor: "#ccc" },
              "&:hover fieldset": { borderColor: "#999" },
              "&.Mui-focused fieldset": { borderColor: "#673ab7" },
              color: "#121212",
            },
            "& .MuiInputLabel-root": { color: "#555" },
          }}
        />

        <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", mb: 2 }} />

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button
            variant="outlined"
            onClick={close}
            sx={{
              color: "#121212",
              borderColor: "#ccc",
              textTransform: "none",
              "&:hover": { borderColor: "#673ab7", color: "#673ab7" },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={product ? updateCategory : addCategory}
            disabled={loading}
            sx={{
              background: "#673ab7",
              textTransform: "none",
              "&:hover": { background: "#5b33a8" },
            }}
          >
            {product ? "Update" : "Add"}
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
    </div>
  );
}
