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

const MEMBERSHIP_OPTIONS = [
  { value: "wholesale", label: "Wholesale" },
  { value: "silver",    label: "Silver"    },
  { value: "gold",      label: "Gold"      },
  { value: "platinum",  label: "Platinum"  },
  { value: "vip",       label: "VIP"       },
];

export default function BuyerEditPopUp({ product, close }) {
  const isMobile = useMediaQuery("(max-width:600px)");
  const theme = useTheme();

  const [loading, setLoading] = useState(false);
  const [buyerName, setBuyerName] = useState(product?.name || "");
  const [membership, setMembership] = useState(
    product?.membership_level || "wholesale"
  );

  const inputSx = {
    mb: 2,
    "& .MuiOutlinedInput-root": {
      backgroundColor: theme.palette.background.subtle,
      color: theme.palette.text.primary,
      "& fieldset": { borderColor: theme.palette.divider },
      "&:hover fieldset": { borderColor: theme.palette.primary.main },
      "&.Mui-focused fieldset": { borderColor: theme.palette.primary.main },
    },
    "& .MuiInputLabel-root": { color: theme.palette.text.secondary },
    "& .MuiInputLabel-root.Mui-focused": { color: theme.palette.primary.main },
    "& .MuiSvgIcon-root": { color: theme.palette.text.secondary },
  };

  const handleSave = async () => {
    if (!buyerName) return toast.error("Buyer name cannot be empty!");

    try {
      setLoading(true);

      // 1️⃣  Update basic info (name)
      const nameData = new FormData();
      nameData.append("name", buyerName);
      await adminApi.post(`/api/edit-user/${product._id}`, nameData);

      // 2️⃣  Assign membership via dedicated endpoint
      const memberData = new FormData();
      memberData.append("membership_level", membership);
      const res = await adminApi.post(
        `/api/users/${product._id}/assign-membership`,
        memberData
      );

      if (res) {
        toast.success("Buyer updated successfully!");
        close();
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
        zIndex: 1300,
        backdropFilter: "blur(6px)",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: isMobile ? "95%" : "90%",
          maxWidth: 520,
          background: theme.palette.background.paper,
          p: isMobile ? 2 : 3,
          borderRadius: 3,
          boxShadow: "0 20px 40px rgba(4,6,8,0.65)",
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography sx={{ color: theme.palette.text.primary, mb: 2, fontSize: 18, fontWeight: 600 }}>
          Edit Buyer
        </Typography>

        <Divider sx={{ borderColor: theme.palette.divider, mb: 2 }} />

        {/* Buyer Name */}
        <Typography sx={{ color: theme.palette.text.secondary, mb: 0.5, fontSize: 13 }}>
          Buyer Name
        </Typography>
        <TextField
          fullWidth
          value={buyerName}
          onChange={(e) => setBuyerName(e.target.value)}
          sx={inputSx}
        />

        {/* Membership */}
        <FormControl fullWidth sx={inputSx}>
          <InputLabel sx={{ color: theme.palette.text.secondary }}>
            Membership Plan
          </InputLabel>
          <Select
            value={membership}
            label="Membership Plan"
            onChange={(e) => setMembership(e.target.value)}
          >
            {MEMBERSHIP_OPTIONS.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Divider sx={{ borderColor: theme.palette.divider, mb: 2 }} />

        {/* Actions */}
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            onClick={close}
            sx={{
              color: theme.palette.text.secondary,
              borderColor: theme.palette.divider,
              textTransform: "none",
              "&:hover": { borderColor: theme.palette.primary.main, color: theme.palette.primary.main },
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading}
            sx={{
              background: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              textTransform: "none",
              "&:hover": { background: theme.palette.primary.light },
            }}
          >
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
