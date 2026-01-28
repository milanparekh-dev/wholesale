import { useState } from "react";
import {
  Paper,
  Typography,
  Divider,
  Box,
  TextField,
  useMediaQuery,
  Button,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";
import adminApi from "/src/utility/adminApi";

export default function CategoryEditPopUp({ product, close }) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [loading, setLoading] = useState(false);
  const [categoryName, setCategoryName] = useState(product?.name || "");
  const theme = useTheme();

  const addCategory = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", categoryName);
      const response = await adminApi.post(`/api/categories`, formData);
      if (response) {
        close();
        setCategoryName("");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to create category!"
      );
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async () => {
    if (!categoryName) {
      return toast.error("Category name cannot be empty!");
    }
    try {
      setLoading(true);
      const body = { name: categoryName };
      const response = await adminApi.put(
        `/api/categories/${product._id}`,
        body
      );
      if (response) {
        close();
        setCategoryName("");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to update category!"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        inset: 0,
        background: "rgba(4,6,8,0.75)",
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
          width: isMobile ? "95%" : "90%",
          maxWidth: 700,
          maxHeight: "90vh",
          overflowY: "auto",
          background: theme.palette.background.paper,
          p: isMobile ? 2 : 3,
          m: isMobile ? 2 : "auto",
          borderRadius: 3,
          animation: "scaleIn 0.3s ease",
          boxShadow: "0 20px 40px rgba(4,6,8,0.65)",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography
          sx={{
            color: theme.palette.text.primary,
            mb: 2,
            fontSize: 18,
            fontWeight: 600,
          }}
        >
          {product ? "Update" : "Add"} Category
        </Typography>

        <Divider sx={{ borderColor: theme.palette.divider, mb: 2 }} />

        <Typography sx={{ color: theme.palette.text.secondary, mb: 1 }}>
          Category Name
        </Typography>
        <TextField
          fullWidth
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              backgroundColor: theme.palette.background.subtle,
              "& fieldset": { borderColor: theme.palette.divider },
              "&:hover fieldset": { borderColor: theme.palette.primary.main },
              "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
              color: theme.palette.text.primary,
            },
            "& .MuiInputLabel-root": { color: theme.palette.text.secondary },
          }}
        />

        <Divider sx={{ borderColor: theme.palette.divider, mb: 2 }} />

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
            variant="contained"
            onClick={product ? updateCategory : addCategory}
            disabled={loading}
            sx={{
              background: theme.palette.primary.main,
              color: theme.palette.background.default,
              textTransform: "none",
              "&:hover": { background: theme.palette.primary.light },
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
    </Box>
  );
}
