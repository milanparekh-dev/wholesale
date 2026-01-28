import { useState } from "react";
import {
  Paper,
  Typography,
  Divider,
  Box,
  TextField,
  useMediaQuery,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useTheme,
} from "@mui/material";
import { toast } from "react-toastify";
import adminApi from "/src/utility/adminApi";

export default function BuyerEditPopUp({ product, close }) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const [loading, setLoading] = useState(false);
  const [brandName, setBrandName] = useState(product?.name || "");
  const [membership, setMembership] = useState(
    product?.membership_level || "wholesale"
  );
  const theme = useTheme();

  const memberOptions = ["wholesale", "standard", "premium"];

  const addCategory = async () => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", brandName);
      formData.append("membership_level", membership);

      const response = await adminApi.post(
        `/api/edit-user/${product?._id}`,
        formData
      );

      if (response) {
        close();
        setBrandName("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to create buyer!");
    } finally {
      setLoading(false);
    }
  };

  const updateCategory = async () => {
    if (!brandName) {
      return toast.error("Buyer name cannot be empty!");
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", brandName);
      formData.append("membership_level", membership);
      const response = await adminApi.post(
        `/api/edit-user/${product._id}`,
        formData
      );

      if (response) {
        close();
        setBrandName("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update buyer!");
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
          background: theme.palette.background.paper,
          p: isMobile ? 2 : 3,
          borderRadius: 3,
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
          {product ? "Update" : "Add"} Buyer
        </Typography>

        <Divider sx={{ borderColor: theme.palette.divider, mb: 2 }} />

        {/* Buyer Name */}
        <Typography sx={{ color: theme.palette.text.secondary, mb: 1 }}>
          Buyer Name
        </Typography>
        <TextField
          fullWidth
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
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

        {/* Membership Select */}
        <FormControl
          fullWidth
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              backgroundColor: theme.palette.background.subtle,
              "& fieldset": { borderColor: theme.palette.divider },
              "&:hover fieldset": { borderColor: theme.palette.primary.main },
              "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
              color: theme.palette.text.primary,
            },
            "& .MuiSvgIcon-root": { color: theme.palette.text.secondary },
          }}
        >
          <InputLabel sx={{ color: theme.palette.text.secondary }}>
            Membership
          </InputLabel>
          <Select
            value={membership}
            label="Membership"
            onChange={(e) => setMembership(e.target.value)}
          >
            {memberOptions.map((m) => (
              <MenuItem key={m} value={m}>
                {m}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider sx={{ borderColor: theme.palette.divider, mb: 2 }} />

        {/* Actions */}
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
      </Paper>
    </Box>
  );
}
