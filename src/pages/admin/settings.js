import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  useMediaQuery,
  TextField,
  Button,
  CircularProgress,
  useTheme,
} from "@mui/material";
import AdminLayout from "/src/components/AdminLayout";
import adminApi from "/src/utility/adminApi";
import { toast } from "react-toastify";

export default function Home() {
  const isMobile = useMediaQuery("(max-width:768px)");
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await adminApi.get("/api/user-me");
        const data = res.data || {};
        setForm({
          name: data.name || "",
          email: data.email || "",
          phone: data.phone || "",
        });
      } catch {
        toast.error("Failed to fetch user data");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleChange =
    (key) =>
    (e) =>
      setForm((p) => ({ ...p, [key]: e.target.value }));

  const handleSave = async () => {
    try {
      setLoading(true);
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("email", form.email);
      fd.append("phone", form.phone);
      await adminApi.post("/api/user-me", fd);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Box
        sx={{
          backgroundColor: theme.palette.background.default,
          minHeight: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: 3,
            p: isMobile ? 3 : 5,
            width: "100%",
            maxWidth: 520,
            border: `1px solid ${theme.palette.divider}`,
            boxShadow: "0 28px 60px rgba(4,6,8,0.5)",
          }}
        >
          <Typography
            variant={isMobile ? "h5" : "h4"}
            sx={{
              mb: 3,
              textAlign: "center",
              fontWeight: 700,
              color: theme.palette.primary.main,
            }}
          >
            Account Settings
          </Typography>

          <Box sx={{ display: "grid", gap: 2.5 }}>
            <TextField
              label="Name"
              value={form.name}
              onChange={handleChange("name")}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: theme.palette.background.subtle,
                  color: theme.palette.text.primary,
                  borderRadius: 2,
                  "& fieldset": { borderColor: theme.palette.divider },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.text.secondary,
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: theme.palette.primary.main,
                },
              }}
            />

            <TextField
              label="Email"
              value={form.email}
              onChange={handleChange("email")}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: theme.palette.background.subtle,
                  color: theme.palette.text.primary,
                  borderRadius: 2,
                  "& fieldset": { borderColor: theme.palette.divider },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.text.secondary,
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: theme.palette.primary.main,
                },
              }}
            />

            <TextField
              label="Phone"
              value={form.phone}
              onChange={handleChange("phone")}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: theme.palette.background.subtle,
                  color: theme.palette.text.primary,
                  borderRadius: 2,
                  "& fieldset": { borderColor: theme.palette.divider },
                  "&:hover fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: theme.palette.primary.main,
                  },
                },
                "& .MuiInputLabel-root": {
                  color: theme.palette.text.secondary,
                },
                "& .MuiInputLabel-root.Mui-focused": {
                  color: theme.palette.primary.main,
                },
              }}
            />

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={loading}
              sx={{
                mt: 1,
                backgroundColor: theme.palette.primary.main,
                color: theme.palette.primary.contrastText,
                fontWeight: 700,
                borderRadius: 2,
                py: 1.3,
                textTransform: "none",
                "&:hover": {
                  backgroundColor: theme.palette.primary.light,
                },
              }}
            >
              {loading ? (
                <CircularProgress
                  size={22}
                  sx={{ color: theme.palette.primary.contrastText }}
                />
              ) : (
                "Save Changes"
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </AdminLayout>
  );
}
